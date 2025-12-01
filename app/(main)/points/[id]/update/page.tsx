import BannerUpdateContainer from "@/modules/banner/update/banner-update-container";
export default function RoomPage({ params }: { params: { id: string } }) {
  return <BannerUpdateContainer id={params.id} />;
}
