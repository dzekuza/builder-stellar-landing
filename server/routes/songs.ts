import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../lib/auth";
import { sendEmail, emailTemplates } from "../lib/email";

const createSongRequestSchema = z.object({
  song: z.string().min(1),
  artist: z.string().min(1),
  amount: z.number().min(0),
  eventId: z.string(),
});

const updateSongRequestSchema = z.object({
  status: z.enum(["PENDING", "PLAYING", "PLAYED", "DECLINED"]),
});

export const getSongRequests: RequestHandler = async (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const { eventId } = req.query;

    const whereClause: any = {
      event: {
        OR: [
          { ownerId: user.id },
          {
            staff: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      },
    };

    if (eventId) {
      whereClause.eventId = eventId as string;
    }

    const songRequests = await prisma.songRequest.findMany({
      where: whereClause,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            venue: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ songRequests });
  } catch (error) {
    console.error("Get song requests error:", error);
    res.status(500).json({ error: "Failed to fetch song requests" });
  }
};

export const createSongRequest: RequestHandler = async (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const requestData = createSongRequestSchema.parse(req.body);

    // Verify the event exists and is active
    const event = await prisma.event.findUnique({
      where: { id: requestData.eventId },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (!event.isActive) {
      return res.status(400).json({ error: "Event is not currently active" });
    }

    const songRequest = await prisma.songRequest.create({
      data: {
        song: requestData.song,
        artist: requestData.artist,
        amount: requestData.amount,
        eventId: requestData.eventId,
        requesterId: user.id,
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            venue: true,
          },
        },
      },
    });

    // Send email notification to event owner
    try {
      const emailTemplate = emailTemplates.songRequestReceived(
        songRequest.song,
        songRequest.artist,
        songRequest.amount,
        songRequest.event.name,
      );

      await sendEmail({
        to: songRequest.event.owner.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });
    } catch (emailError) {
      console.error("Failed to send song request email:", emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({ songRequest });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Create song request error:", error);
    res.status(500).json({ error: "Failed to create song request" });
  }
};

export const updateSongRequest: RequestHandler = async (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const { id } = req.params;
    const updateData = updateSongRequestSchema.parse(req.body);

    // Check if user has permission to update this song request
    const existingSongRequest = await prisma.songRequest.findFirst({
      where: {
        id,
        event: {
          OR: [
            { ownerId: user.id },
            {
              staff: {
                some: {
                  userId: user.id,
                },
              },
            },
          ],
        },
      },
    });

    if (!existingSongRequest) {
      return res
        .status(404)
        .json({ error: "Song request not found or unauthorized" });
    }

    const songRequest = await prisma.songRequest.update({
      where: { id },
      data: {
        ...updateData,
        playedAt: updateData.status === "PLAYED" ? new Date() : null,
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            venue: true,
          },
        },
      },
    });

    res.json({ songRequest });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Update song request error:", error);
    res.status(500).json({ error: "Failed to update song request" });
  }
};
