export const getFormattedDate = (isoDate: string) => {
  // Create a new Date object with the desired date and time
  const date = new Date(isoDate);

  // Get the hour and minute components
  const hour = date.getHours();
  const minute = date.getMinutes();

  // Format the hour and minute to have leading zeros if necessary
  const formattedHour = hour < 10 ? `0${hour}` : hour;
  const formattedMinute = minute < 10 ? `0${minute}` : minute;

  // Get the month name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];

  // Get the day of the month
  const day = date.getDate();

  // Create the formatted string
  const formattedDate = `${formattedHour}:${formattedMinute}, ${month} ${day}`;

  return formattedDate;
};
