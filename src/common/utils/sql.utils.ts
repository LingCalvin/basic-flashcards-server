/**
 * Escapes wildcard characters that are used in an SQL LIKE pattern.
 *
 * @remarks
 *
 * This function escapes "\\", ",", "%", and "_" using "\\". It assumes that the
 * escape character is "\\".
 *
 * @param string - The string to escape
 * @returns The escaped string
 */
export function escapeLike(string: string): string {
  return string.replace(/[\\,%,\,,_]/g, '\\$&');
}
