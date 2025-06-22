


let currentEdit = null;

const backButton = document.getElementById('backb');
function openCampaignDetails(campaignCard) {
  currentEdit = campaignCard;

  const campaignList = document.getElementById("campaignList");
  const campaignDetails = document.getElementById("campaignDetails");
  const backButton = document.getElementById("backb");
  const campaignTitle = document.getElementById('detailTitle');
  const titleSection = document.getElementById('back-title-section');

  const filter = document.getElementById('filter');

  // Animate filter out (hide)
  filter.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
  filter.classList.add('opacity-0', 'scale-95', 'pointer-events-none');

  setTimeout(() => {
    filter.classList.add('hidden');
  }, 300);



  // Animate campaign list out
  campaignList.classList.remove('opacity-100', 'scale-100', 'translate-x-0');
  campaignList.classList.add('opacity-0', 'scale-95'); // remove translate-x here

  setTimeout(() => {
  campaignList.classList.add('pointer-events-none', 'hidden');

  backButton.classList.remove('opacity-0', 'pointer-events-none');
  backButton.classList.add('opacity-100');
  titleSection.classList.remove('hidden');
  titleSection.classList.add('flex');

  campaignDetails.classList.remove('opacity-0', 'translate-x-10', 'scale-95', 'pointer-events-none');
  campaignDetails.classList.add('opacity-100', 'translate-x-0', 'scale-100');

  campaignTitle.classList.remove('hidden');
  campaignTitle.addEventListener('click', () => title_into_input(campaignTitle));
  }, 301);

  // Animate campaign details in
  

  // Animate back button in


  // Show title section after a slight delay (optional for smoothness)













  // Populate data as before...
  const isElement = campaignCard instanceof HTMLElement;
  const name = isElement ? campaignCard.getAttribute('data-name') : campaignCard.name;
  const paused = isElement ? campaignCard.getAttribute('data-paused') === 'true' : !!campaignCard.paused;
  const schedule = isElement ? JSON.parse(campaignCard.getAttribute('data-schedule') || '[]') : campaignCard.schedule || [];
  const list_id = isElement ? JSON.parse(campaignCard.getAttribute('data-list_id') || '[]') : campaignCard.list_id || [];
  const subject = isElement ? campaignCard.getAttribute('data-subject') : campaignCard.subject || '';
  const body = isElement ? campaignCard.getAttribute('data-body') : campaignCard.body || '';

  campaignTitle.textContent = name;
  setSelectedDates(schedule);
  render_ListsTable();
  apply_selected_ids_to_list(list_id);
  document.getElementById("check-paused").checked = paused;
  document.getElementById('email-subject').value = subject;

  
if (/<style[\s\S]*?>[\s\S]*?<\/style>/.test(body)) {
  Toggle_quill(false);
  console.log('returned true, switch to grapes js');
}
else {
  Toggle_quill(true);
}

  
  quill.root.innerHTML = body;
  setEmailHtml(body);

  setTimeout(() => {

    showTab('emailTab');
  }, 350);
}


function backToCampaignList() {
  const details = document.getElementById('campaignDetails');
  const list = document.getElementById('campaignList');
  const backButton = document.getElementById('backb');
  const title = document.getElementById('detailTitle');
  const tabContents = document.querySelectorAll('.tab-content');
  const filter = document.getElementById('filter');
  const titleSection = document.getElementById('back-title-section');

  // Animate campaignDetails out
  details.classList.remove('opacity-100', 'translate-x-0', 'scale-100');
  details.classList.add('opacity-0', 'translate-x-10', 'scale-95');

  // After animation finishes, hide and disable interaction
  setTimeout(() => {
    details.classList.add('pointer-events-none');
  }, 300);



  // Show filter before animation
  filter.classList.remove('hidden', 'pointer-events-none', 'opacity-0', 'scale-95');

  // Force reflow
  void filter.offsetWidth;

  // Animate filter in
  filter.classList.add('opacity-100');


  // Reveal campaignList smoothly
  list.classList.remove('hidden', 'pointer-events-none');
  void list.offsetWidth; // trigger reflow

  list.classList.remove('opacity-0', 'scale-95', 'translate-x-[-10px]');
  list.classList.add('opacity-100', 'scale-100', 'translate-x-0', 'pointer-events-auto');

  // Hide title section with animation
  titleSection.classList.remove('flex');
  // Optional: fade out before hiding
  titleSection.classList.add('opacity-0');
  
    titleSection.classList.add('hidden');
    titleSection.classList.remove('opacity-0');
  

  // Hide back button
  backButton.classList.add('opacity-0', 'pointer-events-none');
  backButton.classList.remove('opacity-100');

  // Hide title
  title.classList.add('hidden');

  // Hide all tab content
  tabContents.forEach(tab => {
    tab.classList.add('hidden', 'opacity-0');
    tab.classList.remove('opacity-100');
  });
}



