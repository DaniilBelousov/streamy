import z from 'zod';

export default {
  GET: {
    querystring: z.object({
      name: z.string().min(4)
    }),
    response: {
      200: z.string()
    }
  }
};
