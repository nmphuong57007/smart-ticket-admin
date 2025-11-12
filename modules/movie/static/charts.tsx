import { Skeleton } from "@/components/ui/skeleton";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface MovieStaticData {
    overview: {
            total_movies: number;
            showing_movies: number;
            coming_movies: number;
            stopped_movies: number;
        };
    percentages: {
            showing: number;
            coming: number;
            stopped: number;
        };
    by_genre: {
            [genreName: string]: number;
        };
    
    recent_movies: {
            id: number;
            title: string;
            poster: string;
            trailer: string;
            description: string;
            duration: number;
            format: string;
            language: string;
            release_date: string;
            end_date: string | null;
            status: string;
            created_at: string;
            updated_at: string
            ;
            genres: {
                id: number
                name: string
                ;
            }[];
        }[];
}

interface ChartsProps {
  movieStaticData: MovieStaticData;
  isLoading: boolean;
}



export default function Charts({ movieStaticData, isLoading }: ChartsProps) {
  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-6 w-1/2 mb-4" />
      </div>
    );
  }

  if (!movieStaticData) {
    return <div>Không có dữ liệu thống kê rạp phim.</div>;
  }

  
  return (
    <div>
        <h2 className="text-xl font-bold mb-4">Thống kê rạp chiếu phim</h2>
        
        <div className="flex justify-between gap-4 flex-wrap ">
            <Card className="flex-1 min-w-[180px] flex flex-col justify-center rounded-xl border shadow-sm p-4 bg-card">
                <CardHeader>
                    <CardTitle className="text-center w-xs">Tổng số phim</CardTitle>
                </CardHeader>
                <CardContent className="text-center  ">
                    <p className="font-bold">{movieStaticData.overview.total_movies}</p>
                </CardContent>
            </Card>
            <Card className="flex-1 min-w-[180px] flex flex-col justify-center rounded-xl border shadow-sm p-4 bg-card">
                <CardHeader>
                    <CardTitle className="text-center w-xs">Tổng số phim đang chiếu</CardTitle>
                </CardHeader>
                <CardContent className="text-center ">
                    <p className="font-bold">{movieStaticData.overview.showing_movies}</p>
                </CardContent>
            </Card>
            <Card className="flex-1 min-w-[180px] flex flex-col  justify-center rounded-xl border shadow-sm p-4 bg-card">
                <CardHeader>
                    <CardTitle className="text-center w-xs">Tổng số phim sắp chiếu</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="font-bold">{movieStaticData.overview.coming_movies}</p>
                </CardContent>
            </Card>
            <Card className="flex-1 min-w-[180px] flex flex-col  justify-center rounded-xl border shadow-sm p-4 bg-card">
                <CardHeader>
                    <CardTitle className="text-center w-xs">Tổng số phim dừng chiếu</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="font-bold">{movieStaticData.overview.stopped_movies}</p>
                </CardContent>
            </Card>
        </div>
         <div><br />
        <p className="font-bold">Thống kê theo thể loại</p>
        {movieStaticData.by_genre &&
        Object.keys(movieStaticData.by_genre).length > 0 ? (
          <div>
            {(Object.entries(movieStaticData.by_genre) as [string, number][]).map(
              ([genre, count]) => (
                <div key={genre}>
                   <Card className=" min-w-[180px] flex-col rounded-xl border shadow-sm p-4 bg-card">
                    <span>{genre}</span>
                    <span className="font-bold">{count}</span>
                  </Card> 
                </div>
              )
            )}
        </div>
        ) : (
          <p className="text-sm text-gray-500">Không có dữ liệu thể loại</p>
        )}
      </div>
    </div>
    // <div>
    //   <h2 className="text-xl font-bold mb-4">Thống kê rạp chiếu phim</h2>
    //   <div>
    //   <p>Tổng quan phim:</p>
    //   <p>Tổng số phim:  {movieStaticData.overview.total_movies}</p>
    //   <p>Tổng số phim đang chiếu:  {movieStaticData.overview.showing_movies}</p>
    //   <p>Tổng số phim sắp chiếu:  {movieStaticData.overview.coming_movies}</p>
    //   <p>Tổng số phim dừng chiếu:  {movieStaticData.overview.stopped_movies}</p>
    //   </div>
     
    //   {/* <p>Tổng số phòng chiếu: {movieStaticData.total_rooms}</p> */}
    // </div>
  );
}
