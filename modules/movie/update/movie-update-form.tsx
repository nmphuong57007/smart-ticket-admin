"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

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

import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";

import { useEffect, useState } from "react";
import { useUpdateMovie } from "@/api/hooks/use-movie-update";
import instance from "@/lib/instance";


interface RengeProps {
  rengeData: RengeType[];
}

export type RengeType = {
   id: number;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  poster: z
  .any()
  .optional()
  .refine((file) => !file || file instanceof File, "Poster không hợp lệ"),
  trailer: z.string().min(1, "Trailer là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  genre: z
  .array(z.string().min(1, "Thể loại không được để trống"))
  .nonempty("Thể loại là bắt buộc"),
  duration: z.number().min(1, "Thời lượng phải lớn hơn 0"),
  format: z.string().min(1, "Định dạng là bắt buộc"),
  language: z.string().min(1, "Ngôn ngữ là bắt buộc"),
  release_date: z.string().min(1, "Ngày phát hành là bắt buộc"),
  end_date: z.string().min(1, "Ngày kết thúc là bắt buộc"),
  status: z.string().min(1, "Trạng thái là bắt buộc"),
})
.refine((data) => {
  if (!data.release_date || !data.end_date) return true; // skip nếu chưa chọn
  return new Date(data.end_date) >= new Date(data.release_date);
}, {
  message: "Ngày kết thúc phải sau hoặc bằng ngày phát hành",
  path: ["end_date"], // lỗi hiển thị ở end_date
});

;

export default function MovieUpdateForm({
  rengeData,
}: RengeProps) {
  const router = useRouter();
  const { id: movieId } = useParams();
  
  const { mutate: updateMovie, isPending: isCreating } = useUpdateMovie();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      poster: null,
      trailer: "",
      description: "",
      genre: [],
      duration: 0,
      format: "",
      language: "",
      release_date: "",
      end_date: "",
      status: "",
    },
  });

  // movie state removed (not used elsewhere)
  const [releaseDate, setReleaseDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [openRelease, setOpenRelease] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
useEffect(() => {
  if (!movieId) return;

  const fetchMovie = async () => {
    try {
      // Use shared axios instance so baseURL and auth headers are applied
      const res = await instance.get(`/api/movies/${movieId}`);
      const m = res.data?.data;

      // no longer storing movie in local state; we reset the form directly

      // === RESET FORM VỚI DỮ LIỆU PHIM ===
      form.reset({
        title: m.title,
        poster: null, // luôn null vì file không thể prefill
        trailer: m.trailer,
        description: m.description,
        genre: m.genres.map((g: { id: number }) => String(g.id)),
        duration: m.duration,
        format: m.format,
        language: m.language,
        release_date: m.release_date,
        end_date: m.end_date,
        status: m.status,
      });

      // set lại state cho date picker
      setPosterUrl(m.poster);
      setReleaseDate(m.release_date ? new Date(m.release_date) : undefined);
      setEndDate(m.end_date ? new Date(m.end_date) : undefined);

    } catch (error) {
      console.error(error);
      toast.error("Không tải được dữ liệu phim");
    }
  };

  fetchMovie();
}, [movieId, form]);


  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // build multipart/form-data because API expects a file upload
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.poster instanceof File) {
    formData.append("poster", data.poster);
    }
    formData.append("trailer", data.trailer);
    formData.append("description", data.description);
    // Multi-select genre
    data.genre.forEach((g) => formData.append("genre_ids[]", g));
    formData.append("duration", String(data.duration));
    formData.append("format", data.format);
    formData.append("language", data.language);
    formData.append("release_date", data.release_date);
    formData.append("end_date", data.end_date);
    formData.append("status", data.status);

    updateMovie( 
        {
    id: Number(movieId),
    data: formData,
        },
        {
      onSuccess: () => {
        toast.success("Sửa phim thành công!");
        router.push(redirectConfig.movies);
      },
      onError: () => {
        toast.error("Sửa phim thất bại!");
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input placeholder="Movie title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* poster */}
        <FormField
          control={form.control}
          name="poster"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poster</FormLabel>
               <a
                href={posterUrl?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mb-2 block"
                ></a>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* trailer */}
        <FormField
          control={form.control}
          name="trailer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trailer</FormLabel>
              <FormControl>
                <Input placeholder="Trailer URL" {...field} />
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

        {/* genre */}
        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thể loại</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start w-full">
                      {field.value.length > 0
                        ? rengeData
                            .filter((g) =>
                              field.value.includes(String(g.id))
                            )
                            .map((g) => g.name)
                            .join(", ")
                        : "Chọn thể loại"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-64 p-2 max-h-56 overflow-y-auto">
                    {rengeData.length === 0 ? (
                      <p className="text-sm text-gray-500 p-2">Không có dữ liệu</p>
                    ) : (
                      rengeData.map((genre) => (
                        <div
                          key={genre.id}
                          className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded-md"
                        >
                          <Checkbox 
                            id={`genre-${genre.id}`}
                            checked={field.value.includes(String(genre.id))}
                            onCheckedChange={(checked) => {
                              const value = field.value || [];
                              if (checked) {
                                field.onChange([...value, String(genre.id)]);
                              } else {
                                field.onChange(
                                  value.filter((v) => v !== String(genre.id))
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`genre-${genre.id}`}
                            className="cursor-pointer text-sm"
                          >
                            {genre.name}
                          </Label>
                        </div>
                      ))
                    )}
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời lượng (phút)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Duration"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* format */}
        <FormField
          control={form.control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Định dạng</FormLabel>
              <FormControl>
                
                 <select
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 text-sm shadow-xs"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="">Chọn định dạng</option>
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="IMAX">IMAX</option>
                  <option value="4DX">4DX</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* language */}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngôn ngữ</FormLabel>
              <FormControl>
              
                 <select
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 text-sm shadow-xs"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="">Chọn ngôn ngữ</option>
                  <option value="sub">Phụ đề</option>
                  <option value="narrated">Thuyết minh</option>
                  <option value="dub">lồng tiếng</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* dates */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="release_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày phát hành</FormLabel>
                <FormControl>
                     <div className="flex flex-col gap-3">
                <Popover open={openRelease} onOpenChange={setOpenRelease}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="justify-between font-normal"
                    >
                      {releaseDate ? releaseDate.toLocaleDateString() : "Chọn ngày phát hành"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={releaseDate}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setReleaseDate(date)
                        setOpenRelease(false)
                        field.onChange(date?.toISOString().split("T")[0]);
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
            name="end_date"
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
                        field.onChange(date?.toISOString().split("T")[0]);
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

        {/* status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <FormControl>
                <select
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 text-sm shadow-xs"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="">Chọn trạng thái</option>
                  <option value="coming">Sắp chiếu</option>
                  <option value="showing">Đang chiếu</option>
                  <option value="stopped">Dừng chiếu</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isCreating}>
          Lưu
          {isCreating && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
