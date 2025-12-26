import z from 'zod';
import UserModel from '../user/user.model';

export const registerSchema = z.object({
  body: z.object({
    first_name: z
      .string({
        error: (iss) => {
          if (!iss?.input) {
            return 'First name is required';
          } else if (iss?.code === 'invalid_type') {
            return 'First name must be a string';
          }
        },
      })
      .min(2, 'First name must be two or more characters long'),
    last_name: z
      .string({
        error: (iss) => {
          if (!iss?.input) {
            return 'Last name is required';
          } else if (iss?.code === 'invalid_type') {
            return 'Last name must be a string';
          }
        },
      })
      .min(1, 'Last name must be one or more characters long'),
    email: z.email({
      error: (iss) => {
        if (!iss?.input) {
          return 'Email is required';
        } else if (iss?.code === 'invalid_type') {
          return 'Email must be a string';
        } else if (iss?.code === 'invalid_format') {
          return 'Please provide a valid email address';
        }
      },
    }),
    password: z
      .string({
        error: (iss) => {
          if (!iss?.input) {
            return 'Password is required';
          } else if (iss?.code === 'invalid_type') {
            return 'Password must be a string';
          }
        },
      })
      .min(6, 'Password must be at least 6 characters long'),
    phone: z
      .string({
        error: (iss) => {
          if (iss?.input && iss?.code === 'invalid_type') {
            return 'Phone must be a string';
          }
        },
      })
      .min(10, 'Phone number must be at least 10 characters long')
      .optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email({
      error: (iss) => {
        if (!iss?.input) {
          return 'Email is required';
        } else if (iss?.code === 'invalid_type') {
          return 'Email must be a string';
        } else if (iss?.code === 'invalid_format') {
          return 'Please provide a valid email address';
        }
      },
    }),
    password: z
      .string({
        error: (iss) => {
          if (!iss?.input) {
            return 'Password is required';
          } else if (iss?.code === 'invalid_type') {
            return 'Password must be a string';
          }
        },
      })
      .min(6, 'Password must be at least 6 characters long'),
  }),
});

export const updateMeSchema = z.object({
  body: z
    .object({
      first_name: z
        .string({
          error: (iss) => {
            if (iss?.input && iss?.code === 'invalid_type') {
              return 'First name must be a string';
            }
          },
        })
        .min(1)
        .optional(),
      last_name: z
        .string({
          error: (iss) => {
            if (iss?.input && iss?.code === 'invalid_type') {
              return 'Last name must be a string';
            }
          },
        })
        .min(1)
        .optional(),
      phone: z
        .string({
          error: (iss) => {
            if (iss?.input && iss?.code === 'invalid_type') {
              return 'Phone must be a string';
            }
          },
        })
        .min(10)
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export const changeMyPasswordSchema = z.object({
  body: z.object({
    old_password: z
      .string({
        error: (iss) => {
          if (!iss?.input) {
            return 'Old password is required';
          } else if (iss?.code === 'invalid_type') {
            return 'Old password must be a string';
          }
        },
      })
      .min(6, 'Old password must be at least 6 characters long'),
    new_password: z
      .string({
        error: (iss) => {
          if (!iss?.input) {
            return 'New password is required';
          } else if (iss?.code === 'invalid_type') {
            return 'New password must be a string';
          }
        },
      })
      .min(6, 'New password must be at least 6 characters long'),
  }),
});

// export const refreshTokenSchema = z.object({
//   body: z.object({
//     refresh_token: z
//       .string({
//         error: (iss) => {
//           if (!iss?.input) {
//             return 'Refresh token is required';
//           } else if (iss?.code === 'invalid_type') {
//             return 'Refresh token must be a string';
//           }
//         },
//       })
//       .min(1, 'Refresh token cannot be empty'),
//   }),
// });

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
