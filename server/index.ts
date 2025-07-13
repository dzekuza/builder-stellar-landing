import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { authenticateToken } from "./lib/auth";
import { register, login, me } from "./routes/auth";
import {
  getEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
} from "./routes/events";
import {
  getSongRequests,
  createSongRequest,
  updateSongRequest,
} from "./routes/songs";
import { getDashboardStats, getAnalytics } from "./routes/analytics";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Public routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });
  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.get("/api/auth/me", authenticateToken, me);

  // Protected routes
  app.use("/api", authenticateToken); // Apply auth middleware to all subsequent routes

  // Event routes
  app.get("/api/events", getEvents);
  app.post("/api/events", createEvent);
  app.get("/api/events/:id", getEvent);
  app.put("/api/events/:id", updateEvent);
  app.delete("/api/events/:id", deleteEvent);

  // Song request routes
  app.get("/api/song-requests", getSongRequests);
  app.post("/api/song-requests", createSongRequest);
  app.put("/api/song-requests/:id", updateSongRequest);

  // Analytics routes
  app.get("/api/dashboard/stats", getDashboardStats);
  app.get("/api/analytics", getAnalytics);

  return app;
}
