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

import type { AxiosError } from "axios";
import { useCreateRoom } from "@/api/hooks/use-room-create";
import SeatMapBuilder, { SeatItem } from "@/components/seat-map-builder";

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
export default function RoomCreateForm() {
  const router = useRouter();
  const { mutate: createRoom, isPending: isCreating } = useCreateRoom();

  // Default seat map A–E
  const defaultSeatMap: SeatItem[][] = [
    Array.from({ length: 8 }, (_, i) => ({
      code: `A${i + 1}`,
      type: "normal",
      status: "active",
    })),
    Array.from({ length: 8 }, (_, i) => ({
      code: `B${i + 1}`,
      type: "normal",
      status: "active",
    })),
    Array.from({ length: 8 }, (_, i) => ({
      code: `C${i + 1}`,
      type: "normal",
      status: "active",
    })),
    Array.from({ length: 8 }, (_, i) => ({
      code: `D${i + 1}`,
      type: "normal",
      status: "active",
    })),
    Array.from({ length: 8 }, (_, i) => ({
      code: `E${i + 1}`,
      type: "normal",
      status: "active",
    })),
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: "active",
      seat_map: defaultSeatMap,
      total_seats: 40,
    },
  });

  const calcTotalSeats = (seat_map: SeatItem[][]) =>
    seat_map.reduce((sum, row) => sum + row.length, 0);

  // ============================
  // SUBMIT HANDLER
  // ============================
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const payload = {
      ...data,
      total_seats: calcTotalSeats(data.seat_map),
    };

    createRoom(payload, {
      onSuccess: () => {
        toast.success("Tạo phòng chiếu thành công!");
        router.push("/rooms");
      },
      onError: (error: Error) => {
        const axiosError = error as AxiosError;
        const msg =
          (axiosError.response?.data as { message?: string })?.message ||
          "Tạo phòng chiếu thất bại!";
        toast.error(msg);
      },
    });
  };

  // ============================
  // UI FORM
  // ============================
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
              {/* <FormLabel>Sơ đồ ghế</FormLabel> */}
              <FormControl>
                <SeatMapBuilder
                  value={field.value}
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

        {/* Trạng thái */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <FormControl>
                <select
                  className="h-9 w-full rounded-md border px-3 text-sm"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="active">Đang hoạt động</option>
             
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isCreating}>
          Tạo phòng chiếu
          {isCreating && <Spinner />}
        </Button>

      </form>
    </Form>
  );
}
