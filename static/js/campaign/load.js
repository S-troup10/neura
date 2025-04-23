
function add_new_campaign(data) {
    const campaignList = document.getElementById('campaignList');
  
    const campaignCard = document.createElement('div');
    campaignCard.className = "bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg hover:shadow-purple-500/30 cursor-pointer transition-all duration-300";
    
    // Save extra data using data attributes

    campaignCard.setAttribute('data-name', data.name);
    campaignCard.setAttribute('data-email', data.email);
    campaignCard.setAttribute('data-email_incriments', data.email_incriments);
    campaignCard.setAttribute('data-start_date', data.start_date);
    campaignCard.setAttribute('data-paused', data.paused);
    
    campaignCard.onclick = function () {
        openCampaignDetails(data);
    };
  
    // Determine status and colour based on paused value
    const status = data.paused == 1 ? 'Paused' : 'Running';
    let colour = status === 'Paused' ? 'text-yellow-400' : 'text-green-400';
  
    campaignCard.innerHTML = `
        <h2 class="text-xl font-semibold mb-2">${data.name}</h2>
        <p class="text-sm text-gray-400 mb-1">Status: <span class="${colour}">${status}</span></p>
        <div class="flex justify-between text-sm text-gray-400">
            <p>Delay: ${data.email_incriments}s</p>
            <p class="text-xs text-gray-500">Start: ${data.start_date}</p>
        </div>
    `;
    
    campaignList.appendChild(campaignCard);
  }
  
//fetch data from the serever

function populate_campaigns() {
    fetch('/campaigns')
        .then(res => res.json())
        .then(data => {
            
            if (Array.isArray(data.data)) {
                // Proceed with adding campaigns if data is an array
                data.data.forEach(element => {
                    console.log(element); // Log each campaign to inspect
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
