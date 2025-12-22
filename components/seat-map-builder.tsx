"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
 * Chuẩn hóa dữ liệu seat
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

  /* =========================
     INIT DATA
  ========================= */
  useEffect(() => {
    if (Array.isArray(value)) {
      setRows(value.map((row) => row.map(normalizeSeat)));
    }
  }, [value]);

  /* =========================
     ADD / REMOVE ROW
  ========================= */
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

  const removeRow = (rowIndex: number) => {
    const updated = rows.filter((_, i) => i !== rowIndex);
    setRows(updated);
    onChange(updated);
  };

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

  /* =========================
     SEAT ACTIONS
  ========================= */
  const toggleSeatType = (rowIndex: number, seatIndex: number) => {
    
    const updated = rows.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((seat, sIdx) =>
            sIdx === seatIndex
              ? {
                  ...seat,
                  type: (seat.type === "vip" ? "normal" : "vip") as "normal" | "vip",
                }
              : seat
          )
        : row
    );

    setRows(updated);
    onChange(updated);
  };

  const toggleSeatStatus = (rowIndex: number, seatIndex: number) => {
    if (!enableSeatStatus) return;

    const updated = rows.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((seat, sIdx) =>
            sIdx === seatIndex
              ? {
                  ...seat,
                  status: (seat.status === "broken" ? "active" : "broken") as "active" | "broken",
                }
              : seat
          )
        : row
    );

    setRows(updated);
    onChange(updated);
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Sơ đồ ghế</p>
        <Button type="button" onClick={addRow}>
          + Thêm hàng ghế
        </Button>
      </div>

      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center gap-4 rounded-lg border bg-white p-4"
          >
            {/* LABEL HÀNG */}
            <div className="w-16 font-medium">
              Hàng {String.fromCharCode(65 + rowIndex)}
            </div>

            {/* SEATS */}
            <div
              className="grid gap-2 flex-1"
              style={{
                gridTemplateColumns: `repeat(${row.length}, 44px)`,
              }}
            >
              {row.map((seat, seatIndex) => {
                const isBroken = seat.status === "broken";
                const isVip = seat.type === "vip";

                return (
                  <button
                    key={seat.code}
                    type="button"
                    onClick={() =>
                      toggleSeatType(rowIndex, seatIndex)
                    }
                    onDoubleClick={() =>
                      toggleSeatStatus(rowIndex, seatIndex)
                    }
                    className={`
                      w-11 h-8
                      rounded-md border text-xs font-semibold
                      flex items-center justify-center
                      transition select-none
                      ${
                        isBroken
                          ? "bg-gray-300 text-gray-600 border-gray-400"
                          : isVip
                          ? "bg-red-100 border-red-500 text-red-600"
                          : "border-gray-400 text-gray-700"
                      }
                    `}
                  >
                    {isBroken ? "X" : seat.code}
                  </button>
                );
              })}
            </div>

            {/* CONTROLS */}
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                value={row.length}
                onChange={(e) =>
                  updateColumns(rowIndex, Number(e.target.value))
                }
                className="w-20"
              />
              <span>ghế</span>
              <Button
               type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeRow(rowIndex)}
              >
                Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>


      {/* LEGEND */}
      <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-6 rounded border border-gray-400" />
          Ghế thường
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-6 rounded border bg-red-100 border-red-500 text-red-600" />
          Ghế VIP
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-6 rounded bg-gray-300 border border-gray-400" />
          Ghế hỏng
        </div>

        <span className="font-medium">
          Click: VIP / Thường · Double click: Ẩn ghế
        </span>
      </div>
    </div>
  );
}
