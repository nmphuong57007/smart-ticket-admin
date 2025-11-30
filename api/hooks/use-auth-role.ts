import instance from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";


export const useAuthRole = () => {
  return useQuery({
    queryKey: ["authRole"],
    queryFn: async () => {
      const res = await instance.get("/api/auth/profile");

      if (!res.data?.data?.user) {
        throw new Error("NO_TOKEN");
      }

      const role = res.data.data.user.role;

      if (role !== "admin") {
        throw new Error("NO_PERMISSION");
      }

      return role;
    },
    retry: false,
  });
};
