export interface PostResInterface {
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
            unpublished_at: string;
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

export interface PostCreateReqInterface {
         type: string;
        title: string;
        short_description: string;
        description: string;
        image: string;
        is_published: boolean;
        published_at: string;
        unpublished_at: string;     
}

export interface PostUpdateReqInterface {
        type: string;
        title: string;
        short_description: string;
        description: string;
        image: string;
        is_published: boolean;
        published_at: string;
        unpublished_at: string;  
}

export interface PostUpdateResInterface {
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
        unpublished_at: string;
        created_by: number;
        created_by_name: string;
        created_at: string;
        updated_at: string;
    };
}

export interface PostDetailResInterface {
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
    unpublished_at: string;
    created_by: number;
    created_by_name: string;
    created_at: string;
    updated_at: string;
  };
}

export interface PostDeleteResInterface {
  success: boolean;
  message: string;
}