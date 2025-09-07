import z from "zod";

const imageSchema = z.object({
    file: z.instanceof(File)
})

export const blogSchema = z.object({
    title: z.string().min(1, { error: "Title is required" }),
    content: z.string().min(1, { error: "Content is required" }),
    image: imageSchema
})

export type TsBlog = z.infer<typeof blogSchema>
