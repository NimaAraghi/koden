import z from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
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
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
