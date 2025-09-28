/**
 * Merge any number of Tailwind/other class names into one string,
 * skipping undefined, null or false.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
