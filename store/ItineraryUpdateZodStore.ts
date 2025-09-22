// Import the fixed schema from below or update your existing one
import { z } from "zod";

const UpdateTagSchema = z.object({
  name: z.string().min(1).max(50),
});

export const UpdateItinerarySchema = z.object({
  title: z.string().min(1).optional(),
  duration: z.number().int().positive().optional(),
  overview: z.string().min(10).optional(),
  price: z.number().nonnegative().optional(),
  tags: z.array(UpdateTagSchema).optional(),
  arrival_city: z.string().min(1).optional(),
  departure_city: z.string().min(1).optional(),
  accommodation: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  discount: z.number().nonnegative().max(100).optional(),
  cost_inclusive: z.array(z.string()).optional(),
  cost_exclusive: z.array(z.string()).optional(),
});

export type UpdateItinerary = z.infer<typeof UpdateItinerarySchema>;