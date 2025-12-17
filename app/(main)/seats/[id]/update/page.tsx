import GenreUpdateContainer from "@/modules/genre/update/genre-update-container";

export default function GenrePage({ params }: { params: { id: string } }) {
  return <GenreUpdateContainer id={params.id} />;
}