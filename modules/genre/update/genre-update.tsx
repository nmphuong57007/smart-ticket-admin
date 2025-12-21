"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "sonner";

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


import { useRenge } from "@/api/hooks/use-genre"; // hook load list genre
import { useUpdateGenre } from "@/api/hooks/use-genre-update"; // hook cập nhật genre

// Nếu bạn có interface riêng cho request thì dùng, còn không có thể bỏ phần này
export interface GenreUpdateReqInterface {
  name?: string;
  // is_active?: boolean;
}

// Zod schema cho form
export const formSchema = z.object({
  name: z
    .string()
    .min(1, "Tên thể loại không được để trống")
    .max(100, "Tên thể loại tối đa 100 ký tự"),

  // Dùng status dạng string cho dễ bind với <select>
  // status: z.enum(["active", "inactive"]),
});

export default function GenreUpdateForm({ id }: { id: number }) {
  const router = useRouter();

  // Lấy full list genre, rồi tìm đúng thằng theo id (giống form discount của bạn)
  const { data: list, isLoading } = useRenge();
  const { mutate: updateGenre, isPending } = useUpdateGenre();

  const genre = list?.data?.find((g) => g.id === id);

  // Form instance
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      // status: "active",
    },
  });

  // Khi có dữ liệu genre thì reset form
  useEffect(() => {
    if (genre && !isLoading) {
      form.reset({
        name: genre.name,
        // status: genre.is_active ? "active" : "inactive",
      });
    }
  }, [genre, isLoading, form]);

  // Submit
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const payload: GenreUpdateReqInterface = {
      name: data.name,
      // is_active: data.status === "active",
    };

    updateGenre(
      { id, data: payload },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Cập nhật thể loại thành công!");
          router.back();
        },
        onError: (error) => {
          const res = (error as AxiosError).response?.data as { message?: string };
          toast.error(res?.message || "Cập nhật thể loại thất bại!");
        },
      }
    );
  };

  // Loading hoặc không tìm thấy thể loại
  if (isLoading || !genre) {
    return (
      <div className="flex justify-center my-10">
        <Spinner />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* NAME */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên thể loại</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên thể loại phim" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* STATUS */}
        {/* <FormField 
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <FormControl>
                <select
                  className="h-9 w-full border rounded-md px-3 bg-background"
                  {...field}
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* SUBMIT */}
        <Button type="submit" className="w-full" disabled={isPending}>
          Cập nhật thể loại
          {isPending && <span className="ml-2"><Spinner /></span>}
        </Button>
      </form>
    </Form>
  );
}
