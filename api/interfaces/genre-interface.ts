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
