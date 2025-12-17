export interface GenreResInterface {
     success: boolean;
    data: {
        id: number;
        name: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
    }[];
}

export interface GenreCreateReqInterface {
  name: string;
}

export interface GenreUpdateResInterface {
    success: boolean;
    message: string;
    data: {
        id: number;
        name: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
}
}