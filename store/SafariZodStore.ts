import z from "zod";

// Reusable schema: either File or Cloudinary response object
const ImageSchema = z.union([
  z.instanceof(File, { error: "Must be a valid file" }),
  z.object({
    image_public_id: z.string().min(1, { error: "Image public_id is required" }),
    image_url: z.url({ error: "Image URL must be valid" }),
  }),
]);

const hotelSchema = z.object({
  name: z.string().min(1, { error: "Hotel name is required" }),
  url: z.url({ error: "Hotel URL must be a valid URL" }),
  images: z.array(ImageSchema).min(1, { error: "At least one hotel image is required" }),
});

const daySchema = z.object({
  day: z
    .number({ error: "Day must be a number" })
    .int({ error: "Day must be an integer" })
    .min(1, { error: "Day must be at least 1" }),
  title: z.string().min(1, { error: "Day title is required" }),
  details: z.string().min(10, { error: "Day details must be at least 10 characters long" }),
  images: z.array(ImageSchema).min(1, { error: "At least one day image is required" }),
  hotel: hotelSchema,
});

const tagSchema = z.object({
  item: z.string().min(1, { error: "Tag cannot be empty" }),
});

const CostInclusiveSchema = z.object({
  item: z.string().min(1, { error: "Cost inclusive item cannot be empty" }),
});

const CostExclusiveSchema = z.object({
  item: z.string().min(1, { error: "Cost exclusive item cannot be empty" }),
});

export const safariZodStore = z.object({
  title: z.string().min(3, { error: "Itinerary title must be at least 3 characters long" }),
  overview: z.string().min(20, { error: "Overview must be at least 20 characters long" }),

  itineraryImages: z.array(ImageSchema).min(1, { error: "At least one image is required" }),

  duration: z
    .number({ error: "Duration must be a number" })
    .int({ error: "Duration must be an integer" })
    .min(1, { error: "Duration must be at least 1 day" }),

  price: z
    .number({ error: "Price must be a number" })
    .int({ error: "Price must be an integer" })
    .min(0, { error: "Price cannot be negative" }),

  arrivalCity: z.string().min(1, { error: "Arrival city is required" }),
  departureCity: z.string().min(1, { error: "Departure city is required" }),
  accommodation: z.string().min(1, { error: "Accommodation is required" }),
  location: z.string().min(1, { error: "Location is required" }),

  discount: z
    .number({ error: "Discount must be a number" })
    .int({ error: "Discount must be an integer" })
    .min(0, { error: "Discount cannot be negative" }),

  costInclusive: z.array(CostInclusiveSchema).min(1, { error: "At least one cost inclusive item is required" }),
  costExclusive: z.array(CostExclusiveSchema).min(1, { error: "At least one cost exclusive item is required" }),

  map: ImageSchema, // ✅ now accepts File or Cloudinary object
  days: z.array(daySchema).min(1, { error: "At least one itinerary day is required" }),
  tags: z.array(tagSchema).min(1, { error: "At least one tag is required" }),
});

export type safariTs = z.infer<typeof safariZodStore>;