"use client";

/* eslint-disable @typescript-eslint/no-empty-object-type */
import { CinemaDetailPageProps } from "@/app/(main)/cinemas/[id]/detail/page";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { redirectConfig } from "@/helpers/redirect-config";
import CinemaDetail from "./cinema-detail";

interface CinemaDetailContainerProps extends CinemaDetailPageProps {}

export default function CinemaDetailContainer({
  params,
}: CinemaDetailContainerProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push(redirectConfig.cinemas);
  };

  return (
    <div className="mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                style={{ padding: 0 }}
              >
                <ArrowLeft />
                Chi Tiết Rạp Chiếu Phim
              </Button>

              <div className="flex items-center gap-3">
                <Button>Thêm Rạp Chiếu Phim</Button>
                <Button variant="secondary">Thống kê rạp</Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {params.id}
          <CinemaDetail />
        </CardContent>
      </Card>
    </div>
  );
}
