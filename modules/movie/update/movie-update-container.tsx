"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import { useRenge } from "@/api/hooks/use-genre";
import MovieUpdateForm from "./movie-update-form";

export default function MovieUpdateContainer() {
  
  const {data: rengeData} = useRenge();
  if (rengeData) console.log("rengeData:", rengeData);
  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.movies}>
            <ArrowLeft />
            Danh sách phim
          </Link>
        </Button>
      }
    >
      {rengeData && (
      <MovieUpdateForm rengeData={rengeData?.data??[]} />
      )}
      
      
    </CardWrapperTable>
  );
}
