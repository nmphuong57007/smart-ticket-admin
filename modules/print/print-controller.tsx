"use client";

import "@/app/print.css";
import { useEffect, useState } from "react";
import { SeatTicketPrint } from "@/modules/print/seat-ticket-print";
import { FoodPrint } from "@/modules/print/food-print";
import { CheckinResponseData } from "@/api/interfaces/checkin-response";

export default function PrintController() {
  const [data, setData] = useState<CheckinResponseData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("PRINT_DATA");
    if (raw) {
      setData(JSON.parse(raw));
    }
  }, []);

  //  SAU KHI IN XONG
  useEffect(() => {
    if (!data) return;

    const handleAfterPrint = () => {
      // đánh dấu đã in
      localStorage.setItem(
        `booking_printed_${data.booking.booking_id}`,
        "1"
      );

      // quay lại TRANG CHI TIẾT + reload cứng
      window.location.href = `/bookings/${data.booking.booking_id}/detail`;
    };

    window.onafterprint = handleAfterPrint;

    return () => {
      window.onafterprint = null;
    };
  }, [data]);

  if (!data) return null;

  return (
    <>
      {/* ================= UI PREVIEW (KHÔNG IN) ================= */}
      <div className="no-print min-h-screen bg-gray-100 flex justify-center py-10">
        <div className="bg-white w-[900px] rounded-xl shadow p-8 space-y-10">
          {/* VÉ */}
          <div>
            <h2 className="font-semibold mb-6">🎟️ Vé xem phim</h2>
            <div className="grid grid-cols-2 gap-6 justify-items-center">
              {data.seats.map((_, i) => (
                <SeatTicketPrint
                  key={i}
                  data={{ ...data, seats: [data.seats[i]] }}
                />
              ))}
            </div>
          </div>

          {/* ĐỒ ĂN */}
          <div className="border-t pt-8">
            <h2 className="font-semibold mb-4">🍿 Phiếu đồ ăn</h2>
            <div className="justify-items-center">
                <FoodPrint data={data} />
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
                onClick={() => {
                    window.location.href = `/bookings/${data.booking.booking_id}/detail`;
                }}
                className="px-8 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-100"
                >
                ← Quay lại
            </button>


            <button
              onClick={() => window.print()}
              className="px-10 py-2 bg-blue-600 text-white rounded-md"
            >
              In tất cả
            </button>
          </div>
        </div>
      </div>

      {/* ================= NỘI DUNG IN ================= */}
      <div className="print-area">
        {/* mỗi vé = 1 trang */}
        {data.seats.map((_, i) => (
          <div key={i} className="print-page ticket-page">
            <SeatTicketPrint
              data={{ ...data, seats: [data.seats[i]] }}
            />
          </div>
        ))}

        {/* đồ ăn = 1 trang */}
        <div className="print-page food-page">
          <FoodPrint data={data} />
        </div>
      </div>
    </>
  );
}
