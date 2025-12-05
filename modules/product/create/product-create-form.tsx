"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

import { useCreateProduct } from "@/api/hooks/use-product-create";
import type { ProductCreatResInterface } from "@/api/interfaces/product-interface";

const formSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  type: z.string().min(1, "Loại sản phẩm là bắt buộc"),
  price: z.number().min(1, "Giá phải lớn hơn 0"),
  description: z.string().min(1, "Mô tả không được để trống"),
  stock: z.number().min(0, "Tồn kho phải >= 0"),
  is_active: z.boolean().default(true),
  image: z
    .any()
    .refine((file) => file instanceof File, "Ảnh sản phẩm là bắt buộc"),
});

export default function ProductCreateForm() {
  const router = useRouter();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      price: 0,
      description: "",
      stock: 0,
      is_active: true,
      image: null,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("type", data.type);
    formData.append("price", String(data.price));
    formData.append("description", data.description);
    formData.append("stock", String(data.stock));
    formData.append("is_active", data.is_active ? "1" : "0");
    formData.append("image", data.image as unknown as Blob);

    createProduct(formData as unknown as ProductCreatResInterface, {
      onSuccess: () => {
        toast.success("Tạo sản phẩm thành công!");
        router.push(" /products");
      },
      onError: () => {
        toast.error("Tạo sản phẩm thất bại!");
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">

        {/* NAME */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sản phẩm</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên sản phẩm..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TYPE */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại sản phẩm</FormLabel>
              <FormControl>
                <Input placeholder="combo / drink / food..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PRICE */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="Nhập giá..."
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* STOCK */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tồn kho</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="Số lượng tồn kho"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DESCRIPTION */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập mô tả sản phẩm..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ACTIVE */}
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
              </FormControl>
              <FormLabel>Kích hoạt sản phẩm</FormLabel>
            </FormItem>
          )}
        />

        {/* IMAGE */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ảnh sản phẩm</FormLabel>
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

        <Button type="submit" className="w-full" disabled={isCreating}>
          Tạo sản phẩm
          {isCreating && <Spinner className="ml-2" />}
        </Button>
      </form>
    </Form>
  );
}
