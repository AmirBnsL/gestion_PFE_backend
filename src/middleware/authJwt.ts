import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../entities/User';
import { StatusCodes } from 'http-status-codes';
import * as fs from 'node:fs';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'node:http2';
import { AppDataSource } from '../configs/datasource';
import { Socket } from 'socket.io';
import { S } from '@faker-js/faker/dist/airline-CBNP41sR';
import { WebSocket } from 'socket.io-client';

const private_key = fs.readFileSync('private.pem', 'utf8');
const public_key = fs.readFileSync('public.pem', 'utf8');

interface jwtPayload {
  sub: string;
  role: string;
  iat: number;
}

interface JwtRequestHeader extends IncomingHttpHeaders {
  authorization?: string;
}

export interface JwtRequest<P = any, B = any, Q = any>
  extends Request<P, any, B, Q> {
  user: User;
  headers: JwtRequestHeader;
}

export const signJwt = (user: User) => {
  console.log(user);

  const options: jwt.SignOptions = {
    algorithm: 'RS256',
    expiresIn: '15d',
  };

  const payload: jwtPayload = {
    sub: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000), // Use seconds since epoch
  };

  return jwt.sign(payload, private_key, options);
};

const verifyJwt = (token: string) => {
  if (!public_key) {
    throw new Error('PUBLIC_KEY is not set');
  }
  try {
    return jwt.verify(token, public_key) as jwtPayload;
  } catch (error) {
    console.log(error);
    throw new Error('Invalid token');
  }
};
export const jwtFilter = (req: JwtRequest, next: any) => {
  return createJwtHandler({ req }, next);
};

export const createJwtHandler = async (
  context: { req?: JwtRequest; socket?: any },
  next: any,
) => {
  const token =
    context.req?.headers.authorization ||
    context.socket.handshake.headers.authorization;
  const userRepository = AppDataSource.getRepository(User);
  console.log('Token:', token);
  if (!token) {
    return context.req
      ? context.req.res
          ?.status(StatusCodes.UNAUTHORIZED)
          .send({ data: 'Unauthorized' })
      : context.socket?.disconnect(true);
  }

  const [bearer, tokenValue] = token.split(' ');
  try {
    const email = verifyJwt(tokenValue).sub;

    const user = await userRepository.findOneOrFail({
      where: { email: email },
      relations: {
        teacher: true,
        student: true,
        admin: true,
      },
    });
    console.log('User:', user);

    if (context.req) {
      context.req.user = user;
    } else if (context.socket) {
      context.socket.user = user;
      console.log('Socket user:', context.socket.user);
    }

    next();
  } catch (error) {
    return context.req
      ? context.req.res?.status(401).send({ data: error })
      : context.socket?.disconnect(true);
  }
};

export const authorizeRoles = (role: string[]) => {
  return (req: JwtRequest, res: any, next: any) => {
    if (role.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).send({ data: 'Forbidden by role' });
    }
  };
};
