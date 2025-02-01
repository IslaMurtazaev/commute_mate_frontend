export function formatDateTime(date: Date) {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reset hours to compare just the dates
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowDate = new Date(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate()
  );
  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  // Get the date part
  let datePart;
  if (targetDate.getTime() === todayDate.getTime()) {
    datePart = 'Today';
  } else if (targetDate.getTime() === tomorrowDate.getTime()) {
    datePart = 'Tomorrow';
  } else {
    datePart = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  // Get the time part in local timezone
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${datePart} at ${timePart}`;
}
