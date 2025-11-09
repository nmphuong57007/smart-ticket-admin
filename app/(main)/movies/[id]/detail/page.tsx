import MovieDetailContainer from "@/modules/movie/detail/movie-detail-container";

interface MovieDetailProps {
  params: {
    id: string;
  };
}

export default function MovieDetail({ params }: MovieDetailProps) {
  return <MovieDetailContainer id={params.id} />;
}
