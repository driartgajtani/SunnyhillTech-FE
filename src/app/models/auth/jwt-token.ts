export interface JwtToken {
    sub: string; // Subject (e.g., "email")
    jti: string; // JWT ID (Guid)
    Email: string;
    uid: string; // User ID (Guid)
    roles: string[]; // Role (User, Admin, etc.)
    Name: string;
    Surname: string;
    Id: string;
    nbf: number; // Not before timestamp
    exp: number; // Expiration timestamp
    iat: number; // Issued at timestamp
    iss: string; // Issuer (e.g., "SunnyhillTechSystemAPI")
    aud: string; // Audience (e.g., "SunnyhillTechSystem")
}