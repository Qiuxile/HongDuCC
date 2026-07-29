import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * Like JwtAuthGuard but does NOT throw 401 — sets req.user if valid token, otherwise leaves it undefined.
 * Equivalent to the legacy FastAPI `get_current_user_optional`.
 */
@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest(err: any, user: any) {
    // Never throw — just return whatever we got (null/undefined if no valid token)
    return user
  }
}
