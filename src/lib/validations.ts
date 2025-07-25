import { z } from "zod";

// Input validation schemas
export const topUpFormSchema = z.object({
  uid: z.string()
    .min(6, "UID must be at least 6 characters")
    .max(20, "UID must be less than 20 characters")
    .regex(/^[0-9]+$/, "UID must contain only numbers"),
  ign: z.string()
    .min(3, "IGN must be at least 3 characters")
    .max(20, "IGN must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "IGN can only contain letters, numbers, and underscores"),
  paymentMethod: z.enum(["eSewa", "Khalti", "IME Pay"], {
    message: "Please select a valid payment method"
  }),
  transactionId: z.string()
    .optional()
    .refine((val) => !val || val.length >= 3, "Transaction ID must be at least 3 characters"),
  notes: z.string()
    .max(500, "Notes must be less than 500 characters")
    .optional()
});

export const adminLoginSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters")
});

// File validation
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, and WebP images are allowed" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 5MB" };
  }

  return { valid: true };
};

// Input sanitization
export const sanitizeString = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .trim();
};