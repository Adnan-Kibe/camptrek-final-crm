import z from "zod";

const ImageSchema = z.union([
  z.instanceof(File, { error: "Must have a image" }),
  z.object({
    image_public_id: z.string().min(1, { error: "Image public_id is required" }),
    image_url: z.url({ error: "Image URL must be valid" }),
  }),
]);

const sectionSchema = z.object({
    title: z.string(),
    content: z.string().min(10, { error: "Content must be at least 10 characters long" }),
    image: ImageSchema
})


export const blogSchema = z.object({
    title: z.string().min(3, { error: "Title is required" }),
    content: z.string().min(10, { error: "Content must be at least 10 characters long" }),
    author: z.string().min(1, { error: "Author Name is required" }),
    image: ImageSchema,
    sections: z.array(sectionSchema).min(1, { error: "1 section is required"})
})

export type TsBlog = z.infer<typeof blogSchema>
