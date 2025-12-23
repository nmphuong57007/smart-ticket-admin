"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

import CardWrapperTable from "@/components/card-wrapper-table";
import { BookingTable } from "./booking-table";
import { useBookings } from "@/api/hooks/use-booking";
import { Spinner } from "@/components/ui/spinner";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";


const QRScanner = dynamic(() => import("@/components/qr-scanner"), {
  ssr: false,
});

const per_page = 10;

export default function BookingContainer() {
  const [page, setPage] = useState<number>(1);
  const [bookingId, setBookingId] = useState<number | undefined>();
  const [bookingCode, setBookingCode] = useState<string>("");
  const [qrCode, setQrCode] = useState<string | undefined>();
  const [scannerOpen, setScannerOpen] = useState<boolean>(false);

  const { data, isError, isLoading } = useBookings(
    per_page,
    page,
    "id",
    "desc",
    bookingId,
    bookingCode,
    qrCode
  );


  useEffect(() => {
    if (isError) {
      toast.error("Đã có lỗi xảy ra khi tải danh sách vé.");
    }
  }, [isError]);

  const bookings = data?.data ?? [];
  const lastPage = data?.meta.last_page || 1;

  const handleScanResult = useCallback((rawText: string) => {
    if (!rawText) return;

    setQrCode(rawText.trim()); // 👈 gửi thẳng base64
    setBookingId(undefined);
    setBookingCode("");
    setPage(1);
    setScannerOpen(false);

    toast.success("Đã quét QR thành công");
  }, []);

    return (
    
    <>
      <CardWrapperTable
        title="Quản lý đơn vé"
        actions={
          <Fragment>
            <Button
              type="button"
              variant="outline"
              className="text-sm"
              onClick={() => setScannerOpen(true)}
            >
              Quét mã QR
            </Button>
          </Fragment>
        }
      >
        <Search
        value={bookingCode}
        onChange={(v) => {
          setBookingCode(v);
          setBookingId(undefined);
          setQrCode(undefined);
          setPage(1);
        }}
        onSearch={(v) => {
          if (/^\d+$/.test(v)) {
            setBookingId(Number(v)); // nếu là số → booking_id
            setBookingCode("");
          } else {
            setBookingCode(v); // nếu là chữ → booking_code
            setBookingId(undefined);
          }
          setQrCode(undefined);
          setPage(1);
        }}
        loading={isLoading}
      />


        {isLoading ? (
          <Spinner className="size-10 mx-auto" />
        ) : (
          <BookingTable
            data={bookings}
            setPage={setPage}
            lastPage={lastPage}
            currentPage={page}
          />
        )}
      </CardWrapperTable>

      {/* ===== MODAL QUÉT QR GIỐNG ẢNH BẠN GỬI ===== */}
      <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
        <DialogContent className="max-w-lg p-0">
          <DialogHeader className="px-6 pt-4 pb-2 border-b">
            <DialogTitle>Quét Mã QR Vé</DialogTitle>
            <DialogDescription className="mt-1">
              Đặt mã QR vào khung hình bên dưới
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pt-4 pb-2 text-xs text-gray-500">
            Đang tải camera...
          </div>

          <div className="px-6 pb-4">
            <QRScanner onScan={handleScanResult} />
          </div>

          <div className="px-6 pb-4 flex justify-end border-t pt-3">
            <Button
              variant="outline"
              className="border-red-300 text-red-500 hover:bg-red-50"
              onClick={() => setScannerOpen(false)}
            >
              Dừng Quét
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
