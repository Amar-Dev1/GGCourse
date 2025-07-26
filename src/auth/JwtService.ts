import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  generateToken(id: any) {
    return jwt.sign(
      {
        id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' },
    );
  }
}
