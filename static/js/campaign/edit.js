


let currentEdit = null;

const backButton = document.getElementById('backb');
function openCampaignDetails(campaignCard) {
  // Hide the list of campaigns
  currentEdit = campaignCard;
  const campaignList = document.getElementById("campaignList");
  campaignList.classList.add("hidden");
  backButton.style.opacity = '1';

  // Show the campaign details
  const details = document.getElementById("campaignDetails");
  details.classList.remove("hidden");
  showTab('emailTab');

  const campaignTitle = document.getElementById('detailTitle');
  campaignTitle.classList.remove('hidden');

  // Determine if it's a DOM element or an object
  const isElement = campaignCard instanceof HTMLElement;

  // Get data values
  const name = isElement ? campaignCard.getAttribute('data-name') : campaignCard.name;
  const paused = isElement ? campaignCard.getAttribute('data-paused') === 'true' : !!campaignCard.paused;
  let dates;
  if (isElement) {

    const rawDates = campaignCard.getAttribute('data-dates');
   
    dates = rawDates ? JSON.parse(rawDates) : [];
  } else {
    dates = campaignCard.dates || [];
  }

  let list_id;
  if (isElement) {

    const raw_lists = campaignCard.getAttribute('data-list_id');
   
    list_id = raw_lists ? JSON.parse(raw_lists) : [];
  } else {
    list_id = campaignCard.list_id || [];
  }
  
  const subject = isElement ? campaignCard.getAttribute('data-subject') : campaignCard.subject || '';
  const body = isElement ? campaignCard.getAttribute('data-body') : campaignCard.body || '';
  
  render_ListsTable();
  apply_selected_ids_to_list(list_id);

  // Apply values to the form
  campaignTitle.textContent = name;
  document.getElementById("check-paused").checked = paused;
  setSelectedDates(dates);
  document.getElementById('email-subject').value = subject;
  quill.root.innerHTML = body;
}



function backToCampaignList() {
  currentEdit = null;
  // Show the list of campaigns
  const campaignList = document.getElementById("campaignList");
  campaignList.classList.remove("hidden");
  backButton.style.opacity = '0';
  // Hide the campaign details
  const details = document.getElementById("campaignDetails");
  details.classList.add("hidden");
  const campaignTitle = document.getElementById('detailTitle');
  campaignTitle.classList.add('hidden');
}

