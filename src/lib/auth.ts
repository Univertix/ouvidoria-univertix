// src/lib/auth.ts
const COOKIE_NAME = 'admin_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 horas

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET não está definido no .env');
  return secret;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return bufferToHex(signature);
}

function toBase64Url(input: string): string {
  const base64 = btoa(unescape(encodeURIComponent(input)));
  // Correção da Regex aqui
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(input: string): string {
  // Correção da Regex aqui
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return decodeURIComponent(escape(atob(padded)));
}

export async function createSessionToken(username: string): Promise<string> {
  const expires = Date.now() + SESSION_DURATION_SECONDS * 1000;
  // Correção das template strings
  const payload = `${username}.${expires}`;
  const signature = await hmacSign(payload);
  return toBase64Url(`${payload}.${signature}`);
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    const decoded = fromBase64Url(token);
    const parts = decoded.split('.');
    if (parts.length !== 3) return false;
    const [username, expiresStr, signature] = parts;
    const payload = `${username}.${expiresStr}`;
    const expectedSignature = await hmacSign(payload);
    
    if (signature !== expectedSignature) return false;
    if (Date.now() > Number(expiresStr)) return false;
    return true;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE = SESSION_DURATION_SECONDS;