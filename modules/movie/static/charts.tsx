"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";


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
  const [selectedGenre, setSelectedGenre] = useState("all");
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

  const genres = Object.keys(movieStaticData.by_genre ?? {});

 // Lọc dữ liệu
const filteredGenreData =
  selectedGenre !== "all"
    ? { [selectedGenre]: movieStaticData.by_genre[selectedGenre] }
    : movieStaticData.by_genre;
  
  return (
    <div>
        <h2 className="text-xl font-bold mb-4">Thống kê phim</h2>
        
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
         {/* --- Thống kê theo thể loại + Select --- */}
      <div className="mt-6">
        <p className="font-bold mb-2">Thống kê theo thể loại</p>

        {genres.length > 0 && (
          <div className="w-64 mb-4">
            <Select
              value={selectedGenre}
              onValueChange={(value) => setSelectedGenre(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả thể loại" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {genres.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {filteredGenreData && Object.keys(filteredGenreData).length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {(Object.entries(filteredGenreData) as [string, number][]).map(
              ([genre, count]) => (
                <Card
                  key={genre}
                  className="min-w-[180px] flex-col rounded-xl border shadow-sm p-4 bg-card"
                >
                  <span>{genre}</span>
                  <span className="font-bold">{count}</span>
                </Card>
              )
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Không có dữ liệu thể loại</p>
        )}
      </div>
    </div>
  
  );
}
