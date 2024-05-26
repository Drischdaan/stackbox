import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from '../entities/user.entity';
import { IJwtPayload } from '../models/jwt.models';
import { UsersService } from '../services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${config.get<string>('auth.issuerUrl')}.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: config.get<string>('auth.audience'),
      issuer: config.get<string>('auth.issuerUrl'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: IJwtPayload): Promise<UserEntity> {
    const user: UserEntity = await this.usersService.getOrCreateUserIfNotExists(
      {
        auth0Id: payload.sub,
      },
    );
    return user;
  }
}
