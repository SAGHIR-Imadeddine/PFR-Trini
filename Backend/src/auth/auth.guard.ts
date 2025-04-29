import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { PUBLIC_KEY } from "./public.decorator";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector : Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const publicKey = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler());
        if (publicKey) return true;
            
        return super.canActivate(context);
    }
    
}
