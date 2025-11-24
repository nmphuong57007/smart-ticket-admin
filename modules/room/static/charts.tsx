"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


interface RoomStaticData {
   total_rooms: number;
        active_rooms: number;
        maintenance_rooms: number;
        closed_rooms: number;
        total_seats: number;
}

interface ChartsProps {
  roomStaticData: RoomStaticData;
  isLoading: boolean;
}



export default function Charts({ roomStaticData, isLoading }: ChartsProps) {
  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-6 w-1/2 mb-4" />
      </div>
    );
  }

  if (!roomStaticData) {
    return <div>Không có dữ liệu thống kê rạp phim.</div>;
  }


  
  return (
    <div>
        <h2 className="text-xl font-bold mb-4">Thống kê phòng chiếu</h2>
        
        <div className="flex justify-between gap-4 flex-wrap ">
            <Card className="flex-1 min-w-[180px] flex flex-col justify-center rounded-xl border shadow-sm p-4 bg-card">
                <CardHeader>
                    <CardTitle className="text-center">Tổng số phòng chiếu</CardTitle>
                </CardHeader>
                <CardContent className="text-center  ">
                    <p className="font-bold">{roomStaticData.total_rooms}</p>
                </CardContent>
            </Card>
            <Card className="flex-1 min-w-[180px] flex flex-col justify-center rounded-xl border shadow-sm p-4 bg-card">
                <CardHeader>
                    <CardTitle className="text-center w-s">Tổng số phòng chiếu đang hoạt động</CardTitle>
                </CardHeader>
                <CardContent className="text-center ">
                    <p className="font-bold">{roomStaticData.active_rooms}</p>
                </CardContent>
            </Card>
            <Card className="flex-1 min-w-[180px] flex flex-col  justify-center rounded-xl border shadow-sm p-4 bg-card">
                <CardHeader>
                    <CardTitle className="text-center w-s">Tổng số phòng chiếu đang sửa chữa</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="font-bold">{roomStaticData.maintenance_rooms}</p>
                </CardContent>
            </Card>
            <Card className="flex-1 min-w-[180px] flex flex-col  justify-center rounded-xl border shadow-sm p-4 bg-card">
                <CardHeader>
                    <CardTitle className=" text-center">Tổng số phòng chiếu đã đóng</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="font-bold">{roomStaticData.closed_rooms}</p>
                </CardContent>
            </Card>
            <Card className="flex-1 min-w-[180px] flex flex-col  justify-center rounded-xl border shadow-sm p-4 bg-card">
                <CardHeader>
                    <CardTitle className=" text-center">Tổng số ghế</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="font-bold">{roomStaticData.total_seats}</p>
                </CardContent>
            </Card>
        </div>


    </div>
  
  );
}
