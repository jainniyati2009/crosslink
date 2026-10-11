export type GoogleClaims = { email?: string | null; email_verified?: boolean | null; hd?: string | null; sub?: string | null };
export function normalizeEmail(value: string) { return value.trim().toLowerCase(); }
export function isEligibleGoogleProfile(claims: GoogleClaims, workspaceDomain = 'nsut.ac.in') {
  if (!claims.sub || claims.email_verified !== true || !claims.email) return false;
  const email = normalizeEmail(claims.email);
  const at = email.lastIndexOf('@');
  return at > 0 && email.slice(at + 1) === 'nsut.ac.in' && claims.hd?.toLowerCase() === workspaceDomain.toLowerCase();
}
