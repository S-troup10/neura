function add_new_campaign(data) {
    
    const campaignList = document.getElementById('campaignList');
   
    const campaignCard = document.createElement('div');
    campaignCard.className = "bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-purple-500/30 cursor-pointer transition-all duration-300 max-h-[180px] overflow-hidden";
  
    // Save extra data using data attributes
    campaignCard.setAttribute('data-list_id', data.list_id);
    campaignCard.setAttribute('data-name', data.name);
    campaignCard.setAttribute('data-subject', data.subject);
    campaignCard.setAttribute('data-body', data.body);
    campaignCard.setAttribute('data-email', data.email);
    campaignCard.setAttribute('data-schedule', JSON.stringify(data.schedule));
    campaignCard.setAttribute('data-paused', data.paused);
    campaignCard.setAttribute('data-id', data.id);
  
    campaignCard.onclick = function () {
      openCampaignDetails(campaignCard);
    };
    
    

    campaignCard.innerHTML = generateCampaignCardHTML(data); // <<== Here!
  
    const ele = campaignList.appendChild(campaignCard);
    return ele;
  }
  

//fetch data from the serever

function populate_campaigns() {

            if (Array.isArray(MAIN_DETAILS.campaigns)) {

              if (MAIN_DETAILS.campaigns.length == 0) {
                console.log(MAIN_DETAILS.campaigns);
                
                display_no_campaign_message();
                

              }
                // Proceed with adding campaigns if data is an array
                
                MAIN_DETAILS.campaigns.forEach(element => {
                   
                    add_new_campaign(element);
                });
                
            } else {
                console.error('Expected an array, but received:', MAIN_DETAILS.campaigns);
            }
}


function display_no_campaign_message() {
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


function generateCampaignCardHTML(data) {


  const status = data.paused ? 'Paused' : 'Running';
  const colour = status === 'Paused' ? 'bg-orange-400 text-white' : 'bg-green-500 text-white';

  let dates = data.schedule;

 

  let nextDateDisplay = "No upcoming date"; // Default value
  console.log(dates)
  // Check if there are dates available
  if (dates.length > 0) {
    // Sort the dates array
    dates.sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));
  
    nextDate = dates[0];
    
    // Get the next date (first in the sorted list)

// Create a Date object using individual parts
    const dateObj = new Date(nextDate.scheduled_time);

    nextDateDisplay = dateObj.toLocaleString(undefined, {
      weekday: 'short', // Short weekday (e.g., 'Tue')
      month: 'short',   // Short month (e.g., 'Apr')
      day: 'numeric',   // Numeric day (e.g., '29')
      hour: '2-digit',  // Two-digit hour (e.g., '09')
      minute: '2-digit' // Two-digit minute (e.g., '00')
    }); // Example output: "Tue, Apr 29, 9:00 AM"
  } else {
    
  }
  
  const list_ids = JSON.parse(data.list_id);

  const total_count = getRecipientCount(list_ids);


const recipientsCount = total_count; // Replace with actual dynamic count


 



return `
 <div class="text-white rounded-xl p-4 w-80 bg-gray-800 transition-all duration-300">


  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
    <h2 class="text-lg sm:text-xl font-semibold truncate flex items-center">
      <i class="fas fa-bullhorn text-blue-400 mr-2"></i>
      <span class="truncate">${data.name}</span>
    </h2>
    <span class="px-3 py-1 rounded-full text-xs font-semibold ${colour} whitespace-nowrap">
      <i class="fas ${status === 'Paused' ? 'fa-pause-circle' : 'fa-play-circle'} mr-1"></i>${status}
    </span>
  </div>

  <div class="mt-3 space-y-2 text-sm">
    <div class="flex items-center">
      <i class="fas fa-calendar-alt text-gray-300 mr-2"></i>
      <span class="flex-1">Next Send: <span class="font-medium">${nextDateDisplay}</span></span>
    </div>
    <div class="flex items-center text-gray-400 text-xs">
      <i class="fas fa-users mr-2"></i>
      <span>${recipientsCount} recipient${recipientsCount !== 1 ? 's' : ''}</span>
    </div>
  </div>
</div>

`;

}


function getRecipientCount(list_ids) {
  if (!Array.isArray(list_ids) || !Array.isArray(list_headers) || list_headers.length === 0) {
    return 0;
  }

  return list_ids.reduce((total, rawId) => {
    const id = parseInt(rawId);
    if (isNaN(id)) return total;

    const list = list_headers.find(header => parseInt(header.id) === id);
    return total + (list?.count || 0);
  }, 0);
}





