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

import { redirectConfig } from "@/helpers/redirect-config";

import { useCreateGenre } from "@/api/hooks/use-genre-create";

// ============================
// ZOD SCHEMA
// ============================
export const formSchema = z
  .object({
    name: z.string().min(1, "Tên thể loại là bắt buộc").max(50),
  })
 
// ============================
// COMPONENT
// ============================
export default function GenreCreateForm() {
  const router = useRouter();
  const { mutate: createGenre, isPending: isCreating } = useCreateGenre();



  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });


  // ============================
  // SUBMIT HANDLER
  // ============================
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createGenre(data, {
      onSuccess: () => {
        toast.success("Tạo mã giảm giá thành công!");
        router.push(redirectConfig.seats);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên thể loại</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: Hài hước" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isCreating}>
          Tạo thể loại
          {isCreating && <Spinner className="ml-2" />}
        </Button>

      </form>
    </Form>
  );
}
