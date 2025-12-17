"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

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

import { useUpdateDiscount } from "@/api/hooks/use-discount-update";
import { useDiscounts } from "@/api/hooks/use-discount";
import { DiscountUpdateReqInterface } from "@/api/interfaces/discount-interface";

// ============================
// ZOD SCHEMA
// ============================
export const formSchema = z
  .object({
    code: z.string().min(1, "Mã giảm giá là bắt buộc").max(50),

    type: z.enum(["money", "percent"]),

    discount_percent: z.string().optional(),
    discount_amount: z.string().optional(),
    max_discount_amount: z
      .string()
      .optional()
      .refine((v) => !v || !isNaN(Number(v)), "Giá trị tối đa phải là số"),

    usage_limit: z
      .string()
      .min(1, "Số lượt sử dụng là bắt buộc")
      .refine((v) => !isNaN(Number(v)), "Số lượt sử dụng phải là số")
      .refine((v) => Number(v) > 0, "Số lượt sử dụng phải > 0"),

    movie_id: z
      .string()
      .optional()
      .refine(
        (v) => !v || !isNaN(Number(v)),
        "ID phim phải là số (hoặc để trống)"
      )
      .refine(
        (v) => !v || Number(v) > 0,
        "ID phim phải > 0 (nếu có)"
      ),

    min_order_amount: z
      .string()
      .min(1, "Giá trị đơn tối thiểu là bắt buộc")
      .refine((v) => !isNaN(Number(v)), "Giá trị đơn tối thiểu phải là số")
      .refine((v) => Number(v) >= 0, "Giá trị đơn tối thiểu phải ≥ 0"),

    start_date: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
    end_date: z.string().min(1, "Ngày kết thúc là bắt buộc"),

    status: z.enum(["active", "expired"]),
  })
  .superRefine((values, ctx) => {
    // validate ngày
    const start = new Date(values.start_date);
    const end = new Date(values.end_date);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_date"],
        message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
      });
    }

    // validate theo type
    if (values.type === "percent") {
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
          message: "Phần trăm phải là số",
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

    if (values.type === "money") {
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
export default function DiscountUpdateForm({ id }: { id: number }) {
  const router = useRouter();
  const { data: list, isLoading } = useDiscounts(9999, 1);
  const { mutate: updateDiscount, isPending } = useUpdateDiscount();

  const discount = list?.data?.find((d) => d.id === id);

  const today = new Date();
  const formatDate = (date: Date) => date.toLocaleDateString("en-CA");

  // UI states cho calendar
  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date>(today);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      type: "money",
      discount_percent: "",
      discount_amount: "",
      max_discount_amount: "",
      usage_limit: "",
      movie_id: "",
      min_order_amount: "",
      start_date: formatDate(today),
      end_date: formatDate(today),
      status: "active",
    },
  });

  const watchType = form.watch("type");

  // RESET FORM + UI DATE STATES
  useEffect(() => {
    if (discount && !isLoading) {
      const safeStatus =
        discount.status === "active" || discount.status === "expired"
          ? discount.status
          : "expired";

      const start = new Date(discount.start_date);
      const end = new Date(discount.end_date);

      setStartDate(start);
      setEndDate(end);

      form.reset({
        code: discount.code,
        type: discount.type as "money" | "percent",
        discount_percent:
          discount.discount_percent !== null &&
          discount.discount_percent !== undefined
            ? String(discount.discount_percent)
            : "",
        discount_amount:
          discount.discount_amount !== null &&
          discount.discount_amount !== undefined
            ? String(discount.discount_amount)
            : "",
        max_discount_amount:
          discount.max_discount_amount !== null &&
          discount.max_discount_amount !== undefined
            ? String(discount.max_discount_amount)
            : "",
        usage_limit: String(discount.usage_limit),
        movie_id: discount.movie_id ? String(discount.movie_id) : "",
        min_order_amount: String(discount.min_order_amount),
        start_date: discount.start_date,
        end_date: discount.end_date,
        status: safeStatus,
      });
    }
  }, [discount, isLoading, form]);

  // Submit
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const payload: DiscountUpdateReqInterface = {
      code: data.code,
      type: data.type,
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
      status: data.status,
    };

    updateDiscount(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success("Cập nhật mã giảm giá thành công!");
          router.back();
        },
        onError: (error) => {
          const res = (error as AxiosError).response?.data as {
            message?: string;
          };
          toast.error(res?.message || "Cập nhật thất bại!");
        },
      }
    );
  };

  if (isLoading || !discount) {
    return (
      <div className="flex justify-center my-10">
        <Spinner />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Hàng 1: Mã + Loại + Trạng thái */}
   
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã giảm giá</FormLabel>
                <FormControl>
                  <Input placeholder="VD: MOVIE25" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
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
                    <option value="expired">Ngừng hoạt động</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
       

        {/* Hàng 2: Tiền/Phần trăm + Giảm tối đa */}
       
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
      

        {/* Hàng 3: Usage + Movie + Min order */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="usage_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số lượt sử dụng</FormLabel>
                <FormControl>
                  <Input type="number" min={1} placeholder="VD: 50" {...field} />
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
                <FormLabel>ID phim áp dụng (có thể để trống)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="VD: 2"
                    {...field}
                  />
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

        {/* Hàng 4: Ngày bắt đầu / kết thúc */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* SUBMIT */}
        <div className="flex justify-end">
          <Button type="submit" className="min-w-[220px]" disabled={isPending}>
            Cập nhật mã giảm giá
            {isPending && <Spinner className="ml-2" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
