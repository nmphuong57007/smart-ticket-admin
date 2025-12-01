import PostUpdateContainer from "@/modules/post/update/post-update-container";

export default function RoomPage({ params }: { params: { id: string } }) {
  return <PostUpdateContainer id={params.id} />;
}
