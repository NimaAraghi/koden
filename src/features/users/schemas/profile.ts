import z from "zod";

export const profileSchema = z.object({
  name: z.string().min(3, "Please enter a valid name"),
  email: z.email("Please Enter a valid Email"),
});
