const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

async function postJson(path: string, body: unknown): Promise<void> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error ?? 'Something went wrong.');
  }
}

export function requestOtp(email: string): Promise<void> {
  return postJson('/api/otp/request', { email });
}

export function verifyOtpCode(email: string, code: string): Promise<void> {
  return postJson('/api/otp/verify', { email, code });
}
