import { Skeleton } from "@/components/ui/skeleton";

interface CinemaRoomData {
  id: number;
  cinema_id: number;
  name: string;
}

interface CinemaRoomProps {
  cinemaRooms: CinemaRoomData[];
  isLoading: boolean;
}

export default function CinemaRoom({
  cinemaRooms,
  isLoading,
}: CinemaRoomProps) {
  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-4" />
      </div>
    );
  }

  return (
    <div>
      {cinemaRooms.map((room) => (
        <div key={room.id} className="p-4 mb-4 border rounded">
          <h3 className="text-lg font-semibold">{room.name}</h3>
          <p className="text-sm text-gray-600">Cinema ID: {room.cinema_id}</p>
        </div>
      ))}
    </div>
  );
}
