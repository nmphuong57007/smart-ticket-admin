export interface DiscountResInterface {
      success: boolean;
    data: {
        id: number;
        code: string;
        discount_percent: number;
        start_date: string;
        end_date: string;
        status: string;
        status_label: string;
        is_valid: boolean;
        is_expired: boolean;
        created_at: string;
        updated_at: string;
    }[];
    pagination: {
        current_page: number;
        per_page: number;
        last_page: number;
        total: number;
    };
}

export interface DisconutCreateReqInterface {
  code: string;
    discount_percent: string;
    start_date: string;
    end_date: string;
}

export interface DiscountUpdateReqInterface {
  code: string;
  discount_percent: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface DiscountUpdateResInterface {
  success: boolean;
  message: string;
  data: {
    id: number;
    code: string;
    discount_percent: number;
    start_date: string;
    end_date: string;
    status: string;
    status_label: string;
    is_valid: boolean;
    is_expired: boolean;
    created_at: string;
    updated_at: string;
  };
}




  