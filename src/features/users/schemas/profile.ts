import z from "zod";

export const profileSchema = z.object({
  name: z.string().min(3, "Please enter a valid name"),
  email: z.email("Please Enter a valid Email"),
  username: z.string().min(3, "Please enter a valid name"),
  bio: z
    .string()
    .max(200, "Bio may only contain a maximum of 200 characters.")
    .optional(),
});

export const fullProfileSchema = profileSchema.extend({
  id: z.string().min(1, "ID is required"),
  image: z.string().optional(),
});
