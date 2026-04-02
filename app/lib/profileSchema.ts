import { z } from "zod";

export const preferredWorkTypeSchema = z.enum(["onsite", "remote", "hybrid"]);

export const profileSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters."),
  email: z.string().trim().email("Please enter a valid email address."),
  targetRole: z.string().trim().min(1, "Target role is required."),
  yearsOfExperience: z
    .number()
    .min(0, "Years of experience must be at least 0.")
    .max(40, "Years of experience must be at most 40."),
  skills: z.array(z.string()).min(1, "Select at least 1 skill."),
  shortBio: z
    .string()
    .trim()
    .max(255, "Short bio must be at most 255 characters.")
    .optional()
    .or(z.literal("")),
  area: z.string().trim().min(1, "Area is required."),
  address: z
    .string()
    .trim()
    .max(100, "Address must be at most 100 characters.")
    .optional()
    .or(z.literal("")),
  preferredWorkType: z
    .string()
    .min(1, "Preferred work type is required.")
    .refine(
      (v): v is z.infer<typeof preferredWorkTypeSchema> =>
        v === "onsite" || v === "remote" || v === "hybrid",
      "Preferred work type must be one of: onsite, remote, hybrid."
    ),
});

export type ProfileFormInput = z.input<typeof profileSchema>;
export type ProfileFormValues = z.output<typeof profileSchema>;

