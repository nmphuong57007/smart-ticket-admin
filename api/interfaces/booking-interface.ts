export interface BookingItem {
  id: number;
  booking_code: string;
  email: string;
  movie_title: string;
  cinema: string;
  booking_date: string;
  payment_method: string;
  transaction_code: string;
  total_amount: number;
}

export interface BookingResInterface {
  success: boolean;
  data: BookingItem[];
}



export interface BookingDetailResInterface {
  success: boolean;
    data: {
        id: number;
        booking_code: string;
        payment_status: string;
        transaction_code: string;
        payment_method: string;
        final_amount: number;
        created_at: string;
        user: {
            fullname: string;
            email: string;
            phone: string;
        };
        movie: {
            id: number;
            title: string;
            duration: number;
            poster: string;
        };
        showtime: {
            id: number;
            time: string;
            type: null;
        };
        cinema: {
            id: number;
            name: string;
        };
        room: {
            id: number;
            name: string;
        };
        seats: {
            seat_code: string;
            qr_code: string;
        }[];
        products: {
            name: string;
            quantity: number;
        }[];
    };
}

// export interface MovieCreateReqInterface {
//    id: number;
//     title: string;
//     poster: string;
//     trailer: string;
//     description: string;
//     duration: string;
//     format: string;
//     language: string;
//     release_date: string;
//     end_date: string;
//     status: string;
//     created_at: string;
//     updated_at: string;
//     genres: {
//         id: number;
//         name: string;
//     }[];
// }

// export interface MovieUpdateResInterface {
//    success: boolean;
//     message: string;
//     data: {
//         id: number;
//         title: string;
//         poster: string;
//         trailer: string;
//         description: string;
//         duration: number;
//         format: string;
//         language: string;
//         release_date: string;
//         end_date: null;
//         status: string;
//         created_at: string;
//         updated_at: string;
//         genres: {
//             id: number;
//             name: string;
//         }[];
//     };
// }


// export interface MovieStaticReqInterface {
//    success: boolean;
//     message: string;
//     data: {
//         overview: {
//             total_movies: number;
//             showing_movies: number;
//             coming_movies: number;
//             stopped_movies: number;
//         };
//         percentages: {
//             showing: number;
//             coming: number;
//             stopped: number;
//         };
//         by_genre: {
//             [genreName: string]: number;
//         };
//         recent_movies: {
//             id: number;
//             title: string;
//             poster: string;
//             trailer: string;
//             description: string;
//             duration: number;
//             format: string;
//             language: string;
//             release_date: string;
//             end_date: string | null;
//             status: string;
//             created_at: string;
//             updated_at: string
//             ;
//             genres: {
//                 id: number
//                 name: string
//                 ;
//             }[];
//         }[];
//     };
// }

export interface BookingDeleteResInterface{
   success: boolean;
    message: string;
}


 