//code to managhe the editing of campigns including setting an email and determining the list of people to send it to 
function showTab(tabId) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.add('hidden');
  });

  // Remove active-tab class from all buttons
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active-tab');
  });

  // Show the selected tab
  document.getElementById(tabId).classList.remove('hidden');

  // Find the button that matches the tabId by its text
  document.querySelectorAll('.tab-button').forEach(btn => {
    if (btn.getAttribute('onclick')?.includes(tabId)) {
      btn.classList.add('active-tab');
    }
  });
}





    const quill = new Quill('#email-content-editor', {
      theme: 'snow',
      placeholder: 'Type your email content here...',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],

          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],

          ['link', 'image', 'video'],
          ['clean']
        ]
      }
    });
  








    function add_list_button() {
      switchScreen('lists');
    }

    //start of the list selcition

    
    function render_ListsTable(filteredLists = list_headers ) {
      
      const tableBody = document.getElementById('lists-table-body');
      tableBody.innerHTML = '';
    
      if (filteredLists.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="2" class="text-center py-6 text-gray-500">No lists found.</td>
          </tr>
        `;
        return;
      }
    
      filteredLists.forEach(list => {
        const row = document.createElement('tr');
        row.className = "list-row hover:bg-gray-700 cursor-pointer transition-all list-row";
        row.setAttribute('data-id', list.id);
        row.onclick = () => select_list_row(row);

        row.innerHTML = `
        
          <td class="py-4 px-6 font-semibold">${list.name}</td>
          <td class="py-4 px-6">${list.count}</td>
        `;
        tableBody.appendChild(row);
      });
    }
    
    // Call it once to render initially
    render_ListsTable();
    
//to enable seachring
    document.addEventListener('DOMContentLoaded', function () {
      const searchInput = document.getElementById('search-lists');
      const tableBody = document.getElementById('lists-table-body');
    
      searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
    
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
          const listNameCell = row.querySelector('td:first-child');
          if (listNameCell) {
            const listName = listNameCell.textContent.toLowerCase();
            if (listName.includes(searchTerm)) {
              row.classList.remove('hidden');
            } else {
              row.classList.add('hidden');
            }
          }
        });
      });
    });

    let selectedListId = [];

    function apply_selected_ids_to_list(selected_id_list) {
      selectedListId.length = 0;
      console.log(selected_id_list);
      selected_id_list.forEach(id => {
        const row = document.querySelector(`.list-row[data-id="${id}"]`);
        console.log(row);
        if (row) {
          select_row(row, id);
        }
      });
    }
    
    

    function select_row(row, id) {
              // Then highlight the selected row
      row.classList.add('row-selected');
      
              
        if (!selectedListId.includes(id)) {
          selectedListId.push(id);
      }
              
    }



    function select_list_row(row) {
      // First, remove highlight from all rows
      const id = parseInt(row.getAttribute('data-id'));
      if (selectedListId.includes(id)) {

        const index = selectedListId.indexOf(id);
    if (index !== -1) {
      selectedListId.splice(index, 1);
    }
        row.classList.remove('row-selected');
      }
      else {
        
        select_row(row, id);
      } 
      console.log(selectedListId);
    }


const timeModal = document.getElementById("timeModal");
const modalDateText = document.getElementById("modal-date");
const calendarEl = document.getElementById("calendar");
const calendarTitleEl = document.getElementById("calendar-title");
const selectedDatesEl = document.getElementById("selectedDates");
const unselectButton = document.getElementById('unselect-time');

let currentDateForModal = null;
let selectedDates = new Set();
let dateTimes = {};
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let isAM = true; // AM/PM toggle

// Open modal for selected date
function openTimeModal(dateStr) {
  currentDateForModal = dateStr;
  modalDateText.textContent = dateStr;

  const [hour, minute] = (dateTimes[dateStr] || "09:00").split(":");

  if (selectedDates.has(currentDateForModal)) {
    unselectButton.style.opacity = '1';
  } else {
    unselectButton.style.opacity = '0';
  }


  // Set the initial values in the modal
  document.getElementById("selected-hour").textContent = formatHour(hour);
  document.getElementById("selected-minute").textContent = minute;
  updateAmPmButton();

  timeModal.classList.remove("hidden");
}

// Close modal
function closeTimeModal() {
  timeModal.classList.add("hidden");
  currentDateForModal = null;
}

function unselect_time() {
  selectedDates.delete(currentDateForModal);  // Remove the current date from the selected set
  dateTimes[currentDateForModal] = undefined; // Clear the time associated with that date
  renderCalendar(currentYear, currentMonth);  // Re-render the calendar
  updateSelectedDatesDisplay();
  closeTimeModal();  // Close the modal
}


// Save selected time
function saveTime() {
  const hour = document.getElementById("selected-hour").textContent;
  const minute = document.getElementById("selected-minute").textContent;
  const time = `${hour}:${minute}`;
  if (currentDateForModal) {
    dateTimes[currentDateForModal] = time;
    selectedDates.add(currentDateForModal);
    renderCalendar(currentYear, currentMonth);
    updateSelectedDatesDisplay();
    closeTimeModal();
  }
}

// Change hour
function changeHour(amount) {
  const hourElement = document.getElementById("selected-hour");
  let currentHour = parseInt(hourElement.textContent);
  currentHour = (currentHour + amount + 12) % 12; // wrap around for 12-hour format
  hourElement.textContent = formatHour(currentHour);
}

// Change minute
function changeMinute(amount) {
  const minuteElement = document.getElementById("selected-minute");
  let currentMinute = parseInt(minuteElement.textContent);
  currentMinute = (currentMinute + amount + 60) % 60; // wrap around
  minuteElement.textContent = currentMinute.toString().padStart(2, "0");
}

// Toggle AM/PM
function toggleAmPm() {
  isAM = !isAM;
  updateAmPmButton();
  const hourElement = document.getElementById("selected-hour");
  let currentHour = parseInt(hourElement.textContent);
  hourElement.textContent = formatHour(currentHour);
}

// Update AM/PM button text
function updateAmPmButton() {
  const amPmButton = document.getElementById("am-pm-button");
  amPmButton.textContent = isAM ? "AM" : "PM";
}

// Format hour to 12-hour format
function formatHour(hour) {
  hour = parseInt(hour);
  if (isAM && hour === 0) {
    return "12"; // 12 AM
  } else if (!isAM && hour === 0) {
    return "12"; // 12 PM
  } else if (hour > 12) {
    return (hour - 12).toString(); // PM hours
  } else {
    return hour.toString().padStart(2, "0"); // AM hours
  }
}

// Render calendar
function renderCalendar(year, month) {
  calendarTitleEl.textContent = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  calendarEl.innerHTML = `
  <div class="font-semibold">Sun</div>
  <div class="font-semibold">Mon</div>
  <div class="font-semibold">Tue</div>
  <div class="font-semibold">Wed</div>
  <div class="font-semibold">Thu</div>
  <div class="font-semibold">Fri</div>
  <div class="font-semibold">Sat</div>
`;


  for (let i = 0; i < firstDay; i++) {
    calendarEl.appendChild(document.createElement("div"));
  }

  for (let date = 1; date <= lastDate; date++) {
    const thisDate = new Date(year, month, date);
    thisDate.setHours(0, 0, 0, 0);
    const iso = thisDate.toISOString().split("T")[0];

    const day = document.createElement("div");
    day.className = "day p-3 rounded-lg bg-gray-700 hover:bg-purple-500 cursor-pointer transition";

    if (thisDate < today) {
      day.classList.add("opacity-30", "cursor-not-allowed");
      day.textContent = date;
      calendarEl.appendChild(day);
      continue;
    }

    if (selectedDates.has(iso)) {
      day.classList.add("bg-purple-600");
      day.innerHTML = `<div class="text-sm">${date}</div><div class="text-xs text-gray-300">${dateTimes[iso]}</div>`;
    } else {
      day.textContent = date;
    }

    day.onclick = () => openTimeModal(iso);
    calendarEl.appendChild(day);
  }
}



// Month navigation
function changeMonth(offset) {
  currentMonth += offset;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear -= 1;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear += 1;
  }
  renderCalendar(currentYear, currentMonth);
}

// Update selected dates display
function updateSelectedDatesDisplay() {
  const arr = Array.from(selectedDates).sort();
  selectedDatesEl.innerHTML = "";

  if (!arr.length) {
    selectedDatesEl.textContent = "No dates selected";
    return;
  }

  selectedDatesEl.className = "mt-6 text-sm text-gray-300 flex flex-wrap gap-x-8 gap-y-1";

  arr.forEach((d) => {
    const item = document.createElement("div");
    item.textContent = `${d} @ ${dateTimes[d] || 'unspecified'}`;
    selectedDatesEl.appendChild(item);
  });
}


// Confirm selection (stub)
function confirmDates() {
  const dates = Array.from(selectedDates);
  const sendTimes =  dates.map(d => `${d} ${dateTimes[d]}`);
  return sendTimes;
  //alert("Send dates confirmed:\n" + dates.map(d => `${d} @ ${dateTimes[d]}`).join("\n"));
}


function setSelectedDates(dates) {

  if (typeof dates === 'string') {
    try {
      dates = JSON.parse(dates);
    } catch (e) {
      console.error("Failed to parse dates string:", dates);
      return;
    }
  }
  if (!Array.isArray(dates)) {
    // no dates
    console.log(dates);
    return;
  }


    selectedDates.clear();
  
  dateTimes = {};

  if (dates != null && dates.length != 0) {
    dates.forEach(dt => {
      const [date, time] = dt.split(" ");
      selectedDates.add(date);
      dateTimes[date] = time || "09:00"; // Default to 09:00 if time is missing
    });
  }
  
  renderCalendar(currentYear, currentMonth);
  updateSelectedDatesDisplay();
}




// Init
renderCalendar(currentYear, currentMonth);

// Event listeners for buttons
document.getElementById("hour-increase").addEventListener("click", () => changeHour(1));
document.getElementById("hour-decrease").addEventListener("click", () => changeHour(-1));
document.getElementById("minute-increase").addEventListener("click", () => changeMinute(5));
document.getElementById("minute-decrease").addEventListener("click", () => changeMinute(-5));
document.getElementById("save-time").addEventListener("click", saveTime);
document.getElementById("am-pm-button").addEventListener("click", toggleAmPm);
document.getElementById("unselect-time").addEventListener("click", unselect_time);








function saveEmailList() {
  return selectedListId;
}


function saveEditedCampaign() {
  const subject = document.getElementById('email-subject').value;
  const body = quill.root.innerHTML;
  const paused = document.getElementById('check-paused').checked;

  const list = JSON.stringify(saveEmailList());
  const dates = JSON.stringify(confirmDates());
  const name = document.getElementById('detailTitle').innerText;
  console.log(USER_DETAILS);
  const user_id = USER_DETAILS.id;

  const data = {
    id: currentEdit instanceof HTMLElement 
    ? currentEdit.getAttribute('data-id') 
    : currentEdit.id,

    name,
    subject,
    body,
    list_id : list,
    dates,
    paused,
    user_id,
  };

  const data_to_server = {
    table : 'campaigns', 
    data,
    primary_key : 'id',
  }
  

  fetch('/update', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data_to_server) 
})
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
})
.then(responseData => {   // <- change this to 'responseData'
  if (responseData.success) {
    if (currentEdit) {
      // Use the 'data' you already created earlier (NOT the server response)

      currentEdit.setAttribute('data-name', data.name);
      currentEdit.setAttribute('data-subject', data.subject);
      currentEdit.setAttribute('data-body', data.body);
      currentEdit.setAttribute('data-list_id', data.list_id); // already JSON string
      currentEdit.setAttribute('data-dates', data.dates);  // already JSON string
      currentEdit.setAttribute('data-paused', data.paused);

      currentEdit.innerHTML = generateCampaignCardHTML(data); 
      backToCampaignList();
    }
  } else {
    console.log(responseData.error);
  }
})
.catch(error => {
  console.error('Error updating campaign:', error);
});



  
  
  //functionality to save to db
  
  //get the campagin card
 

  //change its attributes

  
  
}