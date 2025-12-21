"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { redirectConfig } from "@/helpers/redirect-config";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useCreateShowTime } from "@/api/hooks/use-showtime-create";
import { ConflictResponse, ShowTimeCreatePayload, ShowtimeOverlapConflict, TimeRangeConflict } from "@/api/interfaces/showtimes-interface";
import type { AxiosError } from "axios";

import instance from "@/lib/instance";


// ==============================
// INTERFACES
// ==============================

export interface MovieItem {
  id: number;
  title: string;
  duration: number;
  release_date: string;
  status: string;
}

export interface RoomItem {
  id: number;
  name: string;
}


// ==============================
// ZOD SCHEMA
// ==============================

export const createShowtimeSchema = z
  .object({
    movie_id: z.coerce.number().min(1, "Phim là bắt buộc"),
    room_id: z.coerce.number().min(1, "Phòng chiếu là bắt buộc"),
    show_date: z.string().min(1, "Ngày chiếu là bắt buộc"),
    show_time: z
  .string()
  .regex(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
    "Giờ chiếu phải theo định dạng 24h HH:mm"
  ),
    language_type: z.string().min(1, "Ngôn ngữ là bắt buộc"),
  })

// ==============================
// SHOWTIME CREATE FORM
// ==============================

export default function ShowTimeCreateForm() {
  const router = useRouter();
  const { mutate: createShowTime, isPending: isCreating } =
    useCreateShowTime();

  const form = useForm({
    resolver: zodResolver(createShowtimeSchema),
    defaultValues: {
      movie_id: "",
      room_id: "",
      show_date: "",
      show_time: "",
      language_type: "",
    },
  });

  function isTimeRangeConflict(
  conflict: unknown
): conflict is TimeRangeConflict {
  return (
    typeof conflict === "object" &&
    conflict !== null &&
    "error" in conflict &&
    typeof (conflict as { error: unknown }).error === "string"
  );
}

function isShowtimeOverlapConflict(
  conflict: unknown
): conflict is ShowtimeOverlapConflict {
  return (
    typeof conflict === "object" &&
    conflict !== null &&
    "existing_showtime_id" in conflict
  );
}


  // =======================================
  // STATES (CÓ TYPE - KHÔNG ANY) ✔
  // =======================================

  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);

  const [showDate, setShowDate] = useState<Date | undefined>();
  const [openDate, setOpenDate] = useState(false);

  const watchMovie = form.watch("movie_id");

  const selectedMovie = movies.find((m) => m.id === Number(watchMovie));


  // ==============================
  // LOAD MOVIES + ROOMS (NO ANY)
  // ==============================

  useEffect(() => {
     instance.get("/api/movies/list?per_page=100").then((res) => {
    console.log("MOVIES API:", res.data);
    setMovies(res.data.data.movies); // ✔ LẤY ĐÚNG MẢNG
  });

    instance.get("/api/rooms").then((res) => {
  console.log("ROOMS API:", res.data);
  setRooms(res.data.data.items);  // ✔ ĐÚNG 100%
});

  }, []);

  // ==============================
  // SUBMIT
  // ==============================

