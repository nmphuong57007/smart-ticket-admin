"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";

import { useDashboardStatistics } from "@/api/hooks/use-dashboard-statistics";
import {
  DashboardRange,
  DashboardMovieStatistic,
} from "@/api/interfaces/dashboard-interface";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

/* =======================
   TYPES
======================= */

type PresetType = "today" | "7d" | "30d" | "custom";

interface UpcomingShowtime {
  movie: string;
  date: string;
  time: string;
  room: string;
  sold: number;
  capacity: number;
}

interface LatestBooking {
  id: number;
  booking_code: string;
  customer_name: string;
  payment_status: "paid" | "pending";
  created_at: string | null;
}

/* =======================
   HELPERS (FIX LÙI NGÀY)
======================= */

const getMoviePerformance = (fillPercent: number) => {
  if (fillPercent >= 70) return { label: "Bán chạy", color: "green" };
  if (fillPercent >= 40) return { label: "Trung bình", color: "yellow" };
  return { label: "Ít người xem", color: "red" };
};

/**
 * string (YYYY-MM-DD) -> Date (LOCAL)
 * ❌ không dùng new Date(string)
 */
const toDate = (value?: string): Date | undefined => {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/**
 * Date -> string (YYYY-MM-DD) theo LOCAL TIME
 * ❌ không dùng toISOString
 */
const toString = (date?: Date): string | undefined => {
  if (!date) return undefined;

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

/* =======================
   COMPONENT
======================= */

const DashboardStatistics = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* =======================
     INIT STATE FROM URL
  ======================= */

  const initialPreset =
    (searchParams.get("preset") as PresetType) ?? "7d";

  const [preset, setPreset] = useState<PresetType>(initialPreset);
  const [range, setRange] = useState<DashboardRange>(
    initialPreset !== "custom" ? initialPreset : "7d"
  );

  const [fromDate, setFromDate] = useState<string | undefined>(
    searchParams.get("from") ?? undefined
  );
  const [toDateState, setToDateState] = useState<string | undefined>(
    searchParams.get("to") ?? undefined
  );

  /* =======================
     VALIDATE DATE
  ======================= */

  const isDateValid = useMemo(() => {
    if (!fromDate || !toDateState) return true;
    return toDate(fromDate)! <= toDate(toDateState)!;
  }, [fromDate, toDateState]);

  useEffect(() => {
    if (!isDateValid) {
      toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc");
    }
  }, [isDateValid]);

  /* =======================
     SYNC URL (NO RELOAD)
  ======================= */

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("preset", preset);

    if (preset === "custom") {
      if (fromDate) params.set("from", fromDate);
      if (toDateState) params.set("to", toDateState);
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [preset, fromDate, toDateState, router]);

  /* =======================
     CALL API
  ======================= */

  const shouldFetch =
    preset !== "custom" || (fromDate && toDateState && isDateValid);

  const { data, isLoading } = useDashboardStatistics(
    shouldFetch
      ? {
          range: preset === "custom" ? undefined : range,
          from_date: preset === "custom" ? fromDate : undefined,
          to_date: preset === "custom" ? toDateState : undefined,
        }
      : {}
  );

  if (isLoading || !data) {
    return (
      <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
        Đang tải dữ liệu dashboard...
      </div>
    );
  }

  const {
    summary,
    chart,
    latest_bookings,
    upcoming_showtimes,
    movies_statistics,
  } = data;

  const presetLabel: Record<PresetType, string> = {
    today: "Hôm nay",
    "7d": "7 ngày gần nhất",
    "30d": "30 ngày gần nhất",
    custom: "Tùy chọn",
  };

  const filterDescription =
    preset === "custom" && fromDate && toDateState
      ? `Từ ${fromDate} → ${toDateState}`
      : presetLabel[preset];

  const handlePresetChange = (value: PresetType) => {
    setPreset(value);

    if (value !== "custom") {
      setRange(value);
      setFromDate(undefined);
      setToDateState(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-6 text-slate-900">
      <div className="mx-auto max-w-[1280px] space-y-6">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">Thống kê hệ thống</h1>
            <p className="text-xs text-slate-500">
              Tổng quan hoạt động rạp chiếu phim SmartTicket
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Đang xem dữ liệu:{" "}
              <span className="rounded-full bg-indigo-50 px-2 py-[2px] text-indigo-600">
                {filterDescription}
              </span>
            </p>
          </div>

          {/* FILTER */}
          <div className="flex items-center gap-2">
            <select
              value={preset}
              onChange={(e) =>
                handlePresetChange(e.target.value as PresetType)
              }
              className="rounded-lg border bg-white px-3 py-1.5 text-sm shadow-sm"
            >
              <option value="today">Hôm nay</option>
              <option value="7d">7 ngày</option>
              <option value="30d">30 ngày</option>
              <option value="custom">Tùy chọn</option>
            </select>

            {preset === "custom" && (
              <div className="flex items-center gap-2">
                {/* FROM */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[140px] justify-start text-left text-sm font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ?? "Từ ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate(fromDate)}
                      onSelect={(date) =>
                        setFromDate(toString(date))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <span className="text-slate-400">→</span>

                {/* TO */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[140px] justify-start text-left text-sm font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDateState ?? "Đến ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate(toDateState)}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date > today;
                      }}
                      onSelect={(date) => {
                        if (!date) return;

                        const localDate = new Date(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate()
                        );

                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (localDate > today) {
                          toast.error(
                            "Không được chọn ngày lớn hơn ngày hiện tại"
                          );
                          return;
                        }

                        setToDateState(toString(localDate));
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard
            label={`Doanh thu ${presetLabel[preset]}`}
            value={`${summary.total_revenue.toLocaleString("vi-VN")} ₫`}
          />
          <StatCard
            label={`Vé đã bán ${presetLabel[preset]}`}
            value={`${summary.total_tickets} vé`}
          />
          <StatCard
            label={`Suất chiếu ${presetLabel[preset]}`}
            value={`${summary.total_showtimes} suất`}
          />
          <StatCard
            label="Phim đang chiếu"
            value={`${summary.total_movies_showing} phim`}
          />
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold">
                Doanh thu {presetLabel[preset]}
              </h2>

              {chart.length === 0 ? (
                <div className="flex h-[220px] items-center justify-center text-sm text-slate-400">
                  Không có dữ liệu doanh thu
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chart}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis
                      fontSize={12}
                      tickFormatter={(v) => `${v / 1_000_000}M`}
                    />
                    <Tooltip
                      formatter={(v: number) =>
                        `${v.toLocaleString("vi-VN")} ₫`
                      }
                    />
                    <Line
                      dataKey="revenue"
                      stroke="#4F46E5"
                      strokeWidth={2.5}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <MovieStatisticsTable movies={movies_statistics} />
          </div>

          <div className="space-y-6">
            <UpcomingShowtimes data={upcoming_showtimes} />
            <LatestBookings data={latest_bookings} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* =======================
   SUB COMPONENTS
======================= */

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border bg-white p-4 shadow-sm">
    <p className="text-[11px] uppercase text-slate-500">{label}</p>
    <p className="mt-2 text-xl font-semibold">{value}</p>
  </div>
);

const MovieStatisticsTable = ({
  movies,
}: {
  movies: DashboardMovieStatistic[];
}) => {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-800">
        Thống kê theo phim
      </h2>

      <div className="max-h-[260px] overflow-y-auto">
        <table className="w-full text-xs border-separate border-spacing-y-1">
          <thead className="sticky top-0 bg-white border-b text-slate-500">
            <tr>
              <th className="text-left">Phim</th>
              <th className="text-center">Suất</th>
              <th className="text-center">Tổng ghế</th>
              <th className="text-center">Đã bán</th>
              <th className="text-right">Doanh thu</th>
              <th className="text-right">Đánh giá</th>
            </tr>
          </thead>
          <tbody>
            {movies.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-slate-400"
                >
                  Không có dữ liệu thống kê
                </td>
              </tr>
            )}

            {movies.map((m) => {
              const perf = getMoviePerformance(m.fill_percent);

              return (
                <tr
                  key={m.movie_id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-2 py-2 font-medium">
                    {m.movie}
                  </td>
                  <td className="text-center">{m.total_showtimes}</td>
                  <td className="text-center">{m.total_seats}</td>
                  <td className="text-center">{m.sold_tickets}</td>
                  <td className="text-right">
                    {m.revenue.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="text-right">
                    <span
                      className={`rounded-full px-2 py-[3px] text-[10px] font-medium
                        ${
                          perf.color === "green"
                            ? "bg-emerald-50 text-emerald-700"
                            : perf.color === "yellow"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }
                      `}
                    >
                      {perf.label} ({m.fill_percent}%)
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UpcomingShowtimes = ({
  data,
}: {
  data: UpcomingShowtime[];
}) => (
  <div className="rounded-2xl border bg-white p-5 shadow-sm">
    <h2 className="mb-3 text-sm font-semibold">
      Suất chiếu sắp diễn ra
    </h2>
    <div className="max-h-[260px] space-y-3 overflow-y-auto">
      {data.length === 0 ? (
        <div className="text-center text-sm text-slate-400">
          Chưa có suất chiếu sắp tới
        </div>
      ) : (
        data.map((st, idx) => {
          const percent =
            st.capacity > 0
              ? Math.round((st.sold / st.capacity) * 100)
              : 0;
          return (
            <div key={idx} className="rounded-xl border p-3">
              <p className="text-sm font-medium">{st.movie}</p>
              <p className="mt-1 text-xs text-slate-500">
                {st.date} • {st.time} • {st.room}
              </p>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-indigo-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-1 text-right text-[11px] text-slate-400">
                {st.sold}/{st.capacity} • {percent}%
              </p>
            </div>
          );
        })
      )}
    </div>
  </div>
);

const LatestBookings = ({
  data,
}: {
  data: LatestBooking[];
}) => (
  <div className="rounded-2xl border bg-white p-5 shadow-sm">
    <h2 className="mb-3 text-sm font-semibold">
      Đơn vé mới nhất
    </h2>
    <div className="max-h-[260px] overflow-y-auto">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-white border-b text-slate-500">
          <tr>
            <th>Mã</th>
            <th>Khách</th>
            <th>Giờ</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((bk) => (
            <tr key={bk.id}>
              <td className="py-2">{bk.booking_code}</td>
              <td>{bk.customer_name}</td>
              <td>{bk.created_at?.slice(11, 16) ?? "--:--"}</td>
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
                    : "Chưa thanh toán"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DashboardStatistics;
