"use client";

import { CheckinResponseData } from "@/api/interfaces/checkin-response";

interface FoodPrintProps {
  data: CheckinResponseData;
}

export function FoodPrint({ data }: FoodPrintProps) {
  const { booking, products } = data;

  if (products.length === 0) {
    return (
      <div className="border rounded-lg p-4 text-sm text-center text-gray-500 bg-white">
        Không có đồ ăn
      </div>
    );
  }

  return (
    <div className="print-food border rounded-lg p-4 text-sm bg-white w-[400px]">
      <h3 className="text-center font-bold mb-3">🍿 PHIẾU ĐỒ ĂN</h3>

      <p className="mb-2">
        <b>Mã đơn:</b> {booking.booking_code}
      </p>

      <table className="w-full border text-xs">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1 text-left">Tên</th>
            <th className="border px-2 py-1 text-center">SL</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.product_id}>
              <td className="border px-2 py-1">{p.name}</td>
              <td className="border px-2 py-1 text-center">{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
