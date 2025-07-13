import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../lib/auth";
import { sendEmail, emailTemplates } from "../lib/email";

const createEventSchema = z.object({
  name: z.string().min(1),
  venue: z.string().min(1),
  date: z.string().datetime(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  description: z.string().optional(),
});

const updateEventSchema = createEventSchema.partial();

export const getEvents: RequestHandler = async (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;

    const events = await prisma.event.findMany({
      where: {
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
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        staff: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: {
            songRequests: true,
            drinkOrders: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    res.json({ events });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

export const createEvent: RequestHandler = async (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const eventData = createEventSchema.parse(req.body);

    const event = await prisma.event.create({
      data: {
        name: eventData.name,
        venue: eventData.venue,
        description: eventData.description,
        date: new Date(eventData.date),
        startTime: new Date(eventData.startTime),
        endTime: eventData.endTime ? new Date(eventData.endTime) : null,
        ownerId: user.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        staff: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({ event });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Create event error:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
};

export const getEvent: RequestHandler = async (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const { id } = req.params;

    const event = await prisma.event.findFirst({
      where: {
        id,
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
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        staff: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        songRequests: {
          include: {
            requester: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        drinkOrders: {
          include: {
            drink: true,
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ event });
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

export const updateEvent: RequestHandler = async (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const { id } = req.params;
    const updateData = updateEventSchema.parse(req.body);

    // Check if user owns the event or is a company user
    const existingEvent = await prisma.event.findFirst({
      where: {
        id,
        OR: [
          { ownerId: user.id },
          { owner: { role: "COMPANY" }, staff: { some: { userId: user.id } } },
        ],
      },
    });

    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found or unauthorized" });
    }

    const processedData: any = { ...updateData };
    if (updateData.date) processedData.date = new Date(updateData.date);
    if (updateData.startTime)
      processedData.startTime = new Date(updateData.startTime);
    if (updateData.endTime)
      processedData.endTime = new Date(updateData.endTime);

    const event = await prisma.event.update({
      where: { id },
      data: processedData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        staff: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    res.json({ event });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Update event error:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
};

export const deleteEvent: RequestHandler = async (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const { id } = req.params;

    // Check if user owns the event
    const existingEvent = await prisma.event.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
    });

    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found or unauthorized" });
    }

    await prisma.event.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
};
