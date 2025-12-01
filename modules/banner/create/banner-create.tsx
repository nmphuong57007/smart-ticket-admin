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

import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";

import { useCreateBanner } from "@/api/hooks/use-banner-create";
import { BannerCreateReqInterface } from "@/api/interfaces/banner-interface";
import { useState } from "react";

// ✔ Dùng Switch của shadcn
import { Switch } from "@/components/ui/switch";

// ------------------------
// ZOD SCHEMA
// ------------------------
const formSchema = z.object({

  title: z.string().min(1, "Tiêu đề là bắt buộc"),

  image: z
    .custom<File | null>((v) => v instanceof File || v === null, {
      message: "Ảnh banner là bắt buộc",
    })
    .refine((file) => file instanceof File, "Vui lòng chọn một ảnh"),

  published_at: z.string().min(1, "Ngày phát hành là bắt buộc"),

  is_published: z.boolean(),
});

// ------------------------
// COMPONENT
// ------------------------
export default function BannerCreateForm() {
  const router = useRouter();
  const { mutate: createBanner, isPending: isCreating } = useCreateBanner();

  const [releaseDate, setReleaseDate] = useState<Date | undefined>();
  const [openRelease, setOpenRelease] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: null,
      published_at: "",
      is_published: false,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append("type", "banner"); 
    formData.append("title", data.title);
    formData.append("published_at", data.published_at);
    formData.append("is_published", data.is_published ? "1" : "0");

    if (data.image) {
      formData.append("image", data.image);
    }

    createBanner(formData as unknown as BannerCreateReqInterface, {
      onSuccess: () => {
        toast.success("Tạo banner thành công!");
        router.push("/points"); // ✔ chuyển đúng trang
      },
      onError: () => {
        toast.error("Tạo banner thất bại!");
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung banner</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập nội dung banner..."
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* IMAGE */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ảnh Banner</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PUBLISHED DATE */}
        <FormField
          control={form.control}
          name="published_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày phát hành</FormLabel>
              <FormControl>
                <Popover open={openRelease} onOpenChange={setOpenRelease}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      {releaseDate
                        ? releaseDate.toLocaleDateString("vi-VN")
                        : "Chọn ngày phát hành"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent align="start" className="p-0">
                    <Calendar
                      mode="single"
                      selected={releaseDate}
                      onSelect={(date) => {
                        setReleaseDate(date || undefined);
                        setOpenRelease(false);

                        if (date) {
                          field.onChange(date.toISOString().split("T")[0]);
                        }
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
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isCreating}>
          Tạo banner
          {isCreating && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
