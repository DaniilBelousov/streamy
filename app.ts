import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { fileURLToPath } from 'url';
import { join, dirname } from 'node:path';

const filePath = fileURLToPath(import.meta.url);
const __dirname = dirname(filePath);

const app = Fastify({
  logger: {
    level: 'info'
  }
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.withTypeProvider<ZodTypeProvider>().route({
  method: 'GET',
  url: '/',
  schema: {
    querystring: z.object({
      name: z.string().min(4)
    }),
    response: {
      200: z.string()
    }
  },
  handler: (req, res) => {
    res.send(req.query.name);
  }
});

app.register(autoload, {
  dir: join(__dirname, 'routes'),
  dirNameRoutePrefix: false
});

app.listen({ port: process.env.PORT || 3000 });
