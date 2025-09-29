// Blog Interfaces
export type BlogSections = {
  title: string
  content: string
  image_url: string
}

export type Blogs = {
  id: string
  title: string
  content: string
  author: string
  image_url: string
  sections: BlogSections[]
  created_at: string
}

export type BlogList = {
  blogs: Blogs[]
  total: number
  pages: number
  current_page: number
  page_size: number
}


// Itinerary Interfaces
export type ItineraryProp = {
  id: string
  title: string
  overview: string
  duration: number
  price: number
  map: MapProp
  images: ImagesProp[]
  arrival_city: string
  departure_city: string
  days: DaysProp[]
  accommodation: string
  location: string
  discount: number
  tags: ItemProp[]
  cost_inclusive: ItemProp[]
  cost_exclusive: ItemProp[]
}

export type MapProp = {
  image_url: string
  image_public_id: string
}

export type ImageProp = {
  url: string
  public_id: string
}

export type ItemProp = {
  item: string
}

export type ImagesProp = {
  image: ImageProp
}

export type DaysProp = {
  day_number: number
  title: string
  details: string
  images: ImagesProp[]
  hotel_detail: HotelProp
}

export type HotelProp = {
  name: string
  url: string
  images: ImagesProp[]
}

export type ListItineraryProp = {
  itineraries: ItineraryProp[]
  total: number
  pages: number
  current_page: number
  page_size: number
}