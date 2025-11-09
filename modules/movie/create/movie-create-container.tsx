"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import MovieCreateForm from "./movie-create-form";

export default function MovieCreateContainer() {
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
      <MovieCreateForm />
    </CardWrapperTable>
  );
}
