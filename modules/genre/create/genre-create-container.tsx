"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import GenreCreateForm from "./genre-create";

export default function GenreCreateContainer() {
    
  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.seats}>
            <ArrowLeft />
            Danh Sách Thể Loại
          </Link>
        </Button>
      }
    >
       <GenreCreateForm/>
    </CardWrapperTable>
  );
}
