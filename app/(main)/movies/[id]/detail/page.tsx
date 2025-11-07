
import MovieDetailPageProps from "@/modules/movie/detail/movie-detail-container";
export interface MovieDetailPageProps {
  params: {
    id: string;
  };
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  return <MovieDetailPageProps params={params} />;
}
