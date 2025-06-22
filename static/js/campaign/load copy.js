function add_new_campaign(data) {
    
    const campaignList = document.getElementById('campaignList');
   
    const campaignCard = document.createElement('div');
    campaignCard.className = "bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-purple-500/30 cursor-pointer transition-all duration-300";
  
    // Save extra data using data attributes
    campaignCard.setAttribute('data-list_id', data.list_id);
    campaignCard.setAttribute('data-name', data.name);
    campaignCard.setAttribute('data-subject', data.subject);
    campaignCard.setAttribute('data-body', data.body);
    campaignCard.setAttribute('data-email', data.email);
    campaignCard.setAttribute('data-dates', JSON.stringify(data.dates));
    campaignCard.setAttribute('data-paused', data.paused);
    campaignCard.setAttribute('data-id', data.id);
  
    campaignCard.onclick = function () {
      openCampaignDetails(campaignCard);
    };
    
    

    campaignCard.innerHTML = generateCampaignCardHTML(data); // <<== Here!
  
    campaignList.appendChild(campaignCard);
  }
  

//fetch data from the serever

function populate_campaigns() {
    fetch('/campaigns')
        .then(res => res.json())
        .then(data => {
            
            if (Array.isArray(data.data)) {

              if (data.data.length == 0) {
                console.log(data.data);
                const campaignList = document.getElementById('campaignList');
                campaignList.innerHTML = '';
                const message = document.createElement('div');
                message.id = 'msg';
                message.className = 'col-span-full w-full flex justify-center items-center py-16';
              
                message.innerHTML = `
                  <div class="text-center text-gray-400">
                    <h2 class="text-xl font-semibold mb-2">No Campaigns Found</h2>
                    <p class="text-sm">You haven’t created any campaigns yet. Click the + button to get started.</p>
                  </div>
                `;
              
                campaignList.appendChild(message);

                

              }
                // Proceed with adding campaigns if data is an array
                
                data.data.forEach(element => {
                    
                    add_new_campaign(element);
                });
                
            } else {
                console.error('Expected an array, but received:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching campaigns:', error);
        });
}


populate_campaigns();


function generateCampaignCardHTML(data) {


  const status = data.paused ? 'Paused' : 'Running';
  const colour = status === 'Paused' ? 'bg-orange-400 text-black' : 'bg-green-500 text-white';

  let dates = JSON.parse(data.dates);

  let nextDateDisplay = "No upcoming date"; // Default value
  
  // Check if there are dates available
  if (dates.length > 0) {
    // Sort the dates array
    dates.sort((a, b) => new Date(a) - new Date(b));
  
    // Get the next date (first in the sorted list)
    const nextDate = dates[0];
  
    // Format the next date
    const dateObj = new Date(nextDate);
    nextDateDisplay = dateObj.toLocaleString(undefined, {
      weekday: 'short', // Short weekday (e.g., 'Tue')
      month: 'short',   // Short month (e.g., 'Apr')
      day: 'numeric',   // Numeric day (e.g., '29')
      hour: '2-digit',  // Two-digit hour (e.g., '09')
      minute: '2-digit' // Two-digit minute (e.g., '00')
    }); // Example output: "Tue, Apr 29, 9:00 AM"
  } else {
    
  }
  
  static/js/campaign/load.js
  const list_ids = JSON.parse(data.list_id);
  console.log(list_ids);
  const total_count = getRecipientCount(list_ids);


const recipientsCount = total_count; // Replace with actual dynamic count
const missingRecipients = recipientsCount === 0;
const missingDate = !data.dates;

let actionMessage = "";
if (missingRecipients && missingDate) {
  actionMessage = "Add recipients and set a date.";
} else if (missingRecipients) {
  actionMessage = "Add recipients.";
} else if (missingDate) {
  actionMessage = "Set a date.";
}

const actionNeeded = !!actionMessage;

return `
  <div class="text-white rounded-xl p-5 w-full max-w-md">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-xl font-semibold truncate">
        <i class="fas fa-bullhorn text-blue-400 mr-2"></i>${data.name}
      </h2>
      <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${colour}">
        <i class="fas ${status === 'Paused' ? 'fa-pause-circle' : 'fa-play-circle'} mr-1"></i>${status}
      </span>
    </div>

    ${actionNeeded ? `
      <div class="flex items-center text-red-400 font-medium text-sm mt-3">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        ${actionMessage}
      </div>
    ` : `
      <div class="mt-3 space-y-1 text-sm">
        <div class="flex items-center">
          <i class="fas fa-calendar-alt text-gray-300 mr-2"></i>
          <span>Next Send: <span class="font-medium">${nextDateDisplay}</span></span>
        </div>
        <div class="flex items-center text-gray-400 text-xs">
          <i class="fas fa-users mr-2"></i>
          ${recipientsCount} recipient${recipientsCount !== 1 ? 's' : ''}
        </div>
      </div>
    `}
  </div>
`;

}


function getRecipientCount(list_ids) {
  console.log(list_ids);
  return list_ids.reduce((total, id) => {
    const list = list_headers.find(l => l.id === id);
    return total + (list?.count || 0);
  }, 0);
}
