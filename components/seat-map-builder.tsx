"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export interface SeatItem {
  code: string;
  type: "normal" | "vip";
  status: "active" | "broken";
}

interface SeatMapBuilderProps {
  value: SeatItem[][];
  onChange: (seatMap: SeatItem[][]) => void;
  enableSeatStatus?: boolean; 
}

/**
 * Chuẩn hóa dữ liệu seat (KHÔNG DÙNG ANY)
 */
const normalizeSeat = (seat: Partial<SeatItem>): SeatItem => ({
  code: seat.code ?? "",
  type: seat.type ?? "normal",
  status: seat.status ?? "active",
});

export default function SeatMapBuilder({
  value,
  onChange,
  enableSeatStatus = false,
}: SeatMapBuilderProps) {
  const [rows, setRows] = useState<SeatItem[][]>([]);

  /** ============================================
   * KHỞI TẠO DỮ LIỆU BAN ĐẦU
   * ============================================ */
  useEffect(() => {
    if (value && Array.isArray(value)) {
      const normalized = value.map((row) =>
        row.map((seat) => normalizeSeat(seat))
      );
      setRows(normalized);
    }
  }, [value]);

  /** ============================================
   * THÊM HÀNG GHẾ
   * ============================================ */
  const addRow = () => {
    const rowIndex = rows.length;
    const rowLetter = String.fromCharCode(65 + rowIndex);

    const newRow: SeatItem[] = Array.from({ length: 8 }, (_, i) => ({
      code: `${rowLetter}${i + 1}`,
      type: "normal",
      status: "active",
    }));

    const updated = [...rows, newRow];
    setRows(updated);
    onChange(updated);
  };

  /** ============================================
   * CẬP NHẬT SỐ GHẾ TRONG HÀNG
   * ============================================ */
  const updateColumns = (rowIndex: number, seatCount: number) => {
    const rowLetter = String.fromCharCode(65 + rowIndex);

    const newRow: SeatItem[] = Array.from({ length: seatCount }, (_, i) => ({
      code: `${rowLetter}${i + 1}`,
      type: rows[rowIndex][i]?.type ?? "normal",
      status: rows[rowIndex][i]?.status ?? "active",
    }));

    const updated = rows.map((row, idx) =>
      idx === rowIndex ? newRow : row
    );

    setRows(updated);
    onChange(updated);
  };

  /** ============================================
   * CẬP NHẬT LOẠI GHẾ
   * ============================================ */
  const updateSeatType = (
    rowIndex: number,
    seatIndex: number,
    type: SeatItem["type"]
  ) => {
    const updated = rows.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((seat, sIdx) =>
            sIdx === seatIndex ? { ...seat, type } : seat
          )
        : row
    );

    setRows(updated);
    onChange(updated);
  };

  /** ============================================
   * CẬP NHẬT TRẠNG THÁI GHẾ
   * ============================================ */
  const updateSeatStatus = (
    rowIndex: number,
    seatIndex: number,
    status: SeatItem["status"]
  ) => {
    const updated = rows.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((seat, sIdx) =>
            sIdx === seatIndex ? { ...seat, status } : seat
          )
        : row
    );

    setRows(updated);
    onChange(updated);
  };

  /** ============================================
   * XÓA HÀNG
   * ============================================ */
  const removeRow = (rowIndex: number) => {
    const updated = rows.filter((_, i) => i !== rowIndex);
    setRows(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-3">
        <p className="font-semibold text-lg">Sơ đồ ghế</p>
        <Button type="button" onClick={addRow}>
          + Thêm hàng ghế
        </Button>
      </div>

      <div className="space-y-6">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="border p-4 rounded-md">

            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <p className="font-medium">
                Hàng {String.fromCharCode(65 + rowIndex)}
              </p>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={row.length}
                  onChange={(e) =>
                    updateColumns(rowIndex, Number(e.target.value))
                  }
                  className="w-20"
                />
                <span>ghế</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeRow(rowIndex)}
                >
                  Xóa
                </Button>
              </div>
            </div>

            {/* GHẾ */}
            <div className="flex gap-4 flex-wrap">
              {row.map((seat, seatIndex) => (
                <div key={seat.code} className="flex flex-col items-center gap-1">

                  {/* Seat visual */}
                  <div
                    className={`
                      w-10 h-10 flex items-center justify-center rounded-md border font-medium
                      ${seat.status === "broken"
                        ? "bg-gray-700 text-white border-gray-900 opacity-70"
                        : seat.type === "vip"
                        ? "bg-red-100 text-red-900 border-red-500"
                        : "bg-gray-200 text-gray-800 border-gray-400"
                      }
                    `}
                  >
                    {seat.code}
                  </div>

                  {/* TYPE SELECT */}
                  <Select
                    value={seat.type}
                    onValueChange={(val: SeatItem["type"]) =>
                      updateSeatType(rowIndex, seatIndex, val)
                    }
                  >
                    <SelectTrigger className="w-20 h-8 text-xs">
                      <SelectValue placeholder="Loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Thường</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* STATUS SELECT */}
                  {enableSeatStatus && (
                  <Select
                    value={seat.status}
                    onValueChange={(val: SeatItem["status"]) =>
                      updateSeatStatus(rowIndex, seatIndex, val)
                    }
                  >
                    <SelectTrigger className="w-20 h-8 text-xs">
                      <SelectValue placeholder="TT" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="broken">Hỏng</SelectItem>
                    </SelectContent>
                  </Select>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
