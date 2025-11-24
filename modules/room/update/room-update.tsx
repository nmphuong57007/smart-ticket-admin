"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { AxiosError } from "axios";
import SeatMapBuilder from "@/components/seat-map-builder";
import { useRoomDetail } from "@/api/hooks/use-room-detail";
import { useUpdateRoom } from "@/api/hooks/use-room-update";


// ============================
// TYPES
// ============================
export interface SeatItem {
  code: string;
  type: "normal" | "vip";
  status: "active" | "broken";
}

export interface RoomUpdatePayload {
  name: string;
  status: string;
  total_seats: number;
  seat_map: SeatItem[][];
}


// ============================
// ZOD SCHEMA
// ============================
const formSchema = z.object({
  name: z.string().min(1, "Tên phòng chiếu là bắt buộc"),

  seat_map: z.array(
    z.array(
      z.object({
        code: z.string(),
        type: z.enum(["normal", "vip"]),
        status: z.enum(["active", "broken"]),
      })
    )
  ),

  total_seats: z.number().min(1, "Tổng số ghế không hợp lệ"),

  status: z.string().min(1, "Trạng thái là bắt buộc"),
});


// ============================
// COMPONENT
// ============================
export default function RoomUpdateForm({ id }: { id: number }) {
  const router = useRouter();
  const { data: roomDetail, isLoading } = useRoomDetail(id);
  const { mutate: updateRoom, isPending } = useUpdateRoom();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Fill form khi có dữ liệu room
  if (roomDetail && !form.getValues("name")) {
    const r = roomDetail.data;

    form.setValue("name", r.name);
    form.setValue("status", r.status.code);
    form.setValue("seat_map", r.seat_map as SeatItem[][]);
    form.setValue("total_seats", r.total_seats);
  }

  const calcTotalSeats = (seat_map: SeatItem[][]) =>
    seat_map.reduce((sum, row) => sum + row.length, 0);


  // ============================
  // SUBMIT UPDATE
  // ============================
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const payload: RoomUpdatePayload = {
      ...data,
      total_seats: calcTotalSeats(data.seat_map),
    };

    updateRoom(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success("Cập nhật phòng chiếu thành công!");
          router.push("/rooms");
        },
        onError: (error: unknown) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || "Cập nhật thất bại!");
          } else {
            toast.error("Lỗi không xác định!");
          }
        },
      }
    );
  };

  if (isLoading) return <p>Đang tải...</p>;


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Tên phòng */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên phòng chiếu</FormLabel>
              <FormControl>
                <Input placeholder="Phòng 1, Phòng VIP 1..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sơ đồ ghế */}
        <FormField
          control={form.control}
          name="seat_map"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sơ đồ ghế</FormLabel>
              <FormControl>
                <SeatMapBuilder
                  value={field.value}
                  enableSeatStatus
                  onChange={(val) => {
                    field.onChange(val);
                    form.setValue("total_seats", calcTotalSeats(val));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Trạng thái phòng */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái phòng</FormLabel>
              <FormControl>
                <select
                  className="h-9 w-full border rounded-md px-3"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isPending}>
          Cập nhật phòng chiếu
          {isPending && <Spinner />}
        </Button>

      </form>
    </Form>
  );
}
