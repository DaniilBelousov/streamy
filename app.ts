import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const filePath = fileURLToPath(import.meta.url);
const __dirname = dirname(filePath);

const app = Fastify({
  logger: {
    level: 'info',
  },
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(autoload, {
  dir: join(__dirname, 'plugins'),
});

app.register(autoload, {
  dir: join(__dirname, 'routes'),
  dirNameRoutePrefix: false,
  ignorePattern: /.*schemas\.js/,
});

app.listen({ port: process.env.PORT || 3000 });
