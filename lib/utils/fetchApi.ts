export const getBase = () => {
  // Prefer explicitly set base URL (set NEXT_PUBLIC_APP_URL in env), fall back to NEXTAUTH_URL, then localhost
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
};

export async function fetchJson(path: string) {
  const base = getBase();
  const res = await fetch(new URL(path, base).toString(), { cache: 'no-store' });
  if (!res.ok) {
    return { success: false, error: `Fetch failed: ${res.status}` };
  }
  return res.json();
}