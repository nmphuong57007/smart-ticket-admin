"use client";

import QRCode from "react-qr-code";
import { CheckinResponseData } from "@/api/interfaces/checkin-response";

interface Props {
  data: CheckinResponseData;
}

export function SeatTicketPrint({ data }: Props) {
  const seat = data.seats[0];

  return (
    <div className="border rounded-lg p-4 text-xs w-[280px] mx-auto">
      <h3 className="text-center font-bold mb-2">🎟️ VÉ XEM PHIM</h3>

      <div className="space-y-1">
        <p><b>Rạp:</b> {data.showtime.cinema.name}</p>
        <p><b>Phòng:</b> {data.showtime.room.name}</p>
        <p><b>Phim:</b> {data.showtime.movie.title}</p>
        <p><b>Suất:</b> {data.showtime.date} {data.showtime.time}</p>
        <p><b>Ghế:</b> {seat.seat_code}</p>
        <p><b>Giá:</b> {seat.price} VNĐ</p>
        <p><b>Mã đơn:</b> {data.booking.booking_code}</p>
      </div>

      <div className="mt-3 flex justify-center">
        <QRCode value={data.ticket.qr_code} size={120} />
      </div>

      <p className="mt-2 text-center text-[10px] text-gray-500">
        Vé hợp lệ cho 1 ghế – 1 lượt vào rạp
      </p>
    </div>
  );
}
