"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

import CardWrapperTable from "@/components/card-wrapper-table";
import { BookingTable } from "./booking-table";
import { useBookings } from "@/api/hooks/use-booking";
import { Spinner } from "@/components/ui/spinner";
import Search from "@/components/search";

const per_page = 10;

export default function BookingContainer() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");

  const { data, isError, isLoading } = useBookings(
    per_page,
    page,
    "id",
    "desc",
    search
  );

  if (isError) toast.error("Đã có lỗi xảy ra khi tải danh sách vé.");

  // API chỉ trả về data: []
  const bookings = data?.data ?? [];

  // Bạn chưa có pagination trong API → tạm để lastPage = 1
  const lastPage = 1;

  return (
    <CardWrapperTable title="Quản lý Vé" actions={<Fragment></Fragment>}>
      <Search
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        loading={isLoading}
      />

      {isLoading ? (
        <Spinner className="size-10 mx-auto" />
      ) : (
        <BookingTable
          data={bookings} // API list trả về trực tiếp mảng
          setPage={setPage}
          lastPage={lastPage}
          currentPage={page}
        />
      )}
    </CardWrapperTable>
  );
}
