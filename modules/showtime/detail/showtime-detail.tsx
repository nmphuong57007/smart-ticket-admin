"use client";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";
import {  LucideCalendarArrowUp, LucideCalendarCog, LucideChartPie, LucideCheck, LucideClapperboard, LucideClock3 } from "lucide-react";

interface ShowTimeDataProps {
      id: number;
        movie_id: number;
        room_id: number;
        movie: {
            id: number;
            title: string;
            poster: string;
            duration: number;
            release_date: string;
        };
        room: {
            id: number;
            name: string;
        };
        show_date: string;
        show_time: string;
        end_time: string;
        format: string;
        language_type: string;
        price: number;
        created_at: string;
        updated_at: string;
        seats: {
            id: number;
            seat_code: string;
            type: string;
            status: string;
            status_label: string;
            is_available: boolean;
            price: number;
        }[];
    }

 interface ShowTimeDetailProps {
    showtime: ShowTimeDataProps;
    isLoading: boolean;
}


export default function ShowTimeDetail({ showtime, isLoading }: ShowTimeDetailProps) {
  if (isLoading) {
    return <Skeleton className="h-6 w-full" />;
  }

  if (!showtime) {
    return <div>Không có dữ liệu phim.</div>;
  }
  const LANGUAGE_MAP: Record<string, string> = {
    sub: "Phụ đề",
    dub: "Lồng tiếng",
    narrated: "Thuyết minh",
   
  };

  return (
    <div className="flex">
      <div className="w-150 ml-50  " >
        <p className="text-xl font-semibold mb-4">Chi tiết suất chiếu</p>
        <ul>
          <li><br></br></li>
          <li>
            <div className="flex items-center gap-4 ">  
             <LucideClapperboard className="w-5 h-5 text-gray-700"  /> 
             Phòng chiếu: {showtime.room?.name}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
            <LucideChartPie className="w-5 h-5 text-gray-700"  /> 
            Phim chiếu: {showtime.movie?.title}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
              <LucideCheck className="w-5 h-5 text-gray-700"  />  
            Định dạng: {showtime.format}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
              <LucideCheck className="w-5 h-5 text-gray-700"  />  
            Ngôn ngữ trình chiếu: {LANGUAGE_MAP[showtime.language_type] || "Không xác định"}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
              <LucideCheck className="w-5 h-5 text-gray-700"  />  
            Giá vé: {showtime.price} VND
            </div>
          </li>
          <li><br></br></li>
          <li>
            <div className="flex items-center gap-4 "> 
            <LucideCalendarArrowUp className="w-5 h-5 text-gray-700"  />  
            Ngày chiếu: {moment(showtime.show_date).format("DD/MM/YYYY")}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4">
                <LucideClock3 className="w-5 h-5 text-gray-700" />
                Giờ chiếu: {moment(showtime.show_time, "HH:mm").format("HH:mm")}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4">
                <LucideClock3 className="w-5 h-5 text-gray-700" />
                Giờ kết thúc: {moment(showtime.end_time, "HH:mm").format("HH:mm")}
            </div>
          </li>

          <li>
            <div className="flex items-center gap-4 "> 
            <LucideCalendarArrowUp className="w-5 h-5 text-gray-700"  />  
            Ngày tạo: {moment(showtime.created_at).format("DD/MM/YYYY")}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
            <LucideCalendarCog className="w-5 h-5 text-gray-700"  />  
            Ngày sửa gần nhất: {moment(showtime.updated_at).format("DD/MM/YYYY")}
            </div>
          </li>  
        </ul>
      
      </div>
      
      <div>
<div className="text-xl font-semibold mb-4 text-center">Sơ đồ ghế</div>

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

{/* SƠ ĐỒ GHẾ */}
<div className="flex justify-center">
  <div className="inline-block p-4 bg-gray-100 rounded-md">
    {(() => {
      const seats = showtime.seats;

      // Gom nhóm ghế theo hàng A, B, C...
      const groupedSeats: Record<string, typeof seats> = {};

      seats.forEach((seat) => {
        const row = seat.seat_code.charAt(0);
        if (!groupedSeats[row]) groupedSeats[row] = [];
        groupedSeats[row].push(seat);
      });

      const sortedRows = Object.keys(groupedSeats).sort();

      return sortedRows.map((row) => {
        const rowSeats = groupedSeats[row].sort((a, b) => {
          const nA = parseInt(a.seat_code.slice(1));
          const nB = parseInt(b.seat_code.slice(1));
          return nA - nB;
        });

        return (
          <div key={row} className="flex mb-2 justify-center">
            {rowSeats.map((seat) => {
              const isVip = seat.type === "vip";
              const isBroken = seat.status !== "available";
              const isBooked = !seat.is_available;

              // GIỮ ĐÚNG MÀU NHƯ CODE BAN ĐẦU CỦA BẠN
              let colorClass = "";

              if (isBroken) {
                colorClass =
                  "bg-gray-700 text-white border-gray-900 opacity-70"; // ghế hỏng
              } else if (isBooked) {
                colorClass =
                  "bg-blue-600 text-white border-blue-800"; // ghế đã đặt – bạn dùng xanh đậm lúc đầu
              } else if (isVip) {
                colorClass =
                  "bg-red-100 text-red-900 border-red-500"; // ghế VIP
              } else {
                colorClass =
                  "bg-gray-200 text-gray-800 border-gray-400"; // ghế thường
              }

              return (
                <div
                  key={seat.id}
                  className={`
                    w-10 h-10 flex items-center justify-center
                    rounded-md mx-1 text-sm font-medium border
                    ${colorClass}
                  `}
                >
                  {seat.seat_code}
                </div>
              );
            })}
          </div>
        );
      });
    })()}
  </div>
</div>

{/* CHÚ THÍCH MÀU */}
<div className="flex justify-center gap-6 mt-4">
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded"></div>
    <span className="text-sm">Ghế trống</span>
  </div>

  <div className="flex items-center gap-2">
    <div className="w-4 h-4 bg-blue-600 border border-blue-800 rounded"></div>
    <span className="text-sm">Ghế đã đặt</span>
  </div>

  <div className="flex items-center gap-2">
    <div className="w-4 h-4 bg-red-100 border border-red-500 rounded"></div>
    <span className="text-sm">Ghế VIP</span>
  </div>

  <div className="flex items-center gap-2">
    <div className="w-4 h-4 bg-gray-700 border border-gray-900 rounded opacity-70"></div>
    <span className="text-sm">Ghế hỏng</span>
  </div>
</div>


  </div>

    </div>
  );
}
