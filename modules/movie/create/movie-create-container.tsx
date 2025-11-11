"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import MovieCreateForm from "./movie-create-form";
import { useRenge } from "@/api/hooks/use-genre";

export default function MovieCreateContainer() {
  const {data: rengeData} = useRenge();
  if (rengeData) console.log("rengeData:", rengeData);
  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.movies}>
            <ArrowLeft />
            Danh Sách Phim
          </Link>
        </Button>
      }
    >
      {rengeData && (
      <MovieCreateForm rengeData={rengeData?.data??[]} />
      )}
      
      
    </CardWrapperTable>
  );
}
