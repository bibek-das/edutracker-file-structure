function loopThroughDatesWithDayOfWeek(startDate, endDate) {
    let currentDate = new Date(startDate);
  
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    while (currentDate <= new Date(endDate)) {
      const dayOfWeek = dayNames[currentDate.getDay()];
  
      // Format date as "yy-mm-dd"
      const year = String(currentDate.getFullYear());
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
      const day = String(currentDate.getDate()).padStart(2, '0'); // Add leading zero if necessary
  
      const formattedDate = `${year}-${month}-${day}`;
  
      // Append day of the week
      const dateWithDayOfWeek = `${formattedDate} ${dayOfWeek}`;
      console.log(dateWithDayOfWeek);
  
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
  }
  
  const startDate = '2024-05-01';
  const endDate = '2024-05-07';
  
  loopThroughDatesWithDayOfWeek(startDate, endDate);
  