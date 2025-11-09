"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useDeviceName } from "@/hooks/use-device-name";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/api/hooks/use-login";
import { Spinner } from "@/components/ui/spinner";
import { setToken } from "@/helpers/has-token";
import { redirectConfig } from "@/helpers/redirect-config";

const formSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
  device_name: z.string().min(1, "Tên thiết bị là bắt buộc"),
});

export default function FormLogin() {
  const router = useRouter();

  const { getDeviceName } = useDeviceName();

  const { mutate: login, isPending: isLoggingIn } = useLogin();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      device_name: getDeviceName(),
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    login(data, {
      onSuccess: (data) => {
        toast.success("Đăng nhập thành công!");
        setToken(data.data.token);
        router.push(redirectConfig.dashboard);
      },

      onError: () => {
        toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Nhập mật khẩu của bạn"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoggingIn}>
          Đăng nhập
          {isLoggingIn && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
