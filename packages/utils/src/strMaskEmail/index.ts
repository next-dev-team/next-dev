/**
 * Masks a string to show only a specified number of characters at the beginning.
 * @param email - The email address to be masked.
 * @param visibleNum - The number of characters to show at the beginning.
 * @returns The masked email address.
 */
export default function maskEmail(email: string, visibleNum = 2): string {
  const atIndex = email.indexOf('@');

  if (atIndex <= 1) {
    // If '@' is at the beginning or not found, return the original email
    return email;
  }

  const prefix = email.substring(0, visibleNum); // Take the first two characters
  const maskedPrefix = prefix + '*'.repeat(atIndex - visibleNum); // Mask characters in between
  const domain = email.substring(atIndex); // Get the domain part

  return maskedPrefix + domain;
}
