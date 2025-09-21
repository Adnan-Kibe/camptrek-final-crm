import z from "zod";

const imagesSchema = z.object({
    file: z.instanceof(File)
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), {message: "Only JPEG, PNG, and WebP files are allowed"})
})

const costIncludedSchema = z.object({
    item: z.string().min(1, { message: "Item cannot be empty" })
})

const costExcludedSchema = z.object({
    item: z.string().min(1, { message: "Item cannot be empty" })
})

const tagsSchema = z.object({
    name : z.string().min(1, { message: "Tag cannot be empty" })
})

const accommodationSchema = z.enum(["Budget", "Mid", "Luxury"])


const daysSchema = z.object({
    day: z.coerce.number().int().positive({ message: "Day number must be a positive integer" }),
    title: z.string().min(1, { message: "Day name is required" }),
    details: z.string().min(1, { message: "Day details are required" }),
    images: z.array(imagesSchema).optional().default([])
})

export const itinerarySchema = z.object({
    title: z.string().min(1, { error: "Title is required"}),
    overview: z.string().min(1, { error: "The overview is required" }),
    duration: z.coerce.number().int().positive({ message: "Duration must be a positive number" }),
    price: z.coerce.number().int().positive({ message: "Price must be a positive number" }),
    discount: z.coerce.number().min(0, { message: "The discount cannot be negative" }),
    arrivalCity: z.string().min(1, { error: "The arrival city is required" }),
    departureCity: z.string().min(1, { error: "The departure cirty is required" }),
    images: z.array(imagesSchema).min(1, { error: "Requires at least one image" }),
    tags: z.array(tagsSchema).min(1, { message: "At least one tag is required" }),
    accommodation: accommodationSchema,
    location: z.string().min(1, { error: "Location is required" }),
    days: z.array(daysSchema).min(1, { message: "There should be at least one day added" }),
    costIncluded: z.array(costIncludedSchema).optional().default([]),
    costExcluded: z.array(costExcludedSchema).optional().default([]),
})

export type TsItinerarySchema = z.infer<typeof itinerarySchema>