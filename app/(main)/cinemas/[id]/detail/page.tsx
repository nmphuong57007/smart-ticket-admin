import CinemaDetailContainer from "@/modules/cinema/detail/cinema-detail-container";

export interface CinemaDetailPageProps {
  params: {
    id: string;
  };
}

export default function CinemaDetailPage({ params }: CinemaDetailPageProps) {
  return <CinemaDetailContainer id={params.id} />;
}
