import ProductDetailContainer from "@/modules/product/detail/product-detail-container";

interface ProductDetailProps {
  params: {
    id: string;
  };
}

export default function ProductDetail({ params }: ProductDetailProps) {
  return <ProductDetailContainer id={params.id} />;
}
