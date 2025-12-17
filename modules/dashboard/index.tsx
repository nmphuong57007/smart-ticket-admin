"use client";

import React, { useState } from "react";
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

type RangeType = "today" | "7d" | "30d";

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
  customer_name: string | null;
  payment_status: "paid" | "pending" | "failed" | "refunded";
  created_at: string;
}

interface UpcomingShowtime {
  movie: string;
  date: string;
  time: string;
  room: string;
  sold: number;
  capacity: number;
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
  /* RANGE STATE */
  const [range, setRange] = useState<RangeType>("today");

  /* CALL API */
  const { data, isLoading } = useDashboardStatistics(range);

  if (isLoading || !data) {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Đang tải dữ liệu dashboard...
      </div>
    );
  }

  const dashboard = data as DashboardData;

  const rangeLabel: Record<RangeType, string> = {
    today: "Hôm nay",
    "7d": "7 ngày gần nhất",
    "30d": "30 ngày gần nhất",
  };

  const stats = [
    {
      label: `Doanh thu ${rangeLabel[range]}`,
      value: `${dashboard.summary.total_revenue.toLocaleString("vi-VN")} ₫`,
    },
    {
      label: `Vé đã bán ${rangeLabel[range]}`,
      value: `${dashboard.summary.total_tickets} vé`,
    },
    {
      label: `Suất chiếu ${rangeLabel[range]}`,
      value: `${dashboard.summary.total_showtimes} suất`,
    },
    {
      label: "Phim đang chiếu",
      value: `${dashboard.summary.total_movies_showing} phim`,
    },
  ];

  return (
    <div className="w-full bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-[1400px] space-y-5 px-6 py-6">
        {/* HEADER */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Thống kê hệ thống</h1>
            <p className="mt-1 text-xs text-slate-500">
              Tổng quan hoạt động rạp chiếu phim SmartTicket
            </p>
          </div>

          <select
            value={range}
            onChange={(e) => setRange(e.target.value as RangeType)}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs outline-none"
          >
            <option value="today">Hôm nay</option>
            <option value="7d">7 ngày gần nhất</option>
            <option value="30d">30 ngày gần nhất</option>
          </select>
        </header>

        {/* SUMMARY */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-[11px] font-medium uppercase text-slate-500">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            </div>
          ))}
        </section>

        {/* MAIN */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-5 lg:col-span-2">
            {/* CHART */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold">
                  Doanh thu {rangeLabel[range]}
                </h2>
                <span className="text-xs text-slate-400">VNĐ</span>
              </div>

              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={dashboard.chart}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="#e5e7eb"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={12}
                    stroke="#94a3b8"
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={12}
                    stroke="#94a3b8"
                    tickFormatter={(v) => `${v / 1_000_000}M`}
                    domain={[0, "dataMax + 1000000"]}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                    formatter={(v: number) =>
                      `${v.toLocaleString("vi-VN")} ₫`
                    }
                    labelStyle={{ color: "#64748b" }}
                  />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 2, fill: "#fff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* UPCOMING SHOWTIMES */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold">
                Suất chiếu sắp diễn ra
              </h2>

              {dashboard.upcoming_showtimes.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Không có suất chiếu sắp tới
                </p>
              ) : (
                <table className="w-full text-[12px]">
                  <thead className="border-b text-slate-500">
                    <tr>
                      <th className="py-2">Phim</th>
                      <th>Ngày</th>
                      <th>Giờ</th>
                      <th>Phòng</th>
                      <th className="text-right">Đã bán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.upcoming_showtimes.map((s) => (
                      <tr key={`${s.movie}-${s.time}`} className="border-b">
                        <td className="py-2 font-medium">{s.movie}</td>
                        <td>{s.date}</td>
                        <td>{s.time}</td>
                        <td>{s.room}</td>
                        <td className="text-right">
                          {s.sold}/{s.capacity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            {/* PAYMENT */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold">Phương thức thanh toán</h2>
              <p className="mt-2 text-xs text-slate-500">VNPay: 100%</p>
            </div>

            {/* LATEST BOOKINGS */}
            <div className="h-[280px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold">Đơn vé mới nhất</h2>

              <div className="h-full overflow-y-auto">
                <table className="w-full text-[12px]">
                  <thead className="border-b text-slate-500">
                    <tr>
                      <th>Mã</th>
                      <th>Khách</th>
                      <th>Giờ</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.latest_bookings.map((b) => (
                      <tr key={b.id} className="border-b">
                        <td className="py-2">{b.booking_code}</td>
                        <td>{b.customer_name ?? "---"}</td>
                        <td>{b.created_at.slice(11, 16)}</td>
                        <td>
                          <span
                            className={`rounded-full px-2 py-[2px] text-[10px]
                              ${
                                b.payment_status === "paid"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                          >
                            {b.payment_status === "paid"
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
