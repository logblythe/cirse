export function getTimeRegex(format = "24h") {
  switch (format) {
    case "12h":
    case "hh:mm":
      return /^(0[1-9]|1[0-2]):[0-5]\d(\s?[AaPp][Mm])?$/;
    case "24h":
    case "HH:mm":
      return /^([01]\d|2[0-3]):[0-5]\d$/;
    case "dd-MM-yyyy":
      return /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
    default:
      return;
  }
}
