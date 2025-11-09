import { Skeleton } from "@/components/ui/skeleton";

interface CinemaDetailProps {
  id: number;
  name: string;
  address: string;
  phone: string;
  created_at: string;
  updated_at: string | null;
  rooms: {
    id: number;
    cinema_id: number;
    name: string;
  }[];
}

interface Props {
  cinemaDetail: CinemaDetailProps;
  isLoading?: boolean;
}

export default function CinemaDetail({ cinemaDetail, isLoading }: Props) {
  if (isLoading) {
    return Array(5)
      .fill(undefined)
      .map((_, index) => <Skeleton key={index} className="h-6 mb-2" />);
  }

  if (!cinemaDetail) {
    return <div>Không có dữ liệu rạp chiếu phim.</div>;
  }

  return (
    <div>
      <ul>
        <li>ID: {cinemaDetail.id}</li>
        <li>Name: {cinemaDetail.name}</li>
        <li>Address: {cinemaDetail.address}</li>
        <li>Phone: {cinemaDetail.phone}</li>
        <li>Created At: {cinemaDetail.created_at}</li>
        <li>Updated At: {cinemaDetail.updated_at}</li>
        <li>
          Rooms:
          <ul>
            {cinemaDetail.rooms.map((room) => (
              <li key={room.id}>{room.name}</li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}
