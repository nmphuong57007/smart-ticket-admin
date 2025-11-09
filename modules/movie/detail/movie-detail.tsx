import moment from "moment";

import { Skeleton } from "@/components/ui/skeleton";

interface MovieDataProps {
  id: number;
  title: string;
  poster: string;
  trailer: string;
  description: string;
  genre: string;
  duration: number;
  format: string;
  language: string;
  release_date: string;
  end_date: null;
  status: string;
  created_at: string;
  updated_at: string;
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

  return (
    <div>
      <ul>
        <li>Title: {movie.title}</li>
        <li>Poster: {movie.poster}</li>
        <li>Trailer: {movie.trailer}</li>
        <li>Description: {movie.description}</li>
        <li>Genre: {movie.genre}</li>
        <li>Duration: {movie.duration}</li>
        <li>Format: {movie.format}</li>
        <li>Language: {movie.language}</li>
        <li>Release Date: {movie.release_date}</li>
        <li>End Date: {movie.end_date}</li>
        <li>Status: {movie.status}</li>
        <li>Created At: {moment(movie.created_at).format("DD/MM/YYYY")}</li>
        <li>Updated At: {moment(movie.updated_at).format("DD/MM/YYYY")}</li>
      </ul>
    </div>
  );
}
