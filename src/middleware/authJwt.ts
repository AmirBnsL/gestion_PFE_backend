import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { StatusCodes } from 'http-status-codes';
import * as fs from 'node:fs';

const private_key = fs.readFileSync('private.pem','utf8');
const public_key = fs.readFileSync('public.pem','utf8');


interface jwtHeader {
  alg: string;
  typ: string;
}

interface jwtPayload {
  sub: string;
  role:string;
  iat:number;
}

interface JwtRequestHeader extends Headers {
  authorization: string;

}

interface JwtRequest extends Request {
  user: jwtPayload;
  headers: JwtRequestHeader;
}


export const signJwt = (user: User) => {
  if (!process.env['PRIVATE_KEY']) {
    throw new Error('PRIVATE_KEY is not set');
  }

  const secret = process.env['PRIVATE_KEY'];
  console.log(private_key)
  const options: jwt.SignOptions = {
    algorithm: 'RS256',
    expiresIn: '15d',
  };

  const payload: jwtPayload = {
    sub: user.id.toString(),
    role: user.role,
    iat: Math.floor(Date.now() / 1000), // Use seconds since epoch
  };

  return  jwt.sign(payload, private_key, options);
};

const verifyJwt = (token: string) => {
  if (!process.env['PUBLIC_KEY']) {
    throw new Error('PUBLIC_KEY is not set');
  }

  const secret = process.env['PUBLIC_KEY'];


  return jwt.verify(token, public_key) as jwtPayload;
}


export const jwtFilter = (req: JwtRequest, res: any, next: any) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).send({ data: 'Unauthorized' });
  }
  const [bearer, tokenValue] = token.split(' ');
  console.log(tokenValue)
  try {
    req.user = verifyJwt(tokenValue);
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).send({ data: error });
  }
}


export const authorizeRoles = (role: string[]) => {
  return (req: JwtRequest, res: any, next: any) => {
    console.log(req.user.role);
    if (role.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).send({ data: 'Forbidden by role'});
    }
  }
}
