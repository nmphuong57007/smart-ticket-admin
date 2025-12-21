"use client";

import { useEffect, useState } from "react";
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";

import { useCreateDiscount } from "@/api/hooks/use-discount-create";
import { redirectConfig } from "@/helpers/redirect-config";
import instance from "@/lib/instance";

// ============================
// ZOD SCHEMA
// ============================
export const formSchema = z
  .object({
    code: z.string().min(1, "Mã giảm giá là bắt buộc").max(50),

    type: z.enum(["money", "percent"]),

    // để dạng string cho dễ bind với input, validate kỹ ở dưới
    discount_percent: z.string().optional(),
    discount_amount: z.string().optional(),
    max_discount_amount: z
      .string()
      .optional()
      .refine(
        (v) => !v || !isNaN(Number(v)),
        "Giá trị tối đa phải là số"
      ),

    usage_limit: z
      .string()
      .min(1, "Số lượt sử dụng là bắt buộc")
      .refine((v) => !isNaN(Number(v)), "Số lượt sử dụng phải là số")
      .refine((v) => Number(v) > 0, "Số lượt sử dụng phải > 0"),

    movie_id: z
    .string()
    .optional()
    .refine(
      (v) => !v || (!isNaN(Number(v)) && Number(v) > 0),
      "Phim áp dụng không hợp lệ"
    ),


    min_order_amount: z
      .string()
      .min(1, "Giá trị đơn tối thiểu là bắt buộc")
      .refine((v) => !isNaN(Number(v)), "Giá trị đơn tối thiểu phải là số")
      .refine((v) => Number(v) >= 0, "Giá trị đơn tối thiểu phải ≥ 0"),

    start_date: z
      .string()
      .min(1, "Ngày bắt đầu là bắt buộc")
      .refine((v) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const start = new Date(v);
        start.setHours(0, 0, 0, 0);

        return start >= today;
      }, "Ngày bắt đầu phải từ hôm nay trở đi"),

    end_date: z.string().min(1, "Ngày kết thúc là bắt buộc"),
  })
  .superRefine((values, ctx) => {
    const start = new Date(values.start_date);
    const end = new Date(values.end_date);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_date"],
        message: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu",
      });
    }

    const type = values.type;

    // validate theo type
    if (type === "percent") {
      if (!values.discount_percent || values.discount_percent === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["discount_percent"],
          message: "Vui lòng nhập phần trăm giảm giá",
        });
      } else if (isNaN(Number(values.discount_percent))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["discount_percent"],
          message: "Phần trăm giảm giá phải là số",
        });
      } else {
        const num = Number(values.discount_percent);
        if (num <= 0 || num > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["discount_percent"],
            message: "Phần trăm phải từ 1 đến 100",
          });
        }
      }
    }

    if (type === "money") {
      if (!values.discount_amount || values.discount_amount === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["discount_amount"],
          message: "Vui lòng nhập số tiền giảm",
        });
      } else if (isNaN(Number(values.discount_amount))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["discount_amount"],
          message: "Số tiền giảm phải là số",
        });
      } else if (Number(values.discount_amount) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["discount_amount"],
          message: "Số tiền giảm phải > 0",
        });
      }
    }
  });

