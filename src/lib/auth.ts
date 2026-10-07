import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { UserRole, UserRecord } from './db/schema';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'stride-district-super-secret-jwt-key-2026-production-ready'
);

export interface AuthSession {
  userId: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function verifyPassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

export async function signAuthToken(payload: AuthSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyAuthToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as UserRole,
      firstName: payload.firstName as string,
      lastName: payload.lastName as string,
    };
  } catch {
    return null;
  }
}

// Role-Based Access Control permission matrix
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    'analytics.read',
    'products.read',
    'products.write',
    'inventory.read',
    'inventory.write',
    'orders.read',
    'orders.write',
    'orders.refund',
    'cms.read',
    'cms.write',
    'customers.read',
    'customers.write',
    'marketing.read',
    'marketing.write',
    'settings.read',
    'settings.write',
    'users.read',
    'users.write',
    'audit_logs.read',
  ],
  store_manager: [
    'analytics.read',
    'products.read',
    'products.write',
    'inventory.read',
    'inventory.write',
    'orders.read',
    'orders.write',
    'orders.refund',
    'customers.read',
    'marketing.read',
  ],
  content_editor: [
    'cms.read',
    'cms.write',
    'products.read',
    'marketing.read',
  ],
  support_agent: [
    'orders.read',
    'orders.write',
    'customers.read',
  ],
  warehouse_staff: [
    'inventory.read',
    'inventory.write',
    'orders.read',
    'orders.write',
  ],
  marketing_manager: [
    'marketing.read',
    'marketing.write',
    'cms.read',
    'analytics.read',
    'customers.read',
  ],
  customer: [
    'account.read',
    'account.write',
    'orders.self',
  ],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(permission);
}
