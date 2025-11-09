import CinemaRoomContainer from "@/modules/cinema/room/cinema-room-container";

interface CinemaRoomProps {
  params: {
    id: string;
  };
}

export default function CinemaRoomPage({ params }: CinemaRoomProps) {
  return <CinemaRoomContainer id={params.id} />;
}