// ============================
// COMPONENT
// ============================
export default function DiscountCreateForm() {
  const router = useRouter();
  const { mutate: createDiscount, isPending: isCreating } = useCreateDiscount();

  const today = new Date();
  const formatDate = (date: Date) => date.toLocaleDateString("en-CA"); // yyyy-mm-dd

  const [movies, setMovies] = useState<
    {
      id: number;
      title: string;
      duration: number;
      status: string;
    }[]
  >([]);

    useEffect(() => {
     instance.get("/api/movies/list?per_page=100").then((res) => {
    console.log("MOVIES API:", res.data);
    setMovies(res.data.data.movies); // ✔ LẤY ĐÚNG MẢNG
  });
  }, []);

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      type: "money", // mặc định theo ví dụ của bạn
      discount_percent: "",
      discount_amount: "",
      max_discount_amount: "",
      usage_limit: "",
      movie_id: "",
      min_order_amount: "",
      start_date: formatDate(today),
      end_date: formatDate(today),
    },
  });

  const watchType = form.watch("type");

  // UI state cho Calendar
  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date>(today);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  // ============================
  // SUBMIT HANDLER
  // ============================
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const payload = {
      code: data.code,
      type: data.type,
      // chỉ gửi field phù hợp với type
      discount_percent:
        data.type === "percent" && data.discount_percent
          ? Number(data.discount_percent)
          : undefined,
      discount_amount:
        data.type === "money" && data.discount_amount
          ? Number(data.discount_amount)
          : undefined,
      max_discount_amount: data.max_discount_amount
        ? Number(data.max_discount_amount)
        : undefined,
      usage_limit: Number(data.usage_limit),
      movie_id: data.movie_id ? Number(data.movie_id) : null,
      min_order_amount: Number(data.min_order_amount),
      start_date: data.start_date,
      end_date: data.end_date,
    };

    createDiscount(payload, {
      onSuccess: () => {
        toast.success("Tạo mã giảm giá thành công!");
        router.push(redirectConfig.discounts);
      },
      onError: () => toast.error("Tạo mã giảm giá thất bại!"),
    });
  };

  // ============================
  // UI FORM
  // ============================
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Mã giảm giá */}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã giảm giá</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: MOVIE102" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Loại giảm giá */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại giảm giá</FormLabel>
              <FormControl>
                <select
                  className="h-9 w-full border rounded-md px-3 bg-background"
                  {...field}
                >
                  <option value="money">Giảm theo số tiền</option>
                  <option value="percent">Giảm theo phần trăm</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Discount fields */}
        
          {watchType === "percent" && (
            <FormField
              control={form.control}
              name="discount_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phần trăm giảm giá (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      placeholder="VD: 25"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {watchType === "money" && (
            <FormField
              control={form.control}
              name="discount_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền giảm (VNĐ)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="VD: 30000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="max_discount_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giảm tối đa (VNĐ) (tuỳ chọn)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="VD: 50000"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      

        {/* Usage + Movie + Min order */}
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="usage_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số lượt sử dụng</FormLabel>
                <FormControl>
                  <Input type="number" min={1} placeholder="VD: 10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="movie_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phim áp dụng (tuỳ chọn)</FormLabel>
                <FormControl>
                  <select
                    name={field.name}
                    value={field.value?.toString() ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    className="h-9 w-full border rounded-md px-3 bg-background"
                  >
                    <option value="">Tất cả phim</option>

                    {movies
                      .filter((m) => m.status !== "stopped") // loại phim đã dừng chiếu
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title} ({m.duration} phút)
                        </option>
                      ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="min_order_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đơn tối thiểu (VNĐ)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="VD: 70000"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Ngày bắt đầu & kết thúc */}
        <div className="grid grid-cols-2 gap-4">
          {/* Start Date */}
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-3">
                    <Popover open={openStart} onOpenChange={setOpenStart}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-between">
                          {startDate.toLocaleDateString("vi-VN")}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="p-0 w-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            if (!date) return;
                            setStartDate(date);
                            setOpenStart(false);
                            field.onChange(formatDate(date));
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

          {/* End Date */}
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
                        <Button variant="outline" className="justify-between">
                          {endDate.toLocaleDateString("vi-VN")}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="p-0 w-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            if (!date) return;
                            setEndDate(date);
                            setOpenEnd(false);
                            field.onChange(formatDate(date));
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

        <Button type="submit" className="w-full" disabled={isCreating}>
          Tạo mã giảm giá
          {isCreating && <Spinner className="ml-2" />}
        </Button>
      </form>
    </Form>
  );
}
