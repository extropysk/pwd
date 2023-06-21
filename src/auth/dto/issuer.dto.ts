import { Issuer } from "src/auth/interfaces/issuer.interface";

export class IssuerDto implements Issuer {
  jwtKey: string;
}
