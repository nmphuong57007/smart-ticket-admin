import { useMutation } from "@tanstack/react-query";
import instance from "@/lib/instance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const res = await instance.post("/api/auth/logout");
      return res.data;
    },

    onSuccess: () => {
      // XÓA TOKEN
      localStorage.removeItem("token");

      toast.success("Đăng xuất thành công!");

      // CHUYỂN HƯỚNG
      router.push("/login");
    },

    onError: () => {
      toast.error("Đăng xuất thất bại!");
    },
  });
};
