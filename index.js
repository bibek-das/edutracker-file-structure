function subtractMinutes(timeStr, minutesToSubtract) {
  // Parse the time string
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  // Convert hours to 24-hour format if necessary
  hours = parseInt(hours, 10);
  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }
  // Create a Date object for the current day with the parsed time
  const date = new Date();
  date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, milliseconds
  // Subtract the minutes
  date.setMinutes(date.getMinutes() - minutesToSubtract);
  // Get the updated hours and minutes
  let updatedHours = date.getHours();
  let updatedMinutes = date.getMinutes();
  // Determine the new AM/PM modifier
  let newModifier = updatedHours >= 12 ? 'PM' : 'AM';
  if (updatedHours === 0) {
    updatedHours = 12; // Midnight case
  } else if (updatedHours > 12) {
    updatedHours -= 12; // Convert back to 12-hour format
  }
  // Format the hours and minutes with leading zeros if necessary
  updatedHours = String(updatedHours).padStart(2, '0');
  updatedMinutes = String(updatedMinutes).padStart(2, '0');
  // Combine into the final time string
  return `${updatedHours}:${updatedMinutes} ${newModifier}`;
}

const originalTime = "12:02 AM";
const newTime = subtractMinutes(originalTime, 10);

console.log(newTime); // Output: "03:10 AM"
