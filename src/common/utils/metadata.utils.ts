/**
 * Returns a new object without the `created_at` property.
 *
 * @remarks
 * This function will return an object with only the enumerable properties of
 * `data`.
 *
 * @param data - The object to remove the `created_at` property from
 * @returns An object with the same enumerable properties as `data` excluding
 * `created_at`
 */
export function stripCreatedAt<T extends { created_at: any }>(
  data: T,
): Omit<T, 'created_at'> {
  const { created_at: _, ...rest } = data;
  return rest;
}

/**
 * Returns a new object without the `updated_at` property.
 *
 * @remarks
 * This function will return an object with only the enumerable properties of
 * `data`.
 *
 * @param data - The object to remove the `updated_at` property from
 * @returns An object with the same enumerable properties as `data` excluding
 * `updated_at`
 */
export function stripUpdatedAt<T extends { updated_at: any }>(
  data: T,
): Omit<T, 'updated_at'> {
  const { updated_at: _, ...rest } = data;
  return rest;
}
