import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "../lib/auth";

export const getDashboardStats: RequestHandler = async (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const { timeframe = "month" } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const whereClause = {
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
      createdAt: {
        gte: startDate,
      },
    };

    // Get basic stats
    const [totalEvents, totalEarnings, totalSongRequests, activeEvents] =
      await Promise.all([
        prisma.event.count({ where: whereClause }),
        prisma.event.aggregate({
          where: whereClause,
          _sum: {
            totalEarnings: true,
          },
        }),
        prisma.songRequest.count({
          where: {
            event: whereClause,
          },
        }),
        prisma.event.count({
          where: {
            ...whereClause,
            isActive: true,
          },
        }),
      ]);

    // Get recent activity based on user role
    let recentActivity = [];
    if (user.role === "DJ" || user.role === "HOST") {
      // Recent song requests
      const recentSongRequests = await prisma.songRequest.findMany({
        where: {
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
        include: {
          requester: {
            select: {
              name: true,
            },
          },
          event: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      });

      recentActivity = recentSongRequests.map((req) => ({
        id: req.id,
        type: "song_request",
        title: `${req.song} by ${req.artist}`,
        subtitle: `Requested by ${req.requester.name} for ${req.event.name}`,
        amount: req.amount,
        status: req.status,
        createdAt: req.createdAt,
      }));
    } else if (user.role === "BARISTA") {
      // Recent drink orders
      const recentOrders = await prisma.drinkOrder.findMany({
        where: {
          event: {
            staff: {
              some: {
                userId: user.id,
                role: "BARISTA",
              },
            },
          },
        },
        include: {
          drink: true,
          customer: {
            select: {
              name: true,
            },
          },
          event: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      });

      recentActivity = recentOrders.map((order) => ({
        id: order.id,
        type: "drink_order",
        title: `${order.quantity}x ${order.drink.name}`,
        subtitle: `Ordered by ${order.customer.name} for ${order.event.name}`,
        amount: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
      }));
    }

    // Get upcoming events
    const upcomingEvents = await prisma.event.findMany({
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
        date: {
          gte: new Date(),
        },
        status: "UPCOMING",
      },
      orderBy: {
        date: "asc",
      },
      take: 5,
    });

    res.json({
      stats: {
        totalEvents,
        totalEarnings: totalEarnings._sum.totalEarnings || 0,
        totalSongRequests,
        activeEvents,
      },
      recentActivity,
      upcomingEvents,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

export const getAnalytics: RequestHandler = async (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const { timeframe = "month" } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    let dateFormat: string;

    switch (timeframe) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFormat = "day";
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        dateFormat = "month";
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFormat = "day";
    }

    // Get earnings over time
    const earningsData = await prisma.event.groupBy({
      by: ["date"],
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
        date: {
          gte: startDate,
        },
      },
      _sum: {
        totalEarnings: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Get top songs (for DJs) or top drinks (for baristas)
    let topItems = [];
    if (user.role === "DJ" || user.role === "HOST") {
      const topSongs = await prisma.songRequest.groupBy({
        by: ["song", "artist"],
        where: {
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
          createdAt: {
            gte: startDate,
          },
        },
        _count: {
          id: true,
        },
        _sum: {
          amount: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
        take: 10,
      });

      topItems = topSongs.map((song) => ({
        name: `${song.song} by ${song.artist}`,
        count: song._count.id,
        earnings: song._sum.amount || 0,
      }));
    } else if (user.role === "BARISTA") {
      const topDrinks = await prisma.drinkOrder.groupBy({
        by: ["drinkId"],
        where: {
          event: {
            staff: {
              some: {
                userId: user.id,
                role: "BARISTA",
              },
            },
          },
          createdAt: {
            gte: startDate,
          },
        },
        _count: {
          id: true,
        },
        _sum: {
          totalPrice: true,
          quantity: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
        take: 10,
      });

      // Get drink names
      const drinkIds = topDrinks.map((d) => d.drinkId);
      const drinks = await prisma.drink.findMany({
        where: {
          id: {
            in: drinkIds,
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      const drinkMap = new Map(drinks.map((d) => [d.id, d.name]));

      topItems = topDrinks.map((drink) => ({
        name: drinkMap.get(drink.drinkId) || "Unknown",
        count: drink._sum.quantity || 0,
        earnings: drink._sum.totalPrice || 0,
      }));
    }

    res.json({
      earningsData: earningsData.map((data) => ({
        date: data.date,
        earnings: data._sum.totalEarnings || 0,
      })),
      topItems,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
