export function capitalizeInitials(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const capitalizeInitial = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);
