//



function openAddListModal() {
  const modal = document.getElementById("add-list-modal");
  const name = document.getElementById("new-list-name");
  const description = document.getElementById("list-description");

  // Reset inputs
  name.value = '';
  description.value = '';

  // Unhide & animate in
  modal.classList.remove("hidden");
  modal.style.opacity = "0";
  modal.style.transform = "scale(0.95)";
  modal.style.transition = "opacity 300ms ease, transform 300ms ease";

  requestAnimationFrame(() => {
    modal.style.opacity = "1";
    modal.style.transform = "scale(1)";
  });
}

function closeAddListModal() {
  const modal = document.getElementById("add-list-modal");

  // Animate out
  modal.style.opacity = "0";
  modal.style.transform = "scale(0.95)";

  // Wait for animation to finish, then hide
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 300); // Match the 300ms transition duration
}

async function submitNewList() {
  loader.style.display = 'flex';
  const name = document.getElementById("new-list-name").value.trim();
  const description = document.getElementById("list-description").value.trim();

  if (!name) {
    alert("List name is required");
    return;
  }
  const user_id = USER_DETAILS.id;
  const list_data = { name, description, count: 0, user_id };

  const payload = {
    table: 'lists',
    data: list_data
  };

  try {
    const res = await fetch('/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const response = await res.json(); // parse response JSON
    console.log(response);
    if (response.success === true || response.success === 1) {
      list_data.id = response.identification;  
      list_data.recipients = [];         // Assign returned ID
      list_headers.push(list_data);           // Add to your frontend list
      renderListsTable();  
      render_ListsTable();                 // Refresh table view
      showToast('List Created Successfully');
    } else {
      console.error(response.error || "Unknown error from server.");
    }
    loader.style.display = 'none';
  } catch (err) {
    console.error("Network or server error:", err);
    loader.style.display = 'none';
  }

  closeAddListModal();
}




const tableBody = document.getElementById('list-table');


document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('list-search');
  

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


function populate_lists() {
  //fetch from server 
  const items_to_add = MAIN_DETAILS.lists;
  items_to_add.forEach(item => {

    list_headers.push(item);
  })

  //finally render
  renderListsTable();

}



//for saving / retiving lists 
//im having an list of dictionays that include ids of lists of emails that have already been retived
//the first time get the ,listr from sever , 
//befire going to fetch from the server seach this list for its id , if the id is present just display that saved list

const list_cache = {};

//for add / edit / delete have a list of changes and lewt server resolve each list
const to_add = [];
const to_update = [];
const to_delete = [];

let current_id;



function renderListsTable(filteredLists = list_headers) {
  
  tableBody.innerHTML = '';

  if (filteredLists.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td ' colspan="2" class="text-center py-6 text-gray-500">No lists found.</td>
      </tr>
    `;
    return;
  }

  filteredLists.forEach(list => {
    const row = document.createElement('tr');
    row.className = "hover:bg-gray-700 cursor-pointer list-row group transition-all duration-200 ease-in-out";

    row.onclick = () => list_select_list_row(row, list.id);
    const count = list.count;
row.innerHTML = `
  <td class="py-4 px-6 font-semibold text-gray-100 group-hover:text-white transition-colors duration-200">
    ${list.name}
  </td>
  <td class="py-4 px-6 text-gray-300 group-hover:text-white transition-colors duration-200">
    ${count}
  </td>
`;


    tableBody.appendChild(row);
  });
}

// Call it once to render initially



let selectedList = null;


function list_select_list_row(row, id) {
  // Highlight selected row
  document.querySelectorAll('.list-row-selected').forEach(r => r.classList.remove('list-row-selected'));
  row.classList.add('list-row-selected');

  const listDetails = list_headers.find(l => l.id === id);
  if (!listDetails) return;


  //set the current id to that 

  //open the side bar
  openEditPanel(id, listDetails);
}

async function fetchEmailsForList(listId) {
  try {
    const res = await fetch('/getEmails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ list_id: listId })
    });

    const data = await res.json();

    if (data.success) {
      list_cache[listId] = data.emails;
      console.log(list_cache);

      return data.emails || [];
    } else {
      console.error("Server error:", data.error || "Unknown error");
      return [];
    }
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}



async function openEditPanel(listId, listDetails) {
  selectedList = listDetails;

  // Update static info
  document.getElementById("edit-list-title").textContent = listDetails.name || "Unnamed List";
  document.getElementById("edit-list-description").textContent = listDetails.description || "No description";
  document.getElementById("edit-list-count").textContent = "...";

  // Show panel right away
  document.getElementById("edit-list-overlay").classList.remove("hidden");
  document.getElementById("edit-list-panel").classList.remove("translate-x-full");

  const emailsContainer = document.getElementById("edit-list-emails");

  // Show Tailwind loading spinner
  emailsContainer.innerHTML = `
    <div class="flex justify-center items-center py-8 animate-fade-in">
      <div class="flex flex-col items-center space-y-2 text-gray-400">
        <div class="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <span class="text-sm">Loading emails...</span>
      </div>
    </div>
  `;

  // Load emails
  let emails;
  if (list_cache[listId]) {
    emails = list_cache[listId];
  } else {
    try {
      emails = await fetchEmailsForList(listId);
      list_cache[listId] = emails; // Cache it
    } catch (err) {
      emailsContainer.innerHTML = `
        <div class="text-red-500 text-center py-4">Failed to load emails.</div>
      `;
      document.getElementById("edit-list-count").textContent = "0";
      return;
    }
  }

  listDetails.emails = emails;
  document.getElementById("edit-list-count").textContent = emails.length;

  // Populate email list
  if (emails.length > 0) {
    emailsContainer.innerHTML = "";
    emails.forEach(email => {
      const uniqueId = email.temp || email.id;
      const li = document.createElement("li");
      append_email_element(li, email.name, email.email, email.company, uniqueId);
    });
  } else {
    emailsContainer.innerHTML = `
      <div class="text-gray-400 text-center py-4">No emails in this list.</div>
    `;
  }
}


function closeEditPanel(dontsave = false) {


  document.querySelectorAll('.list-row-selected').forEach(r => r.classList.remove('list-row-selected'));
  document.getElementById("edit-list-overlay").classList.add("hidden");
  document.getElementById("edit-list-panel").classList.add("translate-x-full");

if (dontsave == false) {

  saveEditedList();
}
  //get the list selected
  //get the list of emails
  //2 lists , update , delete
}





function saveEditedList() {
  // Gather data from dictionaries
  const list_id = selectedList.id;
  const count = updateCount();
  const data = {
    to_add,
    to_update,
    to_delete,
    list_id,
    count
  };
  
  to_add.forEach(item => {
    delete item.id;
  });


  //needd to remove temp in each record
  


  



  if (to_add.length == 0 && to_update.length == 0 && to_delete.length == 0)
  {
    console.log('no data to send to server');
  }
  else {
    console.log(loader);
    
    
    fetch('/save-lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to save list changes');
      
      return res.json();
    })
    .then(response => {
      const newIdMap = response.new_id_map;

  for (const [tempId, newId] of Object.entries(newIdMap)) {
    const list = list_cache[data.list_id];
    const entryIndex = list.findIndex(e => e.temp == tempId);

    if (entryIndex !== -1) {
      list[entryIndex].id = newId;
      delete list[entryIndex].temp;
    } else {
      console.warn("Temp ID not found in list_cache:", tempId);
    }
  }

      
      
      
      
    showToast('List Saved Successfully');
  
      to_add.length = 0;
      to_update.length = 0;
      to_delete.length = 0;
      
    })
    .catch(err => {
      ErrorModal(err);
      
    });
  }


  }
  


function add_data(email, name, company) {
  const list_id = selectedList.id;
    const temp = generateTempId();
    //compose data
    const data_to_add_to_add_list = {temp, email, name, company, list_id};


//add data to add list
    to_add.push(data_to_add_to_add_list);
    //also add it to the list of emails currently being displayed
    
    list_cache[list_id].push(data_to_add_to_add_list);
    console.log(list_cache);

    //find the real li ele here
    const li = document.createElement("li");
    append_email_element(li, name, email, company, temp);
    
}





const email_ele = document.getElementById("new-email");


  function addEntry() {
    //make sure the no emails is hidden
    document.querySelector('.no-email-tag')?.remove();

    const email = email_ele.value.trim();
    const name = document.getElementById("new-name").value.trim();
    const company = document.getElementById("new-company").value.trim();

    if (email.length == 0) {
      email_ele.classList.add('glow-error');
      email_ele.addEventListener('click' , () => {
        email_ele.classList.remove('glow-error');
      })
      return;
    }

    if (!validateEmail(email)) {
      ErrorModal('enter a valid email');
      return;
    }
    //get id
    add_data(email, name, company);
    //upates the 'count field'
    updateCount();
    clearInputs();
  }

  
  function append_email_element(li, name, email, company, id) {
    const list = document.getElementById("edit-list-emails");
  
    
    li.className = "bg-gray-800 px-4 mt-2 py-2 rounded flex justify-between items-center text-sm transition";
  
    li.innerHTML = `
      <div class="flex flex-col" data-name='${name || ''}' data-email='${email}' data-company='${company || ''}'>
        <p class="text-white font-medium">${email}</p>
        ${name || company ? `
          <p class="text-gray-400">${name || "(No Name)"}${company ? " • " + company : ""}</p>
        ` : ""}
      </div>
  
      <div class="flex gap-3 items-center">
        <button onclick="editEntry('${id}', this)" class="text-blue-400 hover:text-yellow-300" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="deleteEntry('${id}', this)" class="text-red-400 hover:text-red-300" title="Delete">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
  
    list.appendChild(li);
  }
  
  function editEntry(id, btnEl) {


    const list_id = selectedList.id;
    
    
    const list = list_cache[list_id];
    if (!list) return console.error("List not found");
    
    const isTempId = typeof id === "string" && id.startsWith("temp-");
    console.log(`is temp ${isTempId}, id : ${id}`);
    console.log(list_cache);
    const record = list.find(item => isTempId ? item.temp == id : item.id == id);
    if (!record) return console.error("Record not found");
  
    const { name, email, company } = record;
  
    const listItem = btnEl.closest("li");
    if (!listItem) return console.error("List item not found");
  
    // Store original HTML safely
    listItem.dataset.original = listItem.innerHTML;
  
    listItem.innerHTML = `
      <div class="w-full space-y-2 text-sm text-gray-300">
        <input type="email" 
               class=" edit-entry-field-email w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
               value="${email}" 
               placeholder="Email" />
  
        <div class="flex gap-2">
          <input type="text" 
                 class=" edit-entry-field-name flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-500"
                 value="${name || ''}" 
                 placeholder="Name (optional)" />
                 
          <input type="text" 
                 class="edit-entry-field-company flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-500"
                 value="${company || ''}" 
                 placeholder="Company (optional)" />
        </div>
  
        <div class="flex justify-end gap-3 pt-2">
          <button onclick="saveEditedEntry('${id}', this)" 
                  class="text-sm px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded">
            Save
          </button>
          <button onclick="cancelEntryEdit(this)" 
                  class="text-sm px-4 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded">
            Cancel
          </button>
        </div>
      </div>
    `;
  }
  
  function cancelEntryEdit(btnEl) {
    const listItem = btnEl.closest("li");
    const originalHTML = listItem?.dataset.original;
    if (originalHTML) {
      listItem.innerHTML = originalHTML;
    }
  }
  
  function saveEditedEntry(id , element) {


    const list_id = selectedList.id;


    //get field elements
    const listItem = element.closest("li");
    const email = listItem.querySelector(".edit-entry-field-email").value.trim();
    const name = listItem.querySelector(".edit-entry-field-name").value.trim();
    const company = listItem.querySelector(".edit-entry-field-company").value.trim();
    


    if (!validateEmail(email)) {
      ErrorModal('enter a valid email');
      return;
    }
    
    const updated_record = { list_id, email, name, company, id };

    // Determine if it's a temp ID or a permanent one
    const isTempId = typeof id === "string" && id.startsWith("temp-");

    // Get the list
    const list = list_cache[list_id];
    if (!list) return console.error("List not found in cache");

    // Find index of the existing record
    const index = list.findIndex(item => isTempId ? item.temp == id : item.id == id);
    if (index === -1) return console.error("Record not found in cache");

    // Update the record
    list[index] = { ...list[index], ...updated_record };


    //check if it is in to add if so just change it in there, if temp then check add 
    // is a [{}, {}, {}]
    
    if (isTempId) {
      //then change it in the to add ELSE add it to the update one
      const index_of_toAdd = to_add.findIndex(item => item.temp === id);
      if (index_of_toAdd === -1) return console.error("Record not found in to add");

      to_add[index_of_toAdd] = { ...list[index_of_toAdd], ...updated_record };
      
    }
    else {
      to_update.push(updated_record);
    }
    

    
    //render the proper one
    //add some confiumation animation here #################################
    append_email_element(listItem, name, email, company, id);

  }

  // simon is a lazy bitch that needs to lock the fuck in and actually get an app ready for his boss.

  function deleteEntry(id, ele) {
    const list_id = selectedList.id;

    const isTempId = typeof id === "string" && id.startsWith("temp-");
  
    const list = list_cache[list_id];
    if (!list) return console.error("List not found in cache");
  
    // Remove from list_cache
    const indexInCache = list.findIndex(item => isTempId ? item.temp == id : item.id == id);
    if (indexInCache === -1) return console.error("Record not found in list_cache");
    list.splice(indexInCache, 1);
  
    if (isTempId) {
      // Remove from to_add
      const indexInToAdd = to_add.findIndex(item => item.temp == id);
      if (indexInToAdd === -1) return console.error("Record not found in to_add");
      to_add.splice(indexInToAdd, 1);
    } else {
      // Add to to_delete
      if (!to_delete.includes(id)) {
        to_delete.push(id);
      }
    }
  
    // Remove DOM element if provided
    ele.closest('li').remove();
  
    updateCount();
  }
  

  function generateTempId() {
    return 'temp-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
  }

  function updateCount() {
    // Count how many <li> elements are inside #edit-list-emails
    const count = document.querySelectorAll("#edit-list-emails > li").length;
  
    // Get the selected list ID
    const list_id = selectedList.id;
  
    // Update the count in the list_headers object
    const header = list_headers.find(l => l.id === list_id);
    if (header) {
     header.count = count;
    } else {
      console.warn(`List header not found for ID ${list_id}`);
    }
    render_ListsTable();
    renderListsTable();
    // Update the UI element showing the count
    document.getElementById("edit-list-count").textContent = count;

    return count;
  }
  

  function clearInputs() {
    document.getElementById("new-email").value = "";
    document.getElementById("new-name").value = "";
    document.getElementById("new-company").value = "";
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


