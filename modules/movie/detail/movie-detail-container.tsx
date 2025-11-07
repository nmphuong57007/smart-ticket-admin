"use client";

/* eslint-disable @typescript-eslint/no-empty-object-type */
import { MovieDetailPageProps } from "@/app/(main)/movies/[id]/detail/page";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { redirectConfig } from "@/helpers/redirect-config";
import MovieDetail from "./movie-detail";
interface MovieDetailContainerProps extends MovieDetailPageProps {}

export default function MovieDetailContainer({
  params,
}: MovieDetailContainerProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push(redirectConfig.movies);
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
                Chi Tiết Phim
              </Button>

              <div className="flex items-center gap-3">
                <Button>Thêm Phim</Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {params.id}
          <MovieDetail />
        </CardContent>
      </Card>
    </div>
  );
}
