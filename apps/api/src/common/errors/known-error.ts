export class KnownError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode = 400,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
  }

  toJSON(): Record<string, unknown> {
    return {
      code: this.code,
      error: this.message,
      ...(this.details ? { details: this.details } : {}),
    };
  }
}

export class InvalidRefreshTokenError extends KnownError {
  constructor() {
    super('INVALID_REFRESH_TOKEN', 'Invalid refresh token', 401);
  }
}
