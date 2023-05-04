import type z from 'zod';
import type { FastifyInstance } from 'fastify';

import type schemas from './users.schema.js';
import type { IUser } from '../../lib/db/index.js';

type CreateBody = z.infer<typeof schemas.POST.body>;

class Service {
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
  }

  async create(data: CreateBody) {
    const {
      models: { Users },
    } = this.app;
    return Users.create(data);
  }

  async get() {
    const {
      models: { Users },
    } = this.app;
    return Users.read<IUser[]>()
      .select('*')
      .then(users => users.map(({ password, ...safeData }) => safeData));
  }
}

export default Service;
