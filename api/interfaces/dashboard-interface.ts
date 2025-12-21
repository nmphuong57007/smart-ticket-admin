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

export interface DashboardLatestBooking {
  id: number;
  booking_code: string;
  customer_name: string;
  payment_status: "paid" | "pending";
  created_at: string | null;
}

export interface DashboardUpcomingShowtime {
  movie: string;
  date: string;
  time: string;
  room: string;
  sold: number;
  capacity: number;
}

export interface DashboardMovieStatistic {
  movie_id: number;
  movie: string;
  total_showtimes: number;
  total_seats: number;
  sold_tickets: number;
  empty_seats: number;
  revenue: number;
  fill_percent: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  chart: DashboardChartItem[];
  latest_bookings: DashboardLatestBooking[];
  upcoming_showtimes: DashboardUpcomingShowtime[];
  movies_statistics: DashboardMovieStatistic[];
  meta: {
    range: string;
    from: string;
    to: string;
  };
}

export interface DashboardQuery {
  range?: DashboardRange;
  from_date?: string;
  to_date?: string;
}
