/**
 * Creates a function which will return `false` if the input is undefined, or will test the given regex if the input is
 * defined.
 *
 * @param pattern The pattern to test with.
 * @return The matching function.
 */
export function match(pattern: RegExp): (str: string | undefined) => boolean {
  return (str: string | undefined) => {
    if (str === undefined) {
      return false;
    }
    return pattern.test(str);
  };
}
