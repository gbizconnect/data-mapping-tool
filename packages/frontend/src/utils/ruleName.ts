import { Dispatch, SetStateAction } from "react";

/**
 * Determine illegal characters in string.
 * Not allowed: /\:?*"<>|
 * Not allowed: Forbidden that the first character is a dot.
 *
 * @param {string} str
 * @returns {boolean} true = Hit; false = Missed
 */
export const filterStr = (str: string): boolean =>
  new RegExp(/[\/\\:?*"<>|]+/, "img").test(str);

/**
 * Format the datetime.
 *
 * @param {Date} time
 * @param {boolean} withDelimiter
 * @returns {string}
 */
export const formatTime = (time: Date, withDelimiter: boolean): string =>
  withDelimiter
    ? `${time.getFullYear()}/${(time.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${time.getDate().toString().padStart(2, "0")} ${time
        .getHours()
        .toString()
        .padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`
    : `${time.getFullYear()}${(time.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${time.getDate().toString().padStart(2, "0")}${time
        .getHours()
        .toString()
        .padStart(2, "0")}${time.getMinutes().toString().padStart(2, "0")}${time
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

/**
 * Generate a temporary rule name with current datetime.
 *
 * @returns {string}
 */
export const getRuleName = (): string =>
  `ConvertRule_${formatTime(new Date(), false)}`;

/**
 * Generate a temporary rule name and change it through the hook function.
 *
 * @param {Dispatch<SetStateAction<string>>} setRuleName
 * @param {Dispatch<SetStateAction<string>>} setTempRuleName
 * @returns {void}
 */
export const generateRuleName = (
  setRuleName: Dispatch<SetStateAction<string>>,
  setTempRuleName: Dispatch<SetStateAction<string>>
): void => {
  const ruleName = getRuleName();
  setRuleName(ruleName);
  setTempRuleName(ruleName);
};
