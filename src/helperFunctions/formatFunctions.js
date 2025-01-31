/**
 * Formats Date and Time
 * @param {string} date in ISO 8601 format. Example: "2024-07-15T19:27:10.703Z"
 * @return {object} Object with date and time formatted as "yyyy-mm-dd" and "hh:mm respectively. (Also changes time to current time zone from listed time in GMT)
 */
export const formatDate = (date) => {
  const dateObj = new Date(date.created_at);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  return {
    yymmdd: `${year}-${month}-${day}`,
    hhmm: `${hours}:${minutes} via ${date.via}`,
  };
};

/**
 * Formats call duration
 * @param {number} seconds The duration of the call in seconds.
 * @return {string} Call duration formatted as h m or s, example: 1h 30m or 32m or 45s
 */
export const formatDuration = (seconds) => {
  const dateObj = new Date(seconds * 1000);
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const secs = dateObj.getSeconds();
  if (hours == 0 && minutes == 0) {
    return `${secs}s`;
  } else if (hours == 0 && minutes != 0) {
    return `${minutes}m`;
  } else {
    return `${hours}h ${minutes}m`;
  }
};

/**
 * Formats a phone number to a standard format (for North America), othewuse returns the phone number as is.
 * @param {number} phoneNumber like 1234567890
 * @return {string} number formatted as +1 (123) 456-7890
 */
export const formatPhoneNumber = (phoneNumber) => {
  const phone = phoneNumber.toString();
  if (phone.length == 11)
    return `+${phone[0]} (${phone[1]}${phone[2]}${phone[3]}) ${phone[4]}${phone[5]}${phone[6]}-${phone[7]}${phone[8]}${phone[9]}${phone[10]}`;
  else return phone;
};
