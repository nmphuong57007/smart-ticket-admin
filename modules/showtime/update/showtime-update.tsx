"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";

import instance from "@/lib/instance";
import { useUpdateShowTime } from "@/api/hooks/use-showtime-update";

import { MovieItem, RoomItem } from "@/api/interfaces/showtimes-interface";

// =======================
// ZOD SCHEMA
// =======================
const formSchema = z.object({
  movie_id: z.number(),
  room_id: z.number(),
  show_date: z.string().min(1),
  show_time: z.string().min(1),
  language_type: z.string().min(1),
  price: z.number().min(1),
});

export default function ShowTimeUpdateForm() {
  const router = useRouter();
  const { id: showtimeId } = useParams();

  const { mutate: updateShowTime, isPending } = useUpdateShowTime();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      movie_id: 0,
      room_id: 0,
      show_date: "",
      show_time: "",
      language_type: "",
      price: 0,
    },
  });

  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);

  // STATE for Calendar
  const [openDate, setOpenDate] = useState(false);
  const [showDate, setShowDate] = useState<Date | undefined>();

  // SELECT MOVIE TO CHECK RELEASE DATE
  const selectedMovie = movies.find((m) => m.id === Number(form.watch("movie_id")));

  // LOAD MOVIES + ROOMS
  useEffect(() => {
    instance.get("/api/movies/list?per_page=100").then((res) => {
      setMovies(res.data.data.movies);
    });

    instance.get("/api/rooms").then((res) => {
      setRooms(res.data.data.items);
    });
  }, []);

  // LOAD SHOWTIME INFO
  useEffect(() => {
    if (!showtimeId) return;

    instance.get(`/api/showtimes/${showtimeId}`).then((res) => {
      const st = res.data.data;

      form.reset({
        movie_id: st.movie_id,
        room_id: st.room_id,
        show_date: st.show_date,
        show_time: st.show_time,
        language_type: st.language_type,
        price: st.price,
      });

      setShowDate(new Date(st.show_date));
    });
  }, [showtimeId, form]);

  // SUBMIT
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append("movie_id", String(data.movie_id));
    formData.append("room_id", String(data.room_id));
    formData.append("show_date", data.show_date);
    formData.append("show_time", data.show_time);
    formData.append("language_type", data.language_type);
    formData.append("price", String(data.price));

    updateShowTime(
      { id: Number(showtimeId), data: formData },
      {
        onSuccess: () => {
          toast.success("Cập nhật suất chiếu thành công!");
          router.back();
        },
        onError: () => toast.error("Cập nhật thất bại!"),
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* MOVIE */}
        <FormField
          control={form.control}
          name="movie_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phim</FormLabel>
              <FormControl>
                <select
                  className="border h-10 rounded-md px-3 bg-white"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <option value="">-- Chọn phim --</option>
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* ROOM */}
        <FormField
          control={form.control}
          name="room_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phòng chiếu</FormLabel>
              <FormControl>
                <select
                  className="border h-10 rounded-md px-3 bg-white"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <option value="">-- Chọn phòng --</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </FormControl>
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
                <div className="flex flex-col gap-3">
                  <Popover open={openDate} onOpenChange={setOpenDate}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-between font-normal">
                        {showDate ? showDate.toLocaleDateString("vi-VN") : "Chọn ngày chiếu"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={showDate}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setShowDate(date);
                          setOpenDate(false);
                          field.onChange(date?.toLocaleDateString("en-CA"));
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
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TIME */}
        <FormField
          control={form.control}
          name="show_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giờ chiếu</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* LANGUAGE */}
        <FormField
          control={form.control}
          name="language_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngôn ngữ</FormLabel>
              <FormControl>
                <select className="border h-9 rounded-md px-3" {...field}>
                  <option value="sub">Phụ đề</option>
                  <option value="dub">Lồng tiếng</option>
                  <option value="narrated">Thuyết minh</option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* PRICE */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá vé</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          Lưu
          {isPending && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
