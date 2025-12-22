
export const redirectConfig = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  users: "/users",
  cinemas: "/cinemas",
  cinemaDetail: (id: string | number) => `/cinemas/${id}/detail`,
  cinemaRooms: (id: string | number) => `/cinemas/${id}/rooms`,
  cinemaStatic: "/cinemas/static",
  createMovie: "/movies/create",
  movies: "/movies",
  movieDetail: (id: string | number) => `/movies/${id}/detail`,
  movieStatic: "/movies/static",
  movieUpdate: (id: string | number) => `/movies/${id}/update`,
  rooms: "/rooms",
  createRoom: "/rooms/create",
  roomDetail: (id: string | number) => `/rooms/${id}/detail`,
  roomUpdate: (id: string | number) => `/rooms/${id}/update`,
  roomStatic: "/rooms/static",
  seats: "/seats",
  createGenre: "/seats/create",
  genreUpdate: (id: string | number) => `/seats/${id}/update`,
  showtimes: "/showtimes",
  createShowTime: "/showtimes/create",
  showtimeDetail: (id: string | number) => `/showtimes/${id}/detail`,
  showtimeUpdate: (id: string | number) => `/showtimes/${id}/update`,
  showtimeStatic: "/showtimes/static",

  print:  (id: string | number) => `/print/${id}`,

  bookings: "/bookings",
  bookingDetail: (id: string | number) => `/bookings/${id}/detail`,



  comment: "/comment",
  // combos: "/combos",

  products: "/products",
  createProduct: "/products/create",

  productDetail: (id: string | number) => `/products/${id}/detail`,
  productUpdate: (id: string | number) => `/products/${id}/update`,

  discounts: "/discounts",
  createDiscount: "/discounts/create",
  discountUpdate: (id: string | number) => `/discounts/${id}/update`,
  points: "/points",
  pointUpdate: (id: string | number) => `/points/${id}/update`,
  createBanner: "/points/create",
  contentsUpdate: (id: string | number) => `/contents/${id}/update`,
  contents: "/contents",
  createContents: "/contents/create",
  settings: "/settings",
};