const onSubmit = (data: z.infer<typeof createShowtimeSchema>) => {
  const now = new Date();

  // Ghép ngày + giờ chiếu
  const showDateTime = new Date(`${data.show_date}T${data.show_time}:00`);

  if (showDateTime <= now) {
    toast.error("Giờ chiếu phải lớn hơn thời gian hiện tại");
    return;
  }

  const payload: ShowTimeCreatePayload = {
    movie_id: Number(data.movie_id),
    room_id: Number(data.room_id),
    show_date: data.show_date,
    show_time: data.show_time,
    language_type: data.language_type,
  };

  createShowTime(payload, {
    onSuccess: () => {
      toast.success("Tạo suất chiếu thành công!");
      router.push(redirectConfig.showtimes);
    },

    onError: (error: AxiosError<ConflictResponse>) => {
      const res = error.response?.data;
      if (!res) {
        toast.error("Có lỗi xảy ra");
        return;
      }

      const { conflict } = res;

      //  Sai khung giờ (08:00–23:59)
      if (isTimeRangeConflict(conflict)) {
        toast.error(conflict.error);
        return;
      }

      //  Trùng lịch chiếu
      if (isShowtimeOverlapConflict(conflict)) {
        toast.error(
          <div className="space-y-1">
            <p>⛔ <b>Lịch chiếu bị trùng!</b></p>
            <p>• ID trùng: <b>{conflict.existing_showtime_id}</b></p>
            <p>• Phim: <b>{conflict.existing_movie}</b></p>
            <p>
              • Giờ trùng: {conflict.existing_start} →{" "}
              {conflict.existing_end}
            </p>
            <p>
              • Cần bắt đầu sau:{" "}
              {conflict.required_next_start}
            </p>
          </div>
        );
        return;
      }

      toast.error(res.message);
    }
  });
};

  // ==============================
  // RENDER UI
  // ==============================

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* MOVIE SELECT */}
        <FormField
          control={form.control}
          name="movie_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phim</FormLabel>
              <FormControl>
                <select
                    name={field.name}
                    value={field.value?.toString() ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    className="h-10 border rounded px-3 bg-background"
                    >
                  <option value="">Chọn phim</option>
                  {movies
                  .filter((m) => m.status !== "stopped") //Loại phim đã dừng chiếu
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.duration} phút)
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* ROOM SELECT */}
        <FormField
          control={form.control}
          name="room_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phòng chiếu</FormLabel>
              <FormControl>
                <select
                    name={field.name}
                    value={field.value?.toString() ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    className="h-10 border rounded px-3 bg-background"
                    >
                  <option value="">Chọn phòng</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


      {/* SHOW DATE */}
        <FormField
        control={form.control}
        name="show_date"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Ngày chiếu</FormLabel>
            <FormControl>
                <Popover open={openDate} onOpenChange={setOpenDate}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between w-full">
                    {showDate ? showDate.toLocaleDateString() : "Chọn ngày chiếu"}
                    <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                    <Calendar
                    mode="single"
                    selected={showDate}
                    onSelect={(date) => {
                        setShowDate(date);
                        field.onChange(date?.toLocaleDateString("en-CA")); // YYYY-MM-DD theo máy
                        setOpenDate(false);
                    }}
                    disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (date < today) return true;

                        if (selectedMovie?.release_date) {
                        const release = new Date(selectedMovie.release_date);
                        release.setHours(0, 0, 0, 0);
                        if (date < release) return true;
                        }

                        return false;
                    }}
                    />
                </PopoverContent>
                </Popover>
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />

        {/* SHOW TIME */}
        <FormField
          control={form.control}
          name="show_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giờ chiếu (24h)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric" 
                  placeholder="HH:mm (VD: 08:10)"
                  value={field.value ?? ""}

                  //Chỉ cho gõ số + phím điều hướng
                  onKeyDown={(e) => {
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ];

                    if (
                      !/^[0-9]$/.test(e.key) &&
                      !allowedKeys.includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}

                  //Chặn paste chữ / ký tự đặc biệt
                  onPaste={(e) => {
                    e.preventDefault();
                    const text = e.clipboardData.getData("text");
                    const digits = text.replace(/\D/g, "").slice(0, 4);

                    field.onChange(digits);
                  }}

                  //Cập nhật raw value (chỉ số)
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    field.onChange(digits);
                  }}

                  //Chuẩn hoá khi blur → HH:mm
                  onBlur={(e) => {
                    const raw = e.target.value.trim();
                    const digits = raw.replace(/\D/g, "");

                    if (digits.length !== 4) return;

                    const h = digits.slice(0, 2);
                    const m = digits.slice(2, 4);

                    const hour = Number(h);
                    const minute = Number(m);

                    if (
                      hour >= 0 &&
                      hour <= 23 &&
                      minute >= 0 &&
                      minute <= 59
                    ) {
                      field.onChange(`${h}:${m}`);
                    }
                  }}

                  className="h-10 px-3 bg-background"
                />

              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* LANGUAGE */}
        <FormField
          control={form.control}
          name="language_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngôn ngữ trình chiếu</FormLabel>
              <FormControl>
                <select {...field} className="h-10 border rounded px-3 bg-background">
                  <option value="">Chọn ngôn ngữ</option>
                  <option value="sub">Phụ đề</option>
                  <option value="dub">Lồng tiếng</option>
                  <option value="narrated">Thuyết minh</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />



        <Button disabled={isCreating} type="submit" className="w-full">
          Tạo suất chiếu
          {isCreating && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
