/**
 * Determine whether the backend is a Java program.
 *
 * @returns {boolean}
 */
export const isPortal = (): boolean =>
  document.location.href.includes("/data_mapping");

/**
 * Exit method.
 *
 * @returns {void}
 */
export const exit = (): void => window.close();
