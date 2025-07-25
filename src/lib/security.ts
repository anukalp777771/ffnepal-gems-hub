// Security utilities and rate limiting

interface LoginAttempt {
  timestamp: number;
  count: number;
}

const loginAttempts = new Map<string, LoginAttempt>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const checkRateLimit = (identifier: string): { allowed: boolean; remainingAttempts?: number; lockoutUntil?: number } => {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);

  if (!attempt) {
    loginAttempts.set(identifier, { timestamp: now, count: 1 });
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - 1 };
  }

  // Reset if lockout period has passed
  if (now - attempt.timestamp > LOCKOUT_DURATION) {
    loginAttempts.set(identifier, { timestamp: now, count: 1 });
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - 1 };
  }

  // Check if still in lockout period
  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    return { 
      allowed: false, 
      lockoutUntil: attempt.timestamp + LOCKOUT_DURATION 
    };
  }

  // Increment attempt count
  attempt.count++;
  return { 
    allowed: true, 
    remainingAttempts: MAX_LOGIN_ATTEMPTS - attempt.count 
  };
};

export const recordFailedLogin = (identifier: string): void => {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);

  if (attempt) {
    attempt.count++;
    attempt.timestamp = now;
  } else {
    loginAttempts.set(identifier, { timestamp: now, count: 1 });
  }
};

export const clearLoginAttempts = (identifier: string): void => {
  loginAttempts.delete(identifier);
};

// Generate CSRF token
export const generateCSRFToken = (): string => {
  return crypto.getRandomValues(new Uint32Array(4)).join('-');
};

// Session management
export const createSecureSession = (): { token: string; expiresAt: number } => {
  const token = crypto.getRandomValues(new Uint32Array(8)).join('-');
  const expiresAt = Date.now() + (2 * 60 * 60 * 1000); // 2 hours
  return { token, expiresAt };
};

export const isSessionValid = (session: { token: string; expiresAt: number }): boolean => {
  return Date.now() < session.expiresAt;
};