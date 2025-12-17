"use client";

import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import {
  CheckinResponseData,
  CheckinSeat,
  CheckinProduct,
} from "@/api/interfaces/checkin-response";

import { useRouter } from "next/navigation";
import { checkinTicket } from "@/api/hooks/use-checkin";



interface BookingDataProps {
  id: number;
  booking_code: string;
  payment_status: string;
  transaction_code: string;
  payment_method: string;
  final_amount: number;
  created_at: string;
  user: {
    fullname: string;
    email: string;
    phone: string;
  };
  movie: {
    id: number;
    title: string;
    duration: number;
    poster: string;
  };
  showtime: {
    id: number;
    time: string;
    date: string;
    
  };
  cinema: {
    id: number;
    name: string;
  };
  room: {
    id: number;
    name: string;
  };
  seats: {
    seat_code: string;
    qr_code: string;
  }[];
  products: {
    name: string;
    quantity: number;
  }[];
  qr_code: string
}

interface BookingDetailProps {
  booking: BookingDataProps;
  isLoading: boolean;
}

export default function BookingDetail({ booking, isLoading }: BookingDetailProps) {
  const [hasPrinted, setHasPrinted] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const printRef = useRef<HTMLDivElement | null>(null); // 👉 phần cần in
  const router = useRouter();

  // Đọc trạng thái đã in từ localStorage khi vào trang
  useEffect(() => {
    if (!booking) return;
    try {
      const stored = localStorage.getItem(`booking_printed_${booking.id}`);
      if (stored === "1") setHasPrinted(true);
    } catch (e) {
      console.error("Cannot read localStorage", e);
    }
  }, [booking?.id]);

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (!booking) return <div>Không có dữ liệu vé.</div>;

  const movie = booking.movie;

  const doAn =
    booking.products.length > 0
      ? booking.products.map((p) => `${p.name} x${p.quantity}`).join(", ")
      : "Không có";

  // có mã giao dịch và chưa in thì mới cho in
  const canPrint = Boolean(booking.transaction_code) && !hasPrinted;
  const printData: CheckinResponseData = {
  booking: {
    booking_id: booking.id,
    booking_code: booking.booking_code,
  },
  showtime: {
    date: booking.showtime.date,
    time: booking.showtime.time,
    cinema: { name: booking.cinema.name },
    room: { name: booking.room.name },
    movie: { title: booking.movie.title },
  },
  seats: booking.seats.map(
    (s): CheckinSeat => ({
      seat_id: s.seat_code,
      seat_code: s.seat_code,
    })
  ),
  products: booking.products.map(
    (p): CheckinProduct => ({
      product_id: p.name,
      name: p.name,
      quantity: p.quantity,
    })
  ),
  ticket: {
    qr_code: booking.seats[0]?.qr_code || "",
  },
};

const handleCheckinAndPrint = async () => {
  if (!canPrint || isPrinting) return;

  try {
    setIsPrinting(true);

    //  GỌI API CHECK-IN
    const res = await checkinTicket(booking.qr_code);

    // LƯU DATA ĐỂ TRANG /print DÙNG
    sessionStorage.setItem(
      "PRINT_DATA",
      JSON.stringify(res.data)
    );

    //  ĐÁNH DẤU ĐÃ IN (FRONTEND)
    localStorage.setItem(
      `booking_printed_${booking.id}`,
      "1"
    );
    setHasPrinted(true);

    //  CHUYỂN SANG TRANG IN
    router.push(`/print/${booking.id}`);
  } catch (err) {
    alert("Check-in hoặc in vé thất bại");
    console.error(err);
  } finally {
    setIsPrinting(false);
  }
};


const handlePrint = () => {
  
  if (!canPrint) return;

  // lưu data in
  sessionStorage.setItem("PRINT_DATA", JSON.stringify(printData));

  // điều hướng sang print-controller
  router.push(`/print/${booking.id}`);
};

  let badgeText = "";
  let badgeClass = "";

  if (!booking.transaction_code) {
    badgeText = "Không thể in";
    badgeClass = "bg-gray-200 text-gray-600";
  } else if (hasPrinted) {
    badgeText = "Đã in";
    badgeClass = "bg-red-100 text-red-600";
  } else {
    badgeText = "Chưa in";
    badgeClass = "bg-green-100 text-green-600";
  }

  return (
    <div className="bg-white rounded-xl shadow-md border p-6 space-y-6">
      {/* 🔹 CHỈ PHẦN NÀY SẼ ĐƯỢC IN */}
      <div ref={printRef} className="print-area">
        {/* HEADER: TIÊU ĐỀ + TRẠNG THÁI IN */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg md:text-xl font-semibold">
            Chi tiết đơn vé #{booking.id}
          </h1>
          <span
            className={`px-3 py-1 text-xs md:text-sm rounded-full font-medium ${badgeClass}`}
          >
            {badgeText}
          </span>
        </div>

        {/* HÀNG 1: THÔNG TIN KHÁCH + THANH TOÁN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          {/* CỘT TRÁI: KHÁCH HÀNG */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="w-28 text-gray-500">Họ tên:</span>
              <span className="font-medium">{booking.user.fullname}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-28 text-gray-500">SDT:</span>
              <span>{booking.user.phone}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-28 text-gray-500">Email:</span>
              <span>{booking.user.email}</span>
            </div>
          </div>

          {/* CỘT PHẢI: THANH TOÁN */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-28 text-gray-500">Thanh toán:</span>
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                {booking.payment_method?.toUpperCase() || "N/A"}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="w-28 text-gray-500">Tổng tiền:</span>
              <span className="font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-md text-lg shadow-sm">
                {booking.final_amount.toLocaleString()} đ
              </span>
            </div>
            <div className="flex gap-2">
              <span className="w-28 text-gray-500">Mã giao dịch:</span>
              <span>{booking.transaction_code || "-"}</span>
            </div>
          </div>
        </div>

        <div className="border-t my-4" />

        {/* HÀNG 2: THÔNG TIN VÉ XEM PHIM */}
        <div className="space-y-4">
          <div className="font-semibold">Thông tin vé xem phim</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            {/* CỘT TRÁI: PHIM */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="w-28 text-gray-500">Phim:</span>
                <span className="font-medium uppercase">{movie.title}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-28 text-gray-500">Ngày chiếu:</span>
                <span>{booking.showtime.date}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-28 text-gray-500">Thời gian:</span>
                <span>{booking.showtime.time}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-28 text-gray-500">Thời lượng:</span>
                <span>{movie.duration} Phút</span>
              </div>
            </div>

            {/* CỘT PHẢI: RẠP */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="w-28 text-gray-500">Rạp:</span>
                <span>{booking.cinema.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-28 text-gray-500">Phòng chiếu:</span>
                <span>{booking.room.name}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-28 text-gray-500">Ghế đã đặt:</span>
                <div className="flex flex-wrap gap-2">
                  {booking.seats.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-green-100 text-green-700 font-semibold rounded-md text-sm"
                    >
                      {s.seat_code}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <span className="w-28 text-gray-500">Đồ ăn:</span>
                <span>{doAn}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NÚT HÀNH ĐỘNG – KHÔNG IN */}
<div className="flex items-center justify-center gap-4 pt-2">
<button
  disabled={!canPrint || isPrinting}
  onClick={handleCheckinAndPrint}
  className="px-4 py-2 bg-blue-600 text-white rounded
             disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isPrinting ? "Đang in..." : "In đơn vé"}
</button>


</div>


    </div>
  );
}
