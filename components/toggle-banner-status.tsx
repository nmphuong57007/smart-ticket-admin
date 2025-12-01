"use client";

import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useUpdateBanner } from "@/api/hooks/use-banner-update";
import { useQueryClient } from "@tanstack/react-query";

export default function ToggleBannerStatus({
  id,
  value,
}: {
  id: number;
  value: boolean;
}) {
  const updateValue = value ? "0" : "1";
  const { mutate: updateBanner, isPending } = useUpdateBanner();

  const queryClient = useQueryClient(); // ⭐ Quan trọng

  const handleToggle = () => {
    const formData = new FormData();
    formData.append("is_published", updateValue);

    updateBanner(
      { id, data: formData },
      {
        onSuccess: () => {
          toast.success("Đã cập nhật trạng thái!");

          // ⭐ Cập nhật lại API banners
          queryClient.invalidateQueries({
            queryKey: ["getBanner"],
          });
        },
        onError: () => {
          toast.error("Cập nhật thất bại!");
        },
      }
    );
  };

  return (
    <Switch
      checked={value}
      onCheckedChange={handleToggle}
      disabled={isPending}
    />
  );
}
