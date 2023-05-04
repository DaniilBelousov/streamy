import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

import { hashConfig } from './config.js';

const serializeHash = (hash: Buffer, salt: Buffer) => {
  const {
    scryptParams: { N, r, p, maxmem },
  } = hashConfig;
  const saltString = salt.toString('base64').split('=')[0];
  const hashString = hash.toString('base64').split('=')[0];
  const scryptPrefix = `$scrypt$N=${N},r=${r},p=${p},maxmem=${maxmem}$`;
  return `${scryptPrefix}${saltString}$${hashString}`;
};

const parseOptions = (options: string) => {
  const values: [string, number][] = [];
  const items = options.split(',');
  for (const item of items) {
    const [key = '', val] = item.split('=');
    values.push([key, Number(val)]);
  }
  return Object.fromEntries<number>(values);
};

const deserializeHash = (phcString: string) => {
  const [, alg, options = '', salt64 = '', hash64 = ''] = phcString.split('$');
  if (alg !== 'scrypt') {
    throw new Error('Only scrypt supported');
  }
  const params = parseOptions(options);
  const salt = Buffer.from(salt64, 'base64');
  const hash = Buffer.from(hash64, 'base64');
  return { params, salt, hash };
};

export const hashPassword = (password: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const { saltLen, keyLen, scryptParams } = hashConfig;
    randomBytes(saltLen, (err, salt) => {
      if (err) {
        reject(err);
        return;
      }
      scrypt(password, salt, keyLen, scryptParams, (err, hash) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(serializeHash(hash, salt));
      });
    });
  });

export const validatePassword = (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const { params, salt, hash } = deserializeHash(hashedPassword);
  return new Promise((resolve, reject) =>
    scrypt(password, salt, hash.length, params, (err, hashedPassword) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(timingSafeEqual(hashedPassword, hash));
    }),
  );
};