function title_into_input(ele) {
  const currentText = ele.textContent.trim();

  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentText;

  // Copy font styling but strip bold gradient effects
  input.className = ele.className;
  input.classList.remove(
    'bg-gradient-to-r',
    'from-blue-400',
    'to-purple-500',
    'text-transparent',
    'bg-clip-text'
  );

  // Add subtle inline styles
  input.style.background = 'transparent';
  input.style.border = 'none';
  input.style.outline = 'none';
  input.style.fontSize = '1.5rem'; // roughly text-2xl
  input.style.fontWeight = 'bold';
  input.style.marginLeft = '1rem';
  input.style.color = '#FAF9F6';

  input.addEventListener('blur', () => {
    const newText = input.value.trim() || 'Untitled';
    ele.textContent = newText;

    // Reapply gradient classes
    ele.classList.add(
      'bg-gradient-to-r',
      'from-blue-400',
      'to-purple-500',
      'text-transparent',
      'bg-clip-text'
    );

    input.replaceWith(ele);
  });
 
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') input.blur();
  });

  ele.replaceWith(input);
  input.focus();
}


//code to managhe the editing of campigns including setting an email and determining the list of people to send it to 
function showTab(tabId) {
  // Hide all tabs by adding 'hidden' and removing opacity
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.add('hidden');
    tab.classList.remove('opacity-100');
    tab.classList.add('opacity-0');
  });

  // Show the selected tab by removing 'hidden' and adding opacity
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.classList.remove('hidden');
    setTimeout(() => {
      selectedTab.classList.add('opacity-100'); // Fade in the active tab
    }, 10);  // Small delay to trigger opacity transition
  }

  // Optionally: Activate the corresponding tab button
  document.querySelectorAll('.tab--button').forEach(btn => {
    if (btn.getAttribute('onclick')?.includes(tabId)) {
      btn.classList.add('active-tab');
    } else {
      btn.classList.remove('active-tab');
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
      setTimeout( () => {openAddListModal();}, 1200);
      
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




function saveEditedCampaign() {
  loader.style.display = 'flex';

  const subject = document.getElementById('email-subject').value;

let body = null;
// if quill 
  if (is_quill == true) {
    body = quill.root.innerHTML;
  }
  else {
    body = getEmailHtml();
  }
  console.log('body : ', body, '|  status :', is_quill);



  const paused = document.getElementById('check-paused').checked;

  const list = selectedListId ? JSON.stringify(selectedListId) : JSON.stringify([]);

  const id = currentEdit instanceof HTMLElement ? currentEdit.getAttribute('data-id') : currentEdit.id;
  const name = document.getElementById('detailTitle').innerText;
  const user_id = USER_DETAILS.id;

  // ✅ Use confirmDates to process the schedule changes
  const schedule = confirmDates(id);

  const campaignData = {
    id,
    name,
    subject,
    body,
    list_id: list,
    paused,
    user_id
  };

  const data_to_server = {
    campaign: campaignData,
    schedule: schedule
  };

  console.log('Sending schedule:', schedule);

  fetch('/api/save_campaign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data_to_server)
  })
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
  })
  .then(responseData => {
    if (responseData.success === true) {
      if (currentEdit) {
        currentEdit.setAttribute('data-name', campaignData.name);
        currentEdit.setAttribute('data-subject', campaignData.subject);
        currentEdit.setAttribute('data-body', campaignData.body);
        currentEdit.setAttribute('data-list_id', campaignData.list_id);
        currentEdit.setAttribute('data-paused', campaignData.paused);
        //campaignData.schedule = return_server_like_schedule(id); //here pass in the data in the same vaaion as the servrer
        console.log('sever returniong ', responseData.data);
        campaignData.schedule = responseData.data;
        currentEdit.setAttribute('data-schedule', JSON.stringify(campaignData.schedule));
        resetScheduleTracking();

        currentEdit.innerHTML = generateCampaignCardHTML(campaignData);
        backToCampaignList();
        showToast('Campaign Saved Successfully');
        render_next_send();
      }
    } else {
      console.log('Server responded with error:', responseData.error);
    }
    loader.style.display = 'none';
  })
  .catch(error => {
    console.error('Error updating campaign:', error);
    loader.style.display = 'none';
  });
}

