import RoomUpdateContainer from "@/modules/room/update/room-update-container";

export default function RoomPage({ params }: { params: { id: string } }) {
  return <RoomUpdateContainer id={params.id} />;
}

