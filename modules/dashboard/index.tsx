"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useDashboardStatistics } from "@/api/hooks/use-dashboard-statistics";

/* =======================
   TYPES
======================= */

interface Summary {
  total_revenue: number;
  total_tickets: number;
  total_showtimes: number;
  total_movies_showing: number;
}

interface ChartItem {
  date: string;
  revenue: number;
}

interface LatestBooking {
  id: number;
  booking_code: string;
  customer_name: string;
  movie: string;
  room: string;
  total_amount: number;
  payment_status: "paid" | "pending";
  booking_status: string;
  created_at: string;
}

interface UpcomingShowtime {
  movie: string;
  date: string;
  time: string;
  room: string;
  sold: number;
  total: number;
}

interface DashboardData {
  summary: Summary;
  chart: ChartItem[];
  latest_bookings: LatestBooking[];
  upcoming_showtimes: UpcomingShowtime[];
}

/* =======================
   COMPONENT
======================= */

const DashboardStatistics: React.FC = () => {
  const { data, isLoading } = useDashboardStatistics("7d");

  if (isLoading || !data) {
    return (
      <div className="w-full bg-white px-4 py-6 text-sm text-slate-500">
        Đang tải dữ liệu dashboard...
      </div>
    );
  }

  const dashboardData = data as DashboardData;

  const stats = [
    {
      label: "Doanh thu hôm nay",
      value: `${dashboardData.summary.total_revenue.toLocaleString("vi-VN")}₫`,
    },
    {
      label: "Vé đã bán hôm nay",
      value: `${dashboardData.summary.total_tickets} vé`,
    },
    {
      label: "Suất chiếu hôm nay",
      value: `${dashboardData.summary.total_showtimes} suất`,
    },
    {
      label: "Phim đang chiếu",
      value: `${dashboardData.summary.total_movies_showing} phim`,
    },
  ];

  return (
    <div className="w-full bg-white text-slate-900">
      <section className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4">
        {/* HEADER */}
        <header className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-semibold">Thống kê hệ thống</h1>
            <p className="mt-1 text-xs text-slate-500">
              Tổng quan hoạt động rạp chiếu phim SmartTicket
            </p>
          </div>

          <select className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-xs outline-none">
            <option>Hôm nay</option>
            <option>7 ngày gần nhất</option>
            <option>30 ngày gần nhất</option>
          </select>
        </header>

        {/* SUMMARY CARDS */}
        <section className="grid gap-3 md:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                {item.label}
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        {/* MAIN CONTENT */}
        <section className="grid gap-4 md:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-4 md:col-span-2">
            {/* REVENUE CHART */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold">
                  Doanh thu 7 ngày gần nhất
                </h2>
                <span className="text-[11px] text-slate-500">VNĐ</span>
              </div>

              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value: number) =>
                        `${value / 1_000_000}M`
                      }
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        `${value.toLocaleString("vi-VN")} ₫`
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* UPCOMING SHOWTIMES */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <h2 className="mb-2 text-sm font-semibold">
                Suất chiếu sắp diễn ra
              </h2>

              {dashboardData.upcoming_showtimes.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Không có suất chiếu sắp tới
                </p>
              ) : (
                <table className="w-full text-left text-[11px]">
                  <thead className="border-b text-slate-500">
                    <tr>
                      <th>Phim</th>
                      <th>Ngày</th>
                      <th>Giờ</th>
                      <th>Phòng</th>
                      <th className="text-right">Đã bán</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {dashboardData.upcoming_showtimes.map((show) => (
                      <tr key={`${show.movie}-${show.time}`}>
                        <td className="font-medium">{show.movie}</td>
                        <td>{show.date}</td>
                        <td>{show.time}</td>
                        <td>{show.room}</td>
                        <td className="text-right">
                          {show.sold}/{show.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            {/* PAYMENT METHOD */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <h2 className="mb-2 text-sm font-semibold">
                Phương thức thanh toán
              </h2>
              <ul className="space-y-1 text-[11px]">
                <li> VNPay: 100%</li>
              </ul>
            </div>

            {/* LATEST BOOKINGS */}
            <div className="h-[260px] rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <h2 className="mb-2 text-sm font-semibold">Đơn vé mới nhất</h2>

              <div className="h-full overflow-y-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="border-b text-slate-500">
                    <tr>
                      <th>Mã</th>
                      <th>Khách</th>
                      <th>Giờ</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {dashboardData.latest_bookings.map((bk) => (
                      <tr key={bk.id}>
                        <td>{bk.booking_code}</td>
                        <td>{bk.customer_name}</td>
                        <td>{bk.created_at.slice(11, 16)}</td>
                        <td>
                          <span
                            className={`rounded-full px-2 py-[2px] text-[10px]
                              ${
                                bk.payment_status === "paid"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                          >
                            {bk.payment_status === "paid"
                              ? "Đã thanh toán"
                              : "Chờ thanh toán"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default DashboardStatistics;
