"use client";
import moment from "moment";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LucideHeart,
  LucideClock,
  LucideMonitor,
  LucideEthernetPort,
  LucideCheck,
  LucideCalendarCheck2,
  LucideCalendarX2,
  LucideCalendarArrowUp,
  LucideCalendarCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    type: null;
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
}

interface BookingDetailProps {
  booking: BookingDataProps;
  isLoading: boolean;
}

export default function BookingDetail({ booking, isLoading }: BookingDetailProps) {
  if (isLoading) return <Skeleton className="h-6 w-full" />;

  if (!booking) return <div>Không có dữ liệu vé.</div>;

  // ==== FIX CHỖ NÀY ====
  const movie = booking.movie;
  console.log("Poster URL:", movie.poster);

  return (
    <div className="flex gap-6">


      {/* ======= MAIN INFO ======= */}
      <div className="flex-auto">

        {/* ======= MOVIE TITLE ======= */}
        <h2 className="text-3xl font-semibold mb-2">{movie.title}</h2>

        {/* ======= BOOKING INFO ======= */}
        <div className="space-y-2 mb-6">
          <p><b>Mã vé:</b> {booking.booking_code}</p>
          <p><b>Trạng thái thanh toán:</b> {booking.payment_status.toUpperCase()}</p>
          <p><b>Mã giao dịch:</b> {booking.transaction_code}</p>
          <p><b>Phương thức:</b> {booking.payment_method}</p>
          <p><b>Tổng tiền:</b> {booking.final_amount.toLocaleString()} VND</p>
          <p><b>Ngày đặt:</b> {booking.created_at}</p>
        </div>

        {/* ======= MOVIE INFO ======= */}
        <h3 className="text-xl font-medium mb-2">Thông tin phim</h3>
        <ul className="space-y-2">
          <li>• Thời lượng: {movie.duration} phút</li>
          <li>• Suất chiếu: {booking.showtime.time}</li>
          <li>• Rạp: {booking.cinema.name}</li>
          <li>• Phòng: {booking.room.name}</li>
        </ul>

        {/* ======= SEATS INFO ======= */}
        <h3 className="text-xl font-medium mt-6 mb-2">Ghế đã đặt</h3>
        <ul className="space-y-1">
          {booking.seats.map((s, i) => (
            <li key={i}>
              • Ghế: {s.seat_code} – QR: <span className="font-mono">{s.qr_code}</span>
            </li>
          ))}
        </ul>

        {/* ======= COMBO INFO ======= */}
        {booking.products.length > 0 && (
          <>
            <h3 className="text-xl font-medium mt-6 mb-2">Combo / Sản phẩm</h3>
            <ul className="space-y-1">
              {booking.products.map((p, i) => (
                <li key={i}>• {p.name} × {p.quantity}</li>
              ))}
            </ul>
          </>
        )}

      </div>
    </div>
  );
}
