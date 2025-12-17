export interface DiscountResInterface {
     success: boolean;
    data: {
        id: number;
        code: string;
        type: string;
        discount_percent: null;
        discount_amount: number;
        max_discount_amount: number;
        usage_limit: number;
        used_count: number;
        remaining: number;
        movie_id: number;
        apply_for_all_movies: boolean;
        min_order_amount: number;
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
    type: "money" | "percent";
    discount_percent: number | undefined;
    discount_amount: number | undefined;
    max_discount_amount: number | undefined;
    usage_limit: number;
    movie_id: number;
    min_order_amount: number;
    start_date: string;
    end_date: string;
}


export interface DiscountUpdateReqInterface {
  code: string;
    type: string;
    discount_percent: number | undefined;
    discount_amount: number | undefined;
    max_discount_amount: number | undefined;
    usage_limit: number;
    movie_id: number | null;
    min_order_amount: number;
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
        type: string;
        discount_percent: number;
        discount_amount: number;
        max_discount_amount: number;
        usage_limit: number;
        used_count: number;
        remaining: number;
        movie_id: null;
        apply_for_all_movies: boolean;
        min_order_amount: number;
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

export interface DiscountDisableResInterface {
  success: boolean;
  message: string;
}







  