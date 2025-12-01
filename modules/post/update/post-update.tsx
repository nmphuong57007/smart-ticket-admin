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
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";

import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useUpdatePost } from "@/api/hooks/use-post-update";
import { Textarea } from "@/components/ui/textarea";
import { usePostDetail } from "@/api/hooks/use-hook-detail";

// ========================
// FORMAT FUNCTION
// ========================
const formatDateTime = (date: Date) => {
  return (
    `${date.getFullYear()}-` +
    `${String(date.getMonth() + 1).padStart(2, "0")}-` +
    `${String(date.getDate()).padStart(2, "0")} ` +
    `00:00:00`
  );
};

// ========================
// ZOD SCHEMA
// ========================
const formSchema = z
  .object({

    title: z.string().min(1, "Tiêu đề không được bỏ trống"),
    description: z.string().min(1, "Nội dung không được bỏ trống"),
    short_description: z.string().min(1, "Mô tả ngắn không được bỏ trống"),
    published_at: z.string().min(1, "Ngày phát hành không hợp lệ"),
    unpublished_at: z.string().min(1, "Ngày kết thúc không hợp lệ"),
    is_published: z.boolean(),
    image: z.any().optional(),
  })
  .refine(
    (data) =>
      new Date(data.unpublished_at) >= new Date(data.published_at),
    {
      path: ["unpublished_at"],
      message: "Ngày kết thúc phải sau hoặc bằng ngày phát hành",
    }
  );

// ========================
// COMPONENT
// ========================
export default function PostUpdateForm({ id }: { id: number }) {
  const router = useRouter();


  const { mutate: updatePost, isPending } = useUpdatePost();

  const { data, isLoading } = usePostDetail(id);
const post = data?.data; // single object


  // Date states
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      short_description: "",
      is_published: false,
      published_at: formatDateTime(new Date()),
      unpublished_at: formatDateTime(new Date()),
    },
  });

useEffect(() => {
  if (!post) return;

  const pub = new Date(post.published_at);
  const unpub = new Date(post.unpublished_at);

  setStartDate(pub);
  setEndDate(unpub);

  form.reset({
    title: post.title,
    description: post.description,
    short_description: post.short_description,
    is_published: post.is_published,
    published_at: formatDateTime(pub),
    unpublished_at: formatDateTime(unpub),
    image: "",
  });

}, [post, form]);


  // Submit
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("short_description", data.short_description);
    formData.append("is_published", data.is_published ? "1" : "0");
    formData.append("published_at", data.published_at);
    formData.append("unpublished_at", data.unpublished_at);

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]); // Backend expects image_file
    }

    updatePost(
      { id, data: formData },
      {
        onSuccess: () => {
          toast.success("Cập nhật bài viết thành công!");
          router.back();
        },
        onError: (error) => {
          const res = (error as AxiosError).response?.data as { message: string };
          toast.error(res?.message || "Cập nhật thất bại!");
        },
      }
    );
  };

  if (isLoading || !post)
    return (
      <div className="flex justify-center my-10">
        <Spinner />
      </div>
    );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Ảnh mới</FormLabel>
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

            {/* description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs"
                  placeholder="Mô tả phim"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            {/* short_description */}
        <FormField
          control={form.control}
          name="short_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả ngắn</FormLabel>
              <FormControl>
                <Textarea
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs"
                  placeholder="Mô tả ngắn"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* START DATE */}
          <FormField
            control={form.control}
            name="published_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày phát hành</FormLabel>
                <FormControl>
                  <Popover open={openStart} onOpenChange={setOpenStart}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-between">
                        {startDate.toLocaleDateString("vi-VN")}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          if (!date) return;
                          setStartDate(date);
                          setOpenStart(false);
                          field.onChange(formatDateTime(date));
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* END DATE */}
          <FormField
            control={form.control}
            name="unpublished_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày kết thúc</FormLabel>
                <FormControl>
                  <Popover open={openEnd} onOpenChange={setOpenEnd}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-between">
                        {endDate.toLocaleDateString("vi-VN")}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          if (!date) return;
                          setEndDate(date);
                          setOpenEnd(false);
                          field.onChange(formatDateTime(date));
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* STATUS */}
        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isPending}>
          Cập nhật bài viết
          {isPending && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
