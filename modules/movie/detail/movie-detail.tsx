"use client";
import moment from "moment";
import Image from 'next/image'
import { Skeleton } from "@/components/ui/skeleton";
import { LucideHeart,LucideClock,LucideMonitor,LucideEthernetPort, LucideCheck, LucideCalendarCheck2, LucideCalendarX2, LucideCalendarArrowUp, LucideCalendarCog } from "lucide-react";
import { Button } from "@/components/ui/button"

interface MovieDataProps {
  id: number;
  title: string;
  poster: string;
  trailer: string;
  description: string;
  duration: number;
  format: string;
  language: string;
  release_date: string;
  end_date: null;
  status: string;
  created_at: string;
  updated_at: string;
  genres: {
        id: number;
        name: string;
    }[];
}

interface MovieDetailProps {
  movie: MovieDataProps;
  isLoading: boolean;
}


export default function MovieDetail({ movie, isLoading }: MovieDetailProps) {
  if (isLoading) {
    return <Skeleton className="h-6 w-full" />;
  }

  if (!movie) {
    return <div>Không có dữ liệu phim.</div>;
  }
  const STATUS_MAP: Record<string, string> = {
    coming: "Sắp chiếu",
    showing: "Đang chiếu",
    stopped: "Ngừng chiếu",
   
  };
console.log("Poster URL:", movie.poster);
  return (
    <div className="flex">
      <div className="w-1 flex-auto pl-50">
        
        <Image 
                  src={movie.poster||'https://placehold.co/600x400'}
                  alt={movie.title}
                  width={320}
                  height={440}
                  quality={90}
                  className="rounded-md w-80 h-110 object-cover"
                 priority
                />
      
      </div>
      <div className="w-90 flex-auto">
        
        <ul>
          <li>
            <div className="flex items-center gap-4 text-3xl font-medium ">   
               {movie.title}
            </div>
          </li>
          <li><br></br></li>
          <li>
            <div className="flex items-center gap-4 "> 
            <LucideHeart className="w-5 h-5 text-gray-700"  />  
             Thể loại: {movie.genres.map((genre) => genre.name).join(", ")}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
            <LucideClock className="w-5 h-5 text-gray-700"  />  
            Thời lượng: {movie.duration}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
            <LucideMonitor className="w-5 h-5 text-gray-700"  />  
            Định dạng: {movie.format}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
            <LucideEthernetPort className="w-5 h-5 text-gray-700"  />  
            Phụ đề: {movie.language}
            </div>
          </li>
          <li><br></br></li>
          <li>
            <p className="text-2xl font-normal">Tóm tắt nội dung</p>
            {movie.description}
          </li>
           <li><br></br></li>
          <li>
            <p className="text-2xl font-normal">Chi tiết khác</p>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
            <LucideCheck className="w-5 h-5 text-gray-700"  />  
            Trạng thái: {STATUS_MAP[movie.status] || "Không xác định"}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
            <LucideCalendarCheck2 className="w-5 h-5 text-gray-700"  />  
            Ngày phát hành: {movie.release_date}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
            <LucideCalendarX2 className="w-5 h-5 text-gray-700"  />  
            Ngày kết thúc: {movie.end_date}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
            <LucideCalendarArrowUp className="w-5 h-5 text-gray-700"  />  
            Ngày tạo: {moment(movie.created_at).format("DD/MM/YYYY")}
            </div>
          </li>
          <li>
            <div className="flex items-center gap-4 "> 
            <LucideCalendarCog className="w-5 h-5 text-gray-700"  />  
            Ngày sửa gần nhất: {moment(movie.updated_at).format("DD/MM/YYYY")}
            </div>
          </li>
          <li><br></br></li>
           <li>
            <Button variant="outline">
              <a
                href={movie.trailer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 w-30"
              >
                Xem Trailer
              </a>
            </Button>
            </li>
        </ul>
      </div>
    </div>
  );
}
