import z from 'zod';

export default {
  signUp: {
    body: z.object({
      nickname: z.string(),
      email: z.string().email(),
      password: z
        .string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])/)
        .max(32)
        .min(6),
    }),
    response: {
      201: z.object({
        status: z.string(),
      }),
    },
  },
  signIn: {
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
    response: {
      201: z.object({
        status: z.string(),
      }),
    },
  },
  refresh: {
    response: {
      201: z.object({
        status: z.string(),
      }),
    },
  },
};
