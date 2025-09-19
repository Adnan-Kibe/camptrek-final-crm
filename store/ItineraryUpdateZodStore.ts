import z from "zod";

// File upload schema for new images
const fileImageSchema = z.object({
    file: z.instanceof(File)
})

// Existing image schema (from database)
const existingImageSchema = z.object({
    id: z.string(),
    image_url: z.url({ message: "Must be a valid URL" }),
    image_public_id: z.string().optional() // Backend expects this field
})

// Combined image schema
const imageSchema = z.union([fileImageSchema, existingImageSchema])

// Tag schema - should be array of objects with name property
const tagSchema = z.object({
    name: z.string().min(1, { message: "Tag name is required" })
})

// Cost item schema
const costItemSchema = z.object({
    item: z.string().min(1, { message: "Cost item is required" })
})

// Day schema with proper image handling
const daySchema = z.object({
    day: z.coerce.number().int().positive({ message: "Day number must be a positive integer" }),
    title: z.string().min(1, { message: "Day title is required" }),
    details: z.string().min(1, { message: "Day details are required" }),
    images: z.array(imageSchema).optional().default([])
})

export const itineraryUpdateSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }).optional(),
    overview: z.string().min(1, { message: "The overview is required" }).optional(),
    duration: z.coerce.number().int().positive({ message: "Duration must be a positive number" }).optional(),
    price: z.coerce.number().int().positive({ message: "Price must be a positive number" }).optional(),
    discount: z.coerce.number().min(0, { message: "The discount cannot be negative" }).optional(),
    arrivalCity: z.string().min(1, { message: "The arrival city is required" }).optional(),
    departureCity: z.string().min(1, { message: "The departure city is required" }).optional(),
    images: z.array(imageSchema).optional(),
    tags: z.array(tagSchema).optional(), // Changed from string to array
    accommodation: z.string().min(1, { message: "Accommodation type is required" }).optional(),
    location: z.string().min(1, { message: "Location is required" }).optional(),
    days: z.array(daySchema).optional(),
    costInclusive: z.array(costItemSchema).optional(), // Changed to object array
    costExclusive: z.array(costItemSchema).optional(), // Changed to object array
})

export type TsItineraryUpdate = z.infer<typeof itineraryUpdateSchema>