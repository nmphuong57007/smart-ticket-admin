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
import { useUpdateDiscount } from "@/api/hooks/use-discount-update";
import { useDiscounts } from "@/api/hooks/use-discount";
import { DiscountUpdateReqInterface } from "@/api/interfaces/discount-interface";
import { useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";

// Schema
export const formSchema = z
  .object({
    code: z.string().min(1).max(50),
    discount_percent: z
      .string()
      .refine((v) => !isNaN(Number(v)), "Phần trăm phải là số")
      .refine((v) => Number(v) > 0 && Number(v) <= 100, "1 - 100"),

    start_date: z.string().min(1),
    end_date: z.string().min(1),

    status: z.enum(["active", "expired"]),
  })
  .superRefine((values, ctx) => {
    if (new Date(values.end_date) < new Date(values.start_date)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_date"],
        message: "Ngày kết thúc phải sau ngày bắt đầu",
      });
    }
  });

export default function DiscountUpdateForm({ id }: { id: number }) {
  const router = useRouter();
  const { data: list, isLoading } = useDiscounts(9999, 1);
  const { mutate: updateDiscount, isPending } = useUpdateDiscount();

  const discount = list?.data?.find((d) => d.id === id);

  const today = new Date();
  const formatDate = (date: Date) => date.toLocaleDateString("en-CA");

  // UI states
  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date>(today);

  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      discount_percent: "",
      start_date: formatDate(today),
      end_date: formatDate(today),
      status: "active",
    },
  });

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
        discount_percent: String(discount.discount_percent),
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
      discount_percent: data.discount_percent,
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
          const res = (error as AxiosError).response?.data as { message: string };
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* CODE */}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã giảm giá</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PERCENT */}
        <FormField
          control={form.control}
          name="discount_percent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phần trăm giảm giá</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* START DATE */}
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

                    <PopoverContent className="p-0">
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

        {/* END DATE */}
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

                    <PopoverContent className="p-0">
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

        {/* STATUS */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <FormControl>
                <select className="h-9 w-full border rounded-md px-3" {...field}>
                  <option value="active">Đang hoạt động</option>
                  <option value="expired">Ngừng hoạt động</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SUBMIT */}
        <Button type="submit" className="w-full" disabled={isPending}>
          Cập nhật mã giảm giá
          {isPending && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
