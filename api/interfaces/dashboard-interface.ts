export type DashboardRange = "today" | "7d" | "30d";

export interface DashboardSummary {
  total_revenue: number;
  total_tickets: number;
  total_showtimes: number;
  total_movies_showing: number;
}

export interface DashboardChartItem {
  date: string;
  revenue: number;
}

export interface LatestBooking {
  id: number;
  booking_code: string;
  customer_name: string | null;
  movie: string | null;
  room: string | null;
  total_amount: number;
  payment_status: "paid" | "pending" | "failed" | "refunded";
  booking_status: string;
  created_at: string | null;
}

export interface UpcomingShowtime {
  movie: string;
  date: string;
  time: string;
  room: string;
  sold: number;
  capacity: number;
  percent: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  chart: DashboardChartItem[];
  latest_bookings: LatestBooking[];
  upcoming_showtimes: UpcomingShowtime[];
  meta: {
    range: DashboardRange;
    from: string;
    to: string;
  };
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}
