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

import { useState } from "react";

// ✔ Dùng Switch của shadcn
import { Switch } from "@/components/ui/switch";
import { useCreatePost } from "@/api/hooks/use-post-create";
import { PostCreateReqInterface } from "@/api/interfaces/post-interface";

// ------------------------
// ZOD SCHEMA
// ------------------------
const formSchema = z.object({
   type:   z.string().min(1, "Thể loại là bắt buộc"),
  title: z.string().min(1, "Tiêu đề là bắt buộc"),

  image: z
    .custom<File | null>((v) => v instanceof File || v === null, {
      message: "Ảnh banner là bắt buộc",
    })
    .refine((file) => file instanceof File, "Vui lòng chọn một ảnh"),
    description: z.string().min(1, "Mô tả là bắt buộc"),
    short_description: z.string().min(1, "Mô tả là bắt buộc"),
     published_at: z.string().min(1, "Ngày phát hành là bắt buộc"),
    unpublished_at: z.string().min(1, "Ngày kết thúc là bắt buộc"),

    is_published: z.boolean(),
})
.refine((data) => {
  if (!data.published_at || !data.unpublished_at) return true; // skip nếu chưa chọn
  return new Date(data.unpublished_at) >= new Date(data.published_at);
}, {
  message: "Ngày kết thúc phải sau hoặc bằng ngày phát hành",
  path: ["unpublished_at"], // lỗi hiển thị ở end_date
});
;

// ------------------------
// COMPONENT
// ------------------------
export default function PostCreateForm() {
  const router = useRouter();
  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [openEnd, setOpenEnd] = useState(false);

  const [releaseDate, setReleaseDate] = useState<Date | undefined>();
  const [openRelease, setOpenRelease] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        type: "",
      title: "",
      image: null,
      description: "",
      short_description: "",
      published_at: "",
      unpublished_at: "",
      is_published: false,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append("type", data.type); 
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("short_description", data.short_description);
    formData.append("published_at", data.published_at);
    formData.append("unpublished_at", data.unpublished_at);
    formData.append("is_published", data.is_published ? "1" : "0");

    if (data.image) {
      formData.append("image", data.image);
    }

    createPost(formData as unknown as PostCreateReqInterface, {
      onSuccess: () => {
        toast.success("Tạo tin tức thành công!");
        router.push("/contents"); // ✔ chuyển đúng trang
      },
      onError: () => {
        toast.error("Tạo tin tức thất bại!");
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           {/* type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thể loại</FormLabel>
              <FormControl>
                
                 <select
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 text-sm shadow-xs"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="">Chọn định dạng</option>
                  <option value="news">Tin tức</option>
                  <option value="promotion">Khuyến mãi</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập nội dung ..."
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
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

        {/* IMAGE */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ảnh</FormLabel>
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

        <div className="grid grid-cols-2 gap-4">
        {/* PUBLISHED DATE */}

        <FormField
          control={form.control}
          name="published_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày phát hành</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-3">
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
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="unpublished_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày kết thúc</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-3">
                <Popover open={openEnd} onOpenChange={setOpenEnd}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="justify-between font-normal"
                    >
                      {endDate ? endDate.toLocaleDateString() : "Chọn ngày kết thúc"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setEndDate(date)
                        setOpenEnd(false)
                        if (date) {
                          const formatted =
                            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} 00:00:00`;

                          field.onChange(formatted);
                        }

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
  </div>
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
          Tạo bài viết
          {isCreating && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
