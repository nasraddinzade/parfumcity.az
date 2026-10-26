/** Card helpers for the demo checkout. Nothing here talks to a network. */

/** Test numbers accepted by the demo. All of them pass Luhn and belong to no real account. */
export const TEST_CARD_NUMBERS: ReadonlySet<string> = new Set([
  "4242424242424242",
  "4000056655665556",
  "5555555555554444",
  "2223003122003222",
]);

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function luhnCheck(digits: string): boolean {
  if (!/^\d+$/.test(digits)) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

/** "4242424242424242" -> "4242 4242 4242 4242" */
export function formatCardNumber(value: string): string {
  return digitsOnly(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** "1229" -> "12/29" */
export function formatExpiry(value: string): string {
  const d = digitsOnly(value).slice(0, 4);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + "/" + d.slice(2);
}

export function parseExpiry(value: string): { month: number; year: number } | null {
  const m = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!m) return null;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return null;
  return { month, year };
}

export function isExpiryInFuture(value: string, now = new Date()): boolean {
  const parsed = parseExpiry(value);
  if (!parsed) return false;
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  return parsed.year > y || (parsed.year === y && parsed.month >= m);
}

/** Azerbaijani mobile numbers: +994 followed by 9 digits. Spaces and dashes are tolerated. */
export function isAzPhone(value: string): boolean {
  const d = digitsOnly(value);
  return /^994\d{9}$/.test(d) || /^0\d{9}$/.test(d);
}

export function formatAzPhone(value: string): string {
  let d = digitsOnly(value);
  if (d.startsWith("0")) d = "994" + d.slice(1);
  if (!d.startsWith("994")) d = "994" + d;
  d = d.slice(0, 12);
  const rest = d.slice(3);
  const parts = [rest.slice(0, 2), rest.slice(2, 5), rest.slice(5, 7), rest.slice(7, 9)].filter(Boolean);
  return "+994" + (parts.length ? " " + parts.join(" ") : "");
}
