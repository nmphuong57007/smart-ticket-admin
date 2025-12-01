export interface BannerResInterface {
 success: boolean;
    message: string;
    data: {
        items: {
            id: number;
            type: string;
            title: string;
            short_description: string;
            description: string;
            slug: string;
            image: string;
            is_published: boolean;
            published_at: string;
            created_by: number;
            created_by_name: string;
            created_at: string;
            updated_at: string;
        }[];
        pagination: {
            page: number;
            per_page: number;
            total: number;
            last_page: number;
        };
    };
}

export interface BannerUpdateReqInterface {
  title: string;
  image: string;
  is_published: boolean;
  published_at: string;
}

export interface BannerUpdateResInterface {
     success: boolean;
    message: string;
    data: {
        id: number;
        type: string;
        title: string;
        short_description: string;
        description: string;
        slug: string;
        image: string;
        is_published: boolean;
        published_at: string;
        created_by: number;
        created_by_name: string;
        created_at: string;
        updated_at: string;
    };
}

export interface BannerCreateReqInterface {
        type: string;
        title: string;
        image: string;
        is_published: boolean;
        published_at: string;    
}

export interface BannerDeleteResInterface{
   success: boolean;
    message: string;
}



