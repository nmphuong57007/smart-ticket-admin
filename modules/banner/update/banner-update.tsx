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
import { useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { useBanners } from "@/api/hooks/use-banner";
import { useUpdateBanner } from "@/api/hooks/use-banner-update";
import { Switch } from "@/components/ui/switch";

// ========================
// ZOD SCHEMA
// ========================
const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được bỏ trống"),
  published_at: z.string().min(1, "Ngày xuất bản không hợp lệ"),
  is_published: z.boolean(),

  // SỬA LẠI ĐÚNG — KHÔNG DÙNG INSTANCEOF
  image: z.any().optional(),
});

// ========================
// COMPONENT
// ========================
export default function BannerUpdateForm({ id }: { id: number }) {
  const router = useRouter();

  // Lấy danh sách banners
  const { data: list, isLoading } = useBanners(9999, 1);

  // Hook cập nhật banner
  const { mutate: updateBanner, isPending } = useUpdateBanner();

  const banner = list?.data?.items?.find((b) => b.id === id);

  const today = new Date();
  const formatDate = (d: Date) => d.toLocaleDateString("en-CA");

  const [openDate, setOpenDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(today);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      is_published: false,
      published_at: formatDate(today),
    },
  });

  useEffect(() => {
    if (banner && !isLoading) {
      const date = new Date(banner.published_at);
      setSelectedDate(date);

      form.reset({
        title: banner.title,
        is_published: banner.is_published,
        published_at: banner.published_at,
      });

    }
  }, [banner, isLoading, form]);

  // Submit
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("is_published", data.is_published ? "1" : "0");
    formData.append("published_at", data.published_at);

    // SỬA ĐÚNG FIELD NAME — backend nhận image_file
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    updateBanner(
      { id, data: formData },
      {
        onSuccess: () => {
          toast.success("Cập nhật banner thành công!");
          router.back();
        },
        onError: (error) => {
          const res = (error as AxiosError).response?.data as { message: string };
          toast.error(res?.message || "Cập nhật thất bại!");
        },
      }
    );
  };

  if (isLoading || !banner) {
    return (
      <div className="flex justify-center my-10">
        <Spinner />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* IMAGE UPLOAD */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ảnh Banner mới </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PUBLISHED AT */}
        <FormField
          control={form.control}
          name="published_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày xuất bản</FormLabel>
              <FormControl>
                <Popover open={openDate} onOpenChange={setOpenDate}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      {selectedDate.toLocaleDateString("vi-VN")}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (!date) return;
                        setSelectedDate(date);
                        setOpenDate(false);
                        field.onChange(formatDate(date));
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* STATUS */}
        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái hoạt động</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isPending}>
          Cập nhật banner
          {isPending && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
