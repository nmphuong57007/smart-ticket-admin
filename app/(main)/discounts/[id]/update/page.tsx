import DiscountUpdateContainer from "@/modules/discount/update/discount-update-container";
export default function DiscountPage({ params }: { params: { id: string } }) {
  return <DiscountUpdateContainer id={params.id} />;
}