import z from 'zod';

export const registerSchema = z.object({
  body: z.object({
    first_name: z.string().min(1).optional(),
    last_name: z.string().min(1).optional(),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().min(6).optional(),
    avatar: z.string().url().optional().or(z.string().min(1).optional()),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const updateMeSchema = z.object({
  body: z
    .object({
      first_name: z.string().min(1).optional(),
      last_name: z.string().min(1).optional(),
      phone: z.string().min(6).optional(),
      avatar: z.string().url().optional().or(z.string().min(1).optional()),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export const changeMyPasswordSchema = z.object({
  body: z.object({
    old_password: z.string().min(6),
    new_password: z.string().min(6),
  }),
});
