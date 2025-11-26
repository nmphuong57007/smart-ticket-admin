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
import { ConflictResponse, ShowTimeCreatePayload } from "@/api/interfaces/showtimes-interface";
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
    show_time: z.string().min(1, "Giờ chiếu là bắt buộc"),
    end_time: z.string().min(1, "Giờ kết thúc là bắt buộc"),
    language_type: z.string().min(1, "Ngôn ngữ là bắt buộc"),
  })
  .refine(
    (data) => data.end_time >= data.show_time,
    {
      message: "Giờ kết thúc phải lớn hơn hoặc bằng giờ chiếu",
      path: ["end_time"],
    }
  );


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
      end_time: "",
      language_type: "",
    },
  });

  // =======================================
  // STATES (CÓ TYPE - KHÔNG ANY) ✔
  // =======================================

  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);

  const [showDate, setShowDate] = useState<Date | undefined>();
  const [openDate, setOpenDate] = useState(false);

  const watchMovie = form.watch("movie_id");
  const watchDate = form.watch("show_date");
  const watchTime = form.watch("show_time");

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
  // AUTO CALCULATE END TIME
  // ==============================

  useEffect(() => {
    if (!selectedMovie?.duration || !watchTime) return;

    const [h, m] = watchTime.split(":").map(Number);
    const total = h * 60 + m + selectedMovie.duration;
    const endH = String(Math.floor(total / 60)).padStart(2, "0");
    const endM = String(total % 60).padStart(2, "0");

    form.setValue("end_time", `${endH}:${endM}`);
  },);

  // ==============================
  // SUBMIT
  // ==============================

const onSubmit = (data: z.infer<typeof createShowtimeSchema>) => {
  const payload: ShowTimeCreatePayload = {
    movie_id: Number(data.movie_id),
    room_id: Number(data.room_id),
    show_date: data.show_date,
    show_time: data.show_time,
    end_time: data.end_time,
    language_type: data.language_type,
  };

  createShowTime(payload, {
    onSuccess: () => {
      toast.success("Tạo suất chiếu thành công!");
      router.push(redirectConfig.showtimes);
    },

    onError: (error: AxiosError<ConflictResponse>) => {
      const res = error.response?.data;

      if (res?.conflict) {
        const c = res.conflict;

        toast.error(
          <div className="space-y-1">
            <p>⛔ <b>Lịch chiếu bị trùng!</b></p>
            <p>• ID trùng: <b>{c.existing_showtime_id}</b></p>
            <p>• Phim: <b>{c.existing_movie}</b></p>
            <p>• Giờ trùng: {c.existing_start} → {c.existing_end}</p>
            <p>• Cần bắt đầu sau: {c.required_next_start}</p>
          </div>
        );

        return;
      }

      toast.error(res?.message || "Tạo thất bại!");
    },
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
        render={({ field }) => {
            // Lấy giờ máy
            const now = new Date();
            const HH = String(now.getHours()).padStart(2, "0");
            const MM = String(now.getMinutes()).padStart(2, "0");
            const currentTime = `${HH}:${MM}`;

            // Lấy ngày máy chuẩn YYYY-MM-DD
            const todayStr = new Date().toLocaleDateString("en-CA");

            const isToday = watchDate === todayStr;

            return (
            <FormItem>
                <FormLabel>Giờ chiếu</FormLabel>
                <FormControl>
                <Input
                    type="time"
                    step="60"
                    min={isToday ? currentTime : undefined}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="h-10 px-3 bg-background"
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            );
        }}
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
