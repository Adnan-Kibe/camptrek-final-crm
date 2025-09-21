// update-itinerary.schema.ts
import { z } from "zod";

/**
 * Basic image object for update
 */
const UpdateImageSchema = z.object({
  id: z.uuid(),
  image_url: z.url(),
}).partial({
  image_url: true, // allow updating just the url
});

/**
 * A single day in the itinerary (update version)
 */
const UpdateDaySchema = z.object({
  id: z.uuid(),
  day_number: z.number().int().nonnegative().optional(),
  title: z.string().optional(),
  details: z.string().optional(),
  images: z.array(UpdateImageSchema).optional(),
});

/**
 * Update itinerary schema
 */
export const UpdateItinerarySchema = z.object({
  title: z.string().optional(),
  duration: z.number().int().positive().optional(),
  overview: z.string().optional(),
  images: z.array(UpdateImageSchema).optional(),
  days: z.array(UpdateDaySchema).optional(),
  price: z.number().nonnegative().optional(),
  tags: z.string().optional(),
  arrival_city: z.string().optional(),
  departure_city: z.string().optional(),
  accommodation: z.string().optional(),
  location: z.string().optional(),
  discount: z.number().nonnegative().optional(),
  cost_inclusive: z.array(z.string()).optional(),
  cost_exclusive: z.array(z.string()).optional(),
});

export type UpdateItinerary = z.infer<typeof UpdateItinerarySchema>;
