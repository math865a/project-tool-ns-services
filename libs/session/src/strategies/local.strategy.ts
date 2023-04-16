import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import {
    ValidateCredentialsHandler,
    ValidateCredentialsQuery,
} from "../queries/validate-credentials";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly validateCredentials: ValidateCredentialsHandler
    ) {
        super();
    }

    async validate(email: string, password: string): Promise<{ uid: string }> {
        const { uid } = await this.validateCredentials.execute(
            new ValidateCredentialsQuery(email, password)
        );
            

        if (!uid) {
            throw new UnauthorizedException("Der findes ingen bruger med denne email og/eller adgangskode");
        }
        return { uid };
    }
}
