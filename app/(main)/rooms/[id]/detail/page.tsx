import RoomDetailContainer from "@/modules/room/detail/room-detail-container";

interface RoomDetailProps {
  params: {
    id: string;
  };
}

export default function RoomDetail({ params }: RoomDetailProps) {
  return <RoomDetailContainer id={params.id} />;
}
