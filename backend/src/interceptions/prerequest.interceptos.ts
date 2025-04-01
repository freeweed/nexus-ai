import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { ClsService } from 'nestjs-cls'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class PrerequestInterceptor implements NestInterceptor {
    constructor(private readonly cls: ClsService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const requestId = req.headers['x-request-id'] || uuidv4();
        this.cls.set('requestId', requestId);
        return next.handle();
    }
}