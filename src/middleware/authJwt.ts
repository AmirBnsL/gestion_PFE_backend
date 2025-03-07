

import jwt from "jsonwebtoken"
import { createPrivateKey } from 'node:crypto';
import { User } from '../entities/User';



interface jwtHeader {
  alg: string;
  typ: string;
}

interface jwtPayload {
  sub: string;
  role:string;
  iat:number;
}


export const signJwt = (user: User) => {
  if (!process.env['PRIVATE_KEY']) {
    throw new Error('PRIVATE_KEY is not set');
  }

  const secret = process.env['PRIVATE_KEY'];

  const options: jwt.SignOptions = {
    algorithm: 'HS256',
    expiresIn: '15d',
  };

  const payload: jwtPayload = {
    sub: user.id.toString(),
    role: user.role,
    iat: Math.floor(Date.now() / 1000), // Use seconds since epoch
  };

  return  jwt.sign(payload, secret, options);
};