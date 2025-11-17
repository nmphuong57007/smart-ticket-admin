export interface MovieResInterface {
  success: boolean;
  message: string;
  data: {
    movies: {
      id: number;
      title: string;
      poster: string;
      trailer: string;
      description: string;
      genre: string;
      duration: number;
      format: string;
      language: string;
      release_date: string;
      end_date: null;
      status: string;
      created_at: string;
      updated_at: string;
    }[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
    };
  };
}

export interface MovieDetailResInterface {
  success: boolean;
  data: {
    id: number;
    title: string;
    poster: string;
    trailer: string;
    description: string;
    duration: number;
    format: string;
    language: string;
    release_date: string;
    end_date: null;
    status: string;
    created_at: string;
    updated_at: string;
    genres: {
        id: number;
        name: string;
    }[];
  };
}

export interface MovieCreateReqInterface {
   id: number;
    title: string;
    poster: string;
    trailer: string;
    description: string;
    duration: string;
    format: string;
    language: string;
    release_date: string;
    end_date: string;
    status: string;
    created_at: string;
    updated_at: string;
    genres: {
        id: number;
        name: string;
    }[];
}

export interface MovieUpdateResInterface {
   success: boolean;
    message: string;
    data: {
        id: number;
        title: string;
        poster: string;
        trailer: string;
        description: string;
        duration: number;
        format: string;
        language: string;
        release_date: string;
        end_date: null;
        status: string;
        created_at: string;
        updated_at: string;
        genres: {
            id: number;
            name: string;
        }[];
    };
}


export interface MovieStaticReqInterface {
   success: boolean;
    message: string;
    data: {
        overview: {
            total_movies: number;
            showing_movies: number;
            coming_movies: number;
            stopped_movies: number;
        };
        percentages: {
            showing: number;
            coming: number;
            stopped: number;
        };
        by_genre: {
            [genreName: string]: number;
        };
        recent_movies: {
            id: number;
            title: string;
            poster: string;
            trailer: string;
            description: string;
            duration: number;
            format: string;
            language: string;
            release_date: string;
            end_date: string | null;
            status: string;
            created_at: string;
            updated_at: string
            ;
            genres: {
                id: number
                name: string
                ;
            }[];
        }[];
    };
}

export interface MovieDeleteResInterface{
   success: boolean;
    message: string;
}


 

