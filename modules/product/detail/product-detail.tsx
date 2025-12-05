"use client";
import moment from "moment";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LucideClock,
  LucideCalendarArrowUp,
  LucideCalendarCog,
} from "lucide-react";

interface ProductDataProps {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
  stock: number;
  is_active: boolean;
  image: string;
  created_at: string;
  updated_at: string;
}

interface ProductDetailProps {
  product: ProductDataProps;
  isLoading: boolean;
}

export default function ProductDetail({ product, isLoading }: ProductDetailProps) {
  if (isLoading) return <Skeleton className="h-6 w-full" />;

  if (!product) return <div>Không có dữ liệu sản phẩm.</div>;

  return (
<div className="flex flex-col md:flex-row gap-10 p-6">

      {/* ẢNH */}
      <div className="md:w-1/3 flex justify-center">
        <Image
          src={product.image || "https://placehold.co/600x400"}
          alt={product.name}
          width={350}
          height={480}
          quality={90}
          className="rounded-lg shadow-lg object-cover w-[300px] h-[420px]"
          priority
        />
      </div>

      {/* THÔNG TIN */}
      <div className="md:w-2/3 space-y-6">

        {/* Tên sản phẩm */}
        <h1 className="text-3xl font-semibold text-gray-900 tracking-wide">
          {product.name}
        </h1>

        {/* Giá */}
        <div className="flex items-center gap-3 text-lg font-medium text-gray-700">
          <LucideClock className="w-5 h-5 text-gray-600" />
          <span>Giá: </span>
          <span className="text-red-600 font-semibold">{product.price.toLocaleString()}₫</span>
        </div>

        {/* Tóm tắt */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            Tóm tắt nội dung
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Tồn kho */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            Tồn kho
          </h2>
          <p className="text-gray-700">{product.stock}</p>
        </div>

        {/* Thông tin khác */}
        <div className="pt-3 border-t border-gray-200">
          <h2 className="text-xl font-semibold mb-3 text-gray-900">
            Chi tiết khác
          </h2>

          <div className="space-y-3 text-gray-700">
            <div className="flex items-center gap-3">
              <LucideCalendarArrowUp className="w-5 h-5 text-gray-600" />
              <span>
                Ngày tạo: {moment(product.created_at).format("DD/MM/YYYY")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <LucideCalendarCog className="w-5 h-5 text-gray-600" />
              <span>
                Ngày sửa gần nhất:{" "}
                {moment(product.updated_at).format("DD/MM/YYYY")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
