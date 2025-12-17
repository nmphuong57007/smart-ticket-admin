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
  customer_name: string;
  created_at: string;
  payment_status: "paid" | "pending";
}

export interface UpcomingShowtime {
  movie: string;
  date: string;
  time: string;
  room: string;
  sold: number;
  total: number;
}

/* ✅ EXPORT ĐÚNG TÊN */
export interface DashboardResponse {
  success: boolean;
  data: {
    summary: DashboardSummary;
    chart: DashboardChartItem[];
    latest_bookings: LatestBooking[];
    upcoming_showtimes: UpcomingShowtime[];
  };
}
