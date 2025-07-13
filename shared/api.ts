/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Dashboard API types
 */
export interface DashboardStats {
  totalEvents: number;
  totalEarnings: number;
  totalSongRequests: number;
  activeEvents: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface Event {
  id: string;
  name: string;
  venue: string;
  date: string;
  startTime: string;
  endTime?: string;
  status: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  upcomingEvents: Event[];
}
