import ShowTimeDetailContainer from "@/modules/showtime/detail/showtime-detail-container";

interface ShowTimeDetailProps {
  params: {
    id: string;
  };
}

export default function ShowTimeDetail({ params }: ShowTimeDetailProps) {
  return <ShowTimeDetailContainer id={params.id} />;
}
