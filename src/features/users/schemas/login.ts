import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email addresss"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*()_\-+={[}\]|\\:;"'<>,.?/~`]/,
      "Password must contain at least one special character"
    ),
});
