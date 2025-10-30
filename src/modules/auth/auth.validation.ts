import z from 'zod';
import UserModel from '../user/user.model';

export const registerSchema = z.object({
  body: z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.email(),
    password: z.string().min(6),
    phone: z.string().min(6).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6),
  }),
});

export const updateMeSchema = z.object({
  body: z
    .object({
      first_name: z.string().min(1).optional(),
      last_name: z.string().min(1).optional(),
      phone: z.string().min(6).optional(),
      avatar: z.url().optional().or(z.string().min(1).optional()),
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

// Valid user fields that can be requested
// const validUserFields = [
//   '_id',
//   'first_name',
//   'last_name',
//   'email',
//   'phone',
//   'avatar',
//   'role',
//   'is_active',
//   'last_login',
//   'createdAt',
//   'updatedAt',
// ];

const validUserFields = Object.keys(UserModel.schema.paths);

export const getMeSchema = z.object({
  query: z.object({
    fields: z
      .string()
      .optional()
      .refine(
        (fields) => {
          if (!fields) return true;
          const requestedFields = fields
            .split(',')
            .map((f: string) => f.trim());
          const invalidFields = requestedFields.filter(
            (field: string) => !validUserFields.includes(field),
          );
          return invalidFields.length === 0;
        },
        {
          message: `Invalid field(s) requested. Valid fields are: ${validUserFields.join(', ')}`,
        },
      ),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>;
