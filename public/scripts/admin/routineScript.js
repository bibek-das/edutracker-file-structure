// JavaScript code for handling CRUD operations
const addRoutineBtn = document.getElementById('addRoutineBtn');
const routineForm = document.getElementById('routineForm');
const cancelRoutineBtn = document.getElementById('cancelRoutineBtn');

document.addEventListener('DOMContentLoaded', function() {
  const deptSelect = document.getElementById('deptID');
  deptSelect.addEventListener('change', function() {
    console.log("changed");
    const hiddenID = document.getElementById("departmentID");
    const selectedDeptID = this.value;
    if (selectedDeptID != "") {
      hiddenID.value = selectedDeptID;
    }
    const routineItems = document.querySelectorAll('.routine-item');
    routineItems.forEach(item => {
      if (item.getAttribute('data-dept') === selectedDeptID) {
        item.style.display = 'contents';
      } else {
        item.style.display = 'none';
      }
    });
  });
  routineForm.addEventListener('submit', function(event) {
    if (deptSelect.value === "") {
      alert('Please select a department');
      event.preventDefault(); // Prevent form submission if no department is selected
    }
  });
});


// Function to toggle visibility of routine form
addRoutineBtn.addEventListener('click', function() {
  routineForm.style.display = 'block';
});


// Function to format time with leading zero if necessary
function formatTime(time) {
  return time.toString().padStart(2, '0');
}

// Function to edit routine
function editRoutine(routineID) {
  console.log(routineID);
  const row = document.getElementById(routineID);
  const cells = row.getElementsByTagName('td');
  const convert = (timeString) =>{
    const [time, timePeriod] = timeString.split(" ");
    const [hour, minute] = time.split(":");

    // Convert hour to a number (optional, since it's already a string)
    const hourNumber = parseInt(hour, 10);
    return [hourNumber, minute, timePeriod];
  }

  // // Fill form fields with row data
  const startTime = convert(cells[0].textContent)
  document.getElementById('startTimeHours').value = startTime[0];
  document.getElementById('startTimeMinutes').value = startTime[1];
  document.getElementById('startTimePeriod').value = startTime[2];
  const endTime = convert(cells[1].textContent)
  document.getElementById('endTimeHours').value = endTime[0];
  document.getElementById('endTimeMinutes').value = endTime[1];
  document.getElementById('endTimePeriod').value = endTime[2];
  document.getElementById('batch').value = cells[2].textContent;
  document.getElementById('section').value = cells[3].textContent;
  document.getElementById('course').value = cells[4].textContent;
  document.getElementById('teacher').value = cells[5].textContent;
  document.getElementById('room').value = cells[6].textContent;

  routineForm.style.display = 'block';
  routineForm.action = `/admin/routine/${routineID}`;
}

// Function to delete routine
async function confirmDeleteRoutine(id) {
  if (confirm('Are you sure you want to delete this routine?')) {
    var row = document.getElementById(id);
    row.parentNode.removeChild(row);
    const response = await fetch(`/admin/routine/${id}`, {
      method: 'DELETE',
    });
  }
}

function deleteRoutine(id) {
  const row = document.getElementById(id);
}

// Function to handle cancel button click
cancelRoutineBtn.addEventListener('click', function() {
  routineForm.reset();
  routineForm.action = '/admin/routine';
  routineForm.style.display = 'none';
});

