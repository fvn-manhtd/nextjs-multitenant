import crypto from "crypto";

export class Validation {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateName(name: string): boolean {
    const nameRegex = /^[a-zA-Z ]+$/;
    return nameRegex.test(name);
  }

  static validateTenantId(tenantId: string): boolean {
    const tenantIdRegex = /^[a-zA-Z\- ]{1,40}$/;
    return tenantIdRegex.test(tenantId);
  }

  static validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }

  static hashPassword(password: string, salt: string): string {
    return crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);
  }
}
