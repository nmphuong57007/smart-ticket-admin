"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { redirectConfig } from "@/helpers/redirect-config";
import { useCreateMovie } from "@/api/hooks/use-movie-create";
import type { MovieCreateReqInterface } from "@/api/interfaces/movie-interface";
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
  poster: z.any().refine((file) => file instanceof File, "Poster là bắt buộc"),
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
});

export default function MovieCreateForm({
  rengeData,
}: RengeProps) {
  const router = useRouter();
  
  const { mutate: createMovie, isPending: isCreating } = useCreateMovie();

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

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // build multipart/form-data because API expects a file upload
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("poster", data.poster as unknown as Blob);
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

    createMovie(formData as unknown as MovieCreateReqInterface, {
      onSuccess: () => {
        toast.success("Tạo phim thành công!");
        router.push(redirectConfig.movies);
      },
      onError: () => {
        toast.error("Tạo phim thất bại!");
      },
    });
  };

console.log(FormData);

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
                <Input placeholder="VD: 2D, 3D" {...field} />
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
                <Input placeholder="Ngôn ngữ" {...field} />
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
                  <Input type="date" {...field} />
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
                  <Input type="date" {...field} />
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
                  <option value="coming">coming</option>
                  <option value="showing">showing</option>
                  <option value="stopped">stopped</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isCreating}>
          Tạo phim
          {isCreating && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
