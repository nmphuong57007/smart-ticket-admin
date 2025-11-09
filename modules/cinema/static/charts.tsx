import { Skeleton } from "@/components/ui/skeleton";

interface CinemaStaticData {
  total_cinemas: number;
  total_rooms: number;
}

interface ChartsProps {
  cinemaStaticData: CinemaStaticData;
  isLoading: boolean;
}

export default function Charts({ cinemaStaticData, isLoading }: ChartsProps) {
  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-4" />
      </div>
    );
  }

  if (!cinemaStaticData) {
    return <div>Không có dữ liệu thống kê rạp chiếu phim.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Thống kê rạp chiếu phim</h2>
      <p>Tổng số rạp chiếu phim: {cinemaStaticData.total_cinemas}</p>
      <p>Tổng số phòng chiếu: {cinemaStaticData.total_rooms}</p>
    </div>
  );
}
