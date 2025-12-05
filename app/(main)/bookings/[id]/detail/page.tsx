import BookingDetailContainer from "@/modules/booking/detail/booking-detail-container";

interface BookingDetailProps {
  params: {
    id: string;
  };
}

export default function BookingDetail({ params }: BookingDetailProps) {
  return <BookingDetailContainer id={params.id} />;
}
