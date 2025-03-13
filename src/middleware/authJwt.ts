import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { StatusCodes } from 'http-status-codes';
import * as fs from 'node:fs';



const private_key = fs.readFileSync('private.pem', 'utf8');
const public_key = fs.readFileSync('public.pem', 'utf8');


interface jwtPayload {
  sub: string;
  role: string;
  iat: number;
}

interface JwtRequestHeader extends Headers {
  authorization: string;

}

interface JwtRequest extends Request {
  user: jwtPayload;
  headers: JwtRequestHeader;
}


export const signJwt = (user: User) => {
  if (!private_key) {
    throw new Error('PRIVATE_KEY is not set');
  }
  debugger
  console.log(user);

  const options: jwt.SignOptions = {
    algorithm: 'RS256',
    expiresIn: '15d',
  };

  const payload: jwtPayload = {
    sub: user.id.toString(),
    role: user.role,
    iat: Math.floor(Date.now() / 1000), // Use seconds since epoch
  };

  return jwt.sign(payload, private_key, options);
};

const verifyJwt = (token: string) => {
  if (!public_key) {
    throw new Error('PUBLIC_KEY is not set');
  }
  return jwt.verify(token, public_key) as jwtPayload;
};


export const jwtFilter = (req: JwtRequest, res: any, next: any) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).send({ data: 'Unauthorized' });
  }
  const [bearer, tokenValue] = token.split(' ');
  try {
    req.user = verifyJwt(tokenValue);
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).send({ data: error });
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
