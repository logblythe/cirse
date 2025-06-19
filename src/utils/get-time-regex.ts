export function getTimeRegex(format = "24h") {
  if (format === "24h" || format === "HH:mm") {
    // 00:00 to 23:59
    return /^([01]\d|2[0-3]):[0-5]\d$/;
  } else {
    // 01:00 to 12:59 with optional AM/PM (case-insensitive)
    return /^(0[1-9]|1[0-2]):[0-5]\d(\s?[AaPp][Mm])?$/;
  }
}
