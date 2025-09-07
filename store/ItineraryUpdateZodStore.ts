import z from "zod";

// Updated schemas to match JSON structure
const imagesSchema = z.object({
    id: z.string(),
    image_url: z.string().url({ message: "Must be a valid URL" })
})

const daysSchema = z.object({
    id: z.string(),
    day_number: z.coerce.number().int().positive({ message: "Day number must be a positive integer" }),
    title: z.string().min(1, { message: "Day name is required" }),
    details: z.string().min(1, { message: "Day details are required" }),
    images: z.array(imagesSchema).optional().default([])
})

export const itineraryUpdateSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: "Title is required"}).optional(),
    overview: z.string().min(1, { message: "The overview is required" }).optional(),
    duration: z.coerce.number().int().positive({ message: "Duration must be a positive number" }).optional(),
    price: z.coerce.number().int().positive({ message: "Price must be a positive number" }).optional(),
    discount: z.coerce.number().min(0, { message: "The discount cannot be negative" }).optional(),
    arrivalCity: z.string().min(1, { message: "The arrival city is required" }).optional(),
    departureCity: z.string().min(1, { message: "The departure city is required" }).optional(),
    images: z.array(imagesSchema).optional(),
    tags: z.string().min(1, { message: "Tags are required" }).optional(),
    accommodation: z.string().min(1, { message: "Accommodation type is required" }).optional(),
    location: z.string().min(1, { message: "Location is required" }).optional(),
    days: z.array(daysSchema).optional(),
    costInclusive: z.array(z.string()).optional(),
    costExclusive: z.array(z.string()).optional(),
})

export type TsItineraryUpdate = z.infer<typeof itineraryUpdateSchema>