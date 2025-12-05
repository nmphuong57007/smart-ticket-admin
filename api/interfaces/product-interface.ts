export interface ProductResInterface {
  success: boolean;
  message: string;
  data: {
    products: {
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
    }[];
    pagination: {
      current_page: number;
      last_page: number;
      total: number;
    };
  };
}
export interface ProductDeleteResInterface {
  success: boolean;
  message: string;
}


export interface ProductDetailResInterface {
  success: boolean;
  message: string;
  data: {
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
  };
}
export interface ProductCreatResInterface {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    type: string;
    price: number;
    description: string;
    stock: string;
    is_active: boolean;
    image: null;
    created_at: string;
    updated_at: string;
  };
}

export interface ProductUpdateResInterface {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    type: string;
    price: number;
    description: string;
    stock: string;
    is_active: boolean;
    image: string;
    created_at: string;
    updated_at: string;
  };
}
interface RengeType {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductCreateFormProps {
  rengeData: RengeType[];
}

export default function ProductCreateForm({ rengeData }: ProductCreateFormProps) {
  console.log(rengeData); // dùng được rồi
}



