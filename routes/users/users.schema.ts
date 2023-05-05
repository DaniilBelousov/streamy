import z from 'zod';

export default {
  GET: {
    response: {
      200: z
        .object({
          id: z.string().uuid(),
          email: z.string().email(),
          nickname: z.string(),
          createdAt: z.date(),
          updatedAt: z.date(),
        })
        .array(),
    },
  },
  POST: {
    body: z.object({
      email: z.string().email(),
      password: z.string().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]/),
      nickname: z.string(),
    }),
    response: {
      201: {
        userId: z.string().uuid(),
      },
    },
  },
};
