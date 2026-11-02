/** Accept Bangla digits and Bangladesh's local / international formats. */
export function normalizePhone(value: string): string {
  const digits = value.replace(/[০-৯]/g, (digit) => String('০১২৩৪৫৬৭৮৯'.indexOf(digit))).replace(/\D/g, '');
  if (digits.startsWith('00880')) return digits.slice(4);
  if (digits.startsWith('880')) return digits.slice(2);
  return digits;
}
