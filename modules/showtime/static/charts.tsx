"use client";

import { useState } from "react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useShowtimeStatisticsAll,
  useShowtimeStatisticsByDate,
} from "@/api/hooks/use-showtime-static";

import { Popover } from "@radix-ui/react-popover";
import { PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  ChevronDownIcon,
  LucideCheck,
  LucideClapperboard,
  LucideClock3,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface ChartsProps {
  isLoading?: boolean;
}

export default function Charts({ isLoading }: ChartsProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [openCalendar, setOpenCalendar] = useState(false);

  // ========= PAGINATION =========
  const [page, setPage] = useState<number>(1);
  const perPage = 5;

  // Fetch tổng suất chiếu
  const { data: allStats, isLoading: isLoadingAll } =
    useShowtimeStatisticsAll();

  // Fetch thống kê theo ngày
  const { data: dayStats, isLoading: isLoadingDate } =
    useShowtimeStatisticsByDate(selectedDate);

  // 🔄 Skeleton từ trang cha
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  // Reset page khi chọn ngày mới
  if (selectedDate && page !== 1 && dayStats?.showtimes) {
    const maxPage = Math.ceil(dayStats.showtimes.length / perPage);
    if (page > maxPage) setPage(1);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Thống kê suất chiếu</h1>

      {/* ======================= CHỌN NGÀY ======================= */}
      <div className="flex items-center gap-3">
        {/* TẤT CẢ */}
        <Button
          variant={!selectedDate ? "default" : "outline"}
          onClick={() => setSelectedDate("")}
        >
          Tất cả
        </Button>

        {/* CALENDAR POPUP */}
        <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-between">
              {selectedDate
                ? moment(selectedDate).format("DD/MM/YYYY")
                : "Chọn ngày"}
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate ? new Date(selectedDate) : undefined}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date.toLocaleDateString("en-CA")); // YYYY-MM-DD
                  setPage(1); // reset page
                }
                setOpenCalendar(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* ======================= TẤT CẢ ======================= */}
      {!selectedDate && (
        <div className="rounded-md border p-4 space-y-3">
          {isLoadingAll ? (
            <Spinner className="mx-auto" />
          ) : (
            <ul>
              <li>
                <div className="flex items-center gap-4 font-medium">
                  <LucideClock3 className="w-5 h-5 text-gray-700 mr-4" />
                  Tổng suất chiếu: {allStats?.total_showtimes}
                </div>
              </li>
              <li>
                <div className="flex items-center gap-4 font-medium">
                  <LucideClapperboard className="w-5 h-5 text-gray-700 mr-4" />
                  Tổng phim: {allStats?.total_movies}
                </div>
              </li>
              <li>
                <div className="flex items-center gap-4 font-medium">
                  <LucideCheck className="w-5 h-5 text-gray-700 mr-4" />
                  Tổng phòng chiếu: {allStats?.total_rooms}
                </div>
              </li>
            </ul>
          )}
        </div>
      )}

      {/* ======================= THEO NGÀY ======================= */}
      {selectedDate && (
        <div className="rounded-md border p-4 space-y-4">
          {isLoadingDate ? (
            <Spinner className="mx-auto" />
          ) : (
            <>
              <h2 className="text-lg font-bold">
                Ngày: {moment(dayStats?.date).format("DD/MM/YYYY")}
              </h2>

              <ul>
                <li>
                  <div className="flex items-center gap-4 font-medium">
                    <LucideClock3 className="w-5 h-5 text-gray-700 mr-4" />
                    Suất chiếu: {dayStats?.total_showtimes}
                  </div>
                </li>
                <li>
                  <div className="flex items-center gap-4 font-medium">
                    <LucideClapperboard className="w-5 h-5 text-gray-700 mr-4" />
                    Phim: {dayStats?.total_movies}
                  </div>
                </li>
                <li>
                  <div className="flex items-center gap-4 font-medium">
                    <LucideCheck className="w-5 h-5 text-gray-700 mr-4" />
                    Phòng chiếu: {dayStats?.total_rooms}
                  </div>
                </li>
              </ul>

              {/* ======================= LIST + PAGINATION ======================= */}
              {dayStats?.showtimes && (
                <>
                  {/** Tính toán phân trang */}
                  {(() => {
                    const total = dayStats.showtimes.length;
                    const lastPage = Math.ceil(total / perPage);

                    const start = (page - 1) * perPage;
                    const paginated = dayStats.showtimes.slice(
                      start,
                      start + perPage
                    );

                    return (
                      <>
                        {/* LIST */}
                        <div className="space-y-4 mt-4">
                          {paginated.map((item) => (
                            <div
                              key={item.id}
                              className="border rounded-md p-4 shadow-sm bg-white"
                            >
                              <div className="font-medium text-lg">
                                {item.movie.title}
                              </div>
                              <div className="text-sm opacity-80">
                                {item.room.name} • {item.format.toUpperCase()}
                              </div>

                              <div className="text-sm mt-1">
                                {item.show_time} → {item.end_time}
                              </div>

                              <div className="text-sm">
                                {item.language_type === "sub"
                                  ? "Phụ đề"
                                  : item.language_type === "dub"
                                  ? "Lồng tiếng"
                                  : "Thuyết minh"}
                              </div>

                              <div className="text-sm">
                                {item.price.toLocaleString()} đ
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* PAGINATION */}
                        {lastPage > 1 && (
                          <div className="flex justify-between items-center mt-6">
                            <Button
                              variant="outline"
                              disabled={page === 1}
                              onClick={() => setPage((p) => p - 1)}
                            >
                              Trang trước
                            </Button>

                            <span>
                              Trang {page} / {lastPage}
                            </span>

                            <Button
                              variant="outline"
                              disabled={page === lastPage}
                              onClick={() => setPage((p) => p + 1)}
                            >
                              Trang sau
                            </Button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
