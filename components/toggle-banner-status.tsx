"use client";

import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ToggleStatusProps {
  id: number;
  value: boolean;
  queryKey: string; // "getBanner" | "getNews" | "getPromotion"
  updateFn: (
    params: {
      id: number;
      data: FormData;
    },
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    }
  ) => void;
  isPending: boolean;
}

export function ToggleBannerStatus({
  id,
  value,
  queryKey,
  updateFn,
  isPending,
}: ToggleStatusProps) {
  const queryClient = useQueryClient();

  const handleToggle = (checked: boolean) => {
    const formData = new FormData();
    formData.append("is_published", checked ? "1" : "0");

    updateFn(
      { id, data: formData },
      {
        onSuccess: () => {
          toast.success("Đã cập nhật trạng thái!");
          queryClient.invalidateQueries({ queryKey: [queryKey] });
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
