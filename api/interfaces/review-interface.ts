export interface ReviewResInterface{
     success: boolean;
    data: {
        id: number;
        user_id: number;
        movie_id: number;
        rating: number;
        comment: string;
        status: string;
        created_at: string;
        updated_at: string;
        user: {
            id: number;
            fullname: string;
        };
        movie: {
            id: number;
            title: string;
        };
    }[];
}

export interface ReviewDeleteResInterface{
    success: boolean;
    message: string;
}

export interface ApproveReviewResInterface{
    success: boolean;
    message: string;
}
