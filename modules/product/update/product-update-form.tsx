"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import instance from "@/lib/instance";
import { useUpdateProduct } from "@/api/hooks/use-product-update";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";

const schema = z.object({
  name: z.string().min(1, "Tên sản phẩm bắt buộc"),
  type: z.string().min(1, "Loại bắt buộc"),
  price: z.number().min(0, "Giá không hợp lệ"),
  stock: z.number().min(0, "Tồn kho không hợp lệ"),
  description: z.string().min(1, "Mô tả bắt buộc"),
  is_active: z.boolean(),
  image: z.any().optional(),
});

export default function ProductUpdateForm() {
  const router = useRouter();
  const { id } = useParams();

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "",
      price: 0,
      stock: 0,
      description: "",
      is_active: true,
      image: null,
    },
  });

  // ======================
  // LOAD PRODUCT FROM API
  // ======================
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await instance.get(`/api/products/${id}`);
        const p = res.data.data;

        form.reset({
          name: p.name,
          type: p.type,
          price: Number(p.price),
          stock: Number(p.stock),
          description: p.description,
          is_active: p.is_active,
          image: null, // file không thể prefill
        });

        setPreviewImage(p.image);

      } catch (err) {
        console.error(err);
        toast.error("Không tải được dữ liệu sản phẩm");
      }
    };

    fetchProduct();
  }, [id, form]);


  // ======================
  // SUBMIT UPDATE
  // ======================
  const onSubmit = (data: z.infer<typeof schema>) => {
    const formData = new FormData();

    formData.append("_method", "POST");

    formData.append("name", data.name);
    formData.append("type", data.type);
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("description", data.description);
    formData.append("is_active", data.is_active ? "1" : "0");

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    updateProduct(
      { id: Number(id), data: formData },
      {
        onSuccess: () => {
          toast.success("Cập nhật sản phẩm thành công!");
          router.push("/products");
        },
        onError: () => {
          toast.error("Cập nhật thất bại");
        },
      }
    );
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

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
                <Textarea placeholder="Nhập mô tả..." {...field} />
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
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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

              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded mb-2 border"
                />
              )}

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

        <Button disabled={isPending} type="submit" className="w-full">
          Cập nhật sản phẩm
          {isPending && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
