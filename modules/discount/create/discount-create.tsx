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

import { useCreateDiscount } from "@/api/hooks/use-discount-create";
import { redirectConfig } from "@/helpers/redirect-config";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";

// ============================
// ZOD SCHEMA
// ============================
export const formSchema = z
  .object({
    code: z.string().min(1, "Mã giảm giá là bắt buộc").max(50),

    discount_percent: z
      .string()
      .min(1, "Phần trăm giảm giá là bắt buộc")
      .refine((v) => !isNaN(Number(v)), "Phần trăm giảm giá phải là số")
      .refine((v) => Number(v) > 0 && Number(v) <= 100, "Giá trị phải từ 1 đến 100"),

    start_date: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
    end_date: z.string().min(1, "Ngày kết thúc là bắt buộc"),
  })
  .superRefine((values, ctx) => {
    const start = new Date(values.start_date);
    const end = new Date(values.end_date);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    if (end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_date"],
        message: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu",
        });

    }
  });

// ============================
// COMPONENT
// ============================
export default function DiscountCreateForm() {
  const router = useRouter();
  const { mutate: createDiscount, isPending: isCreating } = useCreateDiscount();

  const today = new Date();
  function formatDate(date: Date) {
  return date.toLocaleDateString("en-CA"); // yyyy-mm-dd
}


  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      discount_percent: "",
      start_date: formatDate(today),
      end_date: formatDate(today),
    },
  });

  // UI state
  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date>(today);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  // ============================
  // SUBMIT HANDLER
  // ============================
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createDiscount(data, {
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
              <FormLabel>Tên mã giảm giá</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: SALE20" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phần trăm */}
        <FormField
          control={form.control}
          name="discount_percent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phần trăm giảm giá</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") return field.onChange("");
                    const num = Number(value);
                    if (num <= 0) return field.onChange("1");
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                          {startDate.toLocaleDateString()}
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
                          {endDate.toLocaleDateString()}
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
