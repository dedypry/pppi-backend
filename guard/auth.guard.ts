import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PersonalTokenModel } from 'models/PersonalToken.model';
import { verify } from 'utils/helpers/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization) throw new UnauthorizedException();

    const token = authorization.replaceAll('Bearer ', '');

    const personalToken = await PersonalTokenModel.query().findOne(
      'token',
      token,
    );

    if (!personalToken) return false;

    const now = new Date();
    if (personalToken.exp && new Date(personalToken.exp) < now) {
      throw new UnauthorizedException('Token has expired');
    }

    const user = verify(token);

    if (!user) {
      return false;
    }

    request.user = user;

    console.log(user);

    return true;
  }
}
