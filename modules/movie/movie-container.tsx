"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MovieTable } from "./movie-table";
import { Button } from "@/components/ui/button";
import { useMovie } from "@/api/hooks/use-movie";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";


const per_page = 10;
export default function MovieContainer() {
    const [page, setPage] = useState<number>(1);
    const {data, isLoading, isError} = useMovie(per_page,page);
    const lastPage = data?.data.pagination.last_page || 1;
    // console.log(data);
    
    if (isError)
        return toast.error("Đã có lỗi xảy ra khi tải danh sách phim.");
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
           <CardTitle>
            <div className="flex items-center justify-between">
              <p>Danh Sách Phim</p>

              <div className="flex items-center gap-3">
                <Button>Thêm Phim</Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (<Spinner className="size-10 mx-auto" /> 
          ):(data && <MovieTable 
            data={data?.data.movies} 
            setPage={setPage}
            lastPage={lastPage}
            currentPage={page}
            />

          )}
          
        </CardContent>
      </Card>
    </div>
  );
}