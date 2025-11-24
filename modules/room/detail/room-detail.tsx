"use client";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";
import {  LucideCalendarArrowUp, LucideCalendarCog, LucideChartPie, LucideCheck, LucideClapperboard } from "lucide-react";

interface RoomDataProps {
     id: number;
        name: string;
        seat_map: {
            code: string;
            type: string;
            status: string;
        }[][];
        total_seats: number;
        seat_types: {
            vip: number;
            normal: number;
        };
        status: {
            code: string;
            label: string;
        };
        created_at: string;
        updated_at: string;
    }

 interface RoomDetailProps {
    room: RoomDataProps;
    isLoading: boolean;
}


export default function RoomDetail({ room, isLoading }: RoomDetailProps) {
  if (isLoading) {
    return <Skeleton className="h-6 w-full" />;
  }

  if (!room) {
    return <div>Không có dữ liệu phim.</div>;
  }
  return (
    <div className="flex">
      <div className="w-150 ml-50  " >
        <p className="text-xl font-semibold mb-4">Chi tiết phòng chiếu</p>
        <ul>
          <li><br></br></li>
          <li>
            <div className="flex items-center gap-4 ">  
             <LucideClapperboard className="w-5 h-5 text-gray-700"  /> 
             Phòng chiếu: {room.name}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
            <LucideChartPie className="w-5 h-5 text-gray-700"  /> 
            Tổng số ghế: {room.total_seats}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
              <LucideCheck className="w-5 h-5 text-gray-700"  />  
            Trạng thái: {room.status?.label}
            </div>
          </li>
          <li><br></br></li>
          <li>
            <div className="flex items-center gap-4 "> 
            <LucideCalendarArrowUp className="w-5 h-5 text-gray-700"  />  
            Ngày tạo: {moment(room.created_at).format("DD/MM/YYYY")}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
            <LucideCalendarCog className="w-5 h-5 text-gray-700"  />  
            Ngày sửa gần nhất: {moment(room.updated_at).format("DD/MM/YYYY")}
            </div>
          </li>
        </ul>
      </div>
      <div>
  <div className="text-xl font-semibold mb-4">Sơ đồ ghế</div>

      {/* --- MÀN HÌNH CHIẾU --- */}
    <div className="flex justify-center mb-6">
      <div className="flex flex-col items-center">
        
        {/* Đường màn hình cong */}
        <div
          className="w-[300px] h-3 bg-gray-400 rounded-b-xl"
          style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.2)" }}
        ></div>

        {/* Chữ màn hình */}
        <span className="mt-2 text-sm font-semibold tracking-wider text-gray-700">
          MÀN HÌNH CHIẾU
        </span>
      </div>
    </div>


    {/* Sơ đồ ghế */}
    <div className="inline-block p-4 bg-gray-100 rounded-md">
      {(() => {
        const maxSeatCount = Math.max(...room.seat_map.map((row) => row.length));

        return room.seat_map.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex mb-2 justify-center"
            style={{
              width: `${maxSeatCount * 48}px`, // 48px = 40px ghế + 8px margin hai bên
            }}
          >
            {row.map((seat, seatIndex) => {
              const isVip = seat.type === "vip";
              const isBroken = seat.status !== "active";

              let colorClass = "";

              if (isBroken) {
                colorClass =
                  "bg-gray-700 text-white border-gray-900 opacity-70";
              } else if (isVip) {
                colorClass = "bg-red-100 text-red-900 border-red-500";
              } else {
                colorClass = "bg-gray-200 text-gray-800 border-gray-400";
              }

              return (
                <div
                  key={seatIndex}
                  className={`
                    w-10 h-10 flex items-center justify-center
                    rounded-md mx-1 text-sm font-medium border 
                    ${colorClass}
                  `}
                >
                  {seat.code}
                </div>
              );
            })}
          </div>
        ));
      })()}
    
    </div>

  
      {/* Chú thích */}
    <div className="flex items-center gap-9 mb-4 mt-7">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-200 border border-gray-400 rounded"></div>
        <span className="text-sm">Ghế Thường</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-red-100 border border-red-500 rounded"></div>
        <span className="text-sm">Ghế VIP</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-700 border border-gray-900 rounded"></div>
        <span className="text-sm text-gray-700">Ghế Hỏng</span>
      </div>
    </div>
  </div>

    </div>
  );
}
