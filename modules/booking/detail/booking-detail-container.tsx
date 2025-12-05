"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useBookingDetail } from "@/api/hooks/use-booking-detail";
import CardWrapperTable from "@/components/card-wrapper-table";
import { Button } from "@/components/ui/button";
import { redirectConfig } from "@/helpers/redirect-config";
import BookingDetail from "./booking-detail";
import { toast } from "sonner";
import { Fragment } from "react";

interface BookingDetailContainerProps {
  id: string;
}

export default function BookingDetailContainer({
  id,
}: BookingDetailContainerProps) {
  const { data: bookingDetail, isLoading, isError } = useBookingDetail(Number(id));

  if (isError) return toast.error("Đã có lỗi xảy ra khi tải chi tiết vé.");

  return (
    <CardWrapperTable
      title={
        <Button asChild variant="ghost" style={{ padding: 0 }}>
          <Link href={redirectConfig.bookings}>
            <ArrowLeft />
            Chi tiết vé
          </Link>
        </Button>
      }
    >
      {bookingDetail && (
        <BookingDetail booking={bookingDetail.data} isLoading={isLoading} />
      )}
    </CardWrapperTable>
  );
}
