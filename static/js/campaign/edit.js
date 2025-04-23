
const backButton = document.getElementById('backb');
function openCampaignDetails(data) {
  // Hide the list of campaigns
  console.log(data);
  const campaignList = document.getElementById("campaignList");
  campaignList.classList.add("hidden");
  backButton.style.opacity = '1';

  // Show the campaign details
  const details = document.getElementById("campaignDetails");
  details.classList.remove("hidden");
  showTab('emailTab');

  // Dynamically update the campaign name and other details
  const campaignTitle = document.getElementById('detailTitle');
  campaignTitle.textContent = data.name;

  document.getElementById("campaign-delay").value = data.email_incriments;
  document.getElementById("campaign-paused").value = data.paused ? "Paused" : "Running";
  document.getElementById("campaign-date").value = data.start_date;
}

function backToCampaignList() {
  // Show the list of campaigns
  const campaignList = document.getElementById("campaignList");
  campaignList.classList.remove("hidden");
  backButton.style.opacity = '0';
  // Hide the campaign details
  const details = document.getElementById("campaignDetails");
  details.classList.add("hidden");
}

//code to managhe the editing of campigns including setting an email and determining the list of people to send it to 
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.add('hidden');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active-tab');
    });
    document.getElementById(tabId).classList.remove('hidden');
    event.target.classList.add('active-tab');
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
  






//list section
const methodSelect = document.getElementById("input-method");
const sections = {
  saved: document.getElementById("saved-section"),
  upload: document.getElementById("upload-section"),
  manual: document.getElementById("manual-section"),
};

const allRecipients = [];

methodSelect.addEventListener("change", function () {
  const selected = this.value;
  for (const [key, section] of Object.entries(sections)) {
    section.classList.toggle("hidden", key !== selected);
  }
});

function updateRecipientTable() {
  const tableBody = document.getElementById("all-recipient-table-body");
  tableBody.innerHTML = "";

  if (allRecipients.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-gray-400">No recipients added.</td></tr>`;
    return;
  }

  allRecipients.forEach(({ name, email, company }) => {
    const tr = document.createElement("tr");
    tr.className = "border-b border-gray-700";
    tr.innerHTML = `
      <td class="py-2 px-3">${name || "-"}</td>
      <td class="py-2 px-3">${email}</td>
      <td class="py-2 px-3">${company || "-"}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// Manual Entry
function addManualRecipient() {
  const name = document.getElementById("manual-name").value;
  const email = document.getElementById("manual-email").value;
  const company = document.getElementById("manual-company").value;

  if (!email || !email.includes("@")) {
    alert("Please enter a valid email.");
    return;
  }

  allRecipients.push({ name, email, company });
  updateRecipientTable();

  // Clear fields
  document.getElementById("manual-name").value = "";
  document.getElementById("manual-email").value = "";
  document.getElementById("manual-company").value = "";
}

// CSV Upload
document.getElementById("csv-upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  document.getElementById("csv-file-name").innerText = "Uploaded: " + file.name;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      const validRows = results.data.filter(row => row.email && row.email.includes("@"));
      validRows.forEach(row => {
        allRecipients.push({
          name: row.name || "-",
          email: row.email,
          company: row.company || "-"
        });
      });
      updateRecipientTable();
    }
  });
});

// Mock Saved List
function handleSavedList(listName) {
  if (listName === "sample") {
    allRecipients.push(
      { name: "Alice Smith", email: "alice@example.com", company: "Alpha Co." },
      { name: "Bob Johnson", email: "bob@example.com", company: "Beta Ltd." }
    );
    updateRecipientTable();
  }
}





function saveEmailList() {
  const rows = document.querySelectorAll('#all-recipient-table-body tr');
  const recipients = [];

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const name = cells[0]?.textContent.trim();
    const email = cells[1]?.textContent.trim();
    const company = cells[2]?.textContent.trim();
  });


  const emailList = recipients;

  console.log("Saved List:", emailList);
  alert("Email list saved successfully!");
  
  // Optional: send to backend here using fetch/AJAX
  // fetch('/save-list', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(emailList)
  // });
}

function saveEditedCampaign() {
    const emailList = saveEmailList()
    const subject = document.getElementById('email-subject');
    const body = quill.root.innerHTML;

}
