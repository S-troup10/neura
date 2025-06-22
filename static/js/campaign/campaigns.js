//if no campagns then set somthing there 

  let isPaused = true;

  function togglePausedStatus() {
    isPaused = !isPaused;

    const btn = document.getElementById("pauseToggleBtn");
    const text = document.getElementById("statusText");
    const icon = document.getElementById("statusIcon");

    if (isPaused) {
      text.textContent = "Paused";
      icon.className = "fas fa-pause";
      btn.classList.remove("bg-green-600", "hover:bg-green-500");
      btn.classList.add("bg-blue-700", "hover:bg-blue-600");
    } else {
      text.textContent = "Active";
      icon.className = "fas fa-play";
      btn.classList.remove("bg-blue-700", "hover:bg-blue-600");
      btn.classList.add("bg-green-600", "hover:bg-green-500");
    }
  }

  function getPausedStatus() {
    return isPaused;
  }

  function openCampaignModal() {
    const modal = document.getElementById("addCampaignModal");
    const container = document.getElementById("campaignModalContainer");

    modal.classList.remove("hidden");
    requestAnimationFrame(() => {
      container.classList.remove("scale-90", "opacity-0");
      container.classList.add("scale-100", "opacity-100");
    });
  }

  function closeCampaignModal() {
    const modal = document.getElementById("addCampaignModal");
    const container = document.getElementById("campaignModalContainer");

    container.classList.remove("scale-100", "opacity-100");
    container.classList.add("scale-90", "opacity-0");

    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  }






function objectToCampaignCard(campaignData) {
    const el = document.createElement('div');
    el.setAttribute('data-id', campaignData.id || '');
    el.setAttribute('data-name', campaignData.name || '');
    el.setAttribute('data-paused', campaignData.paused ? 'true' : 'false');
    el.setAttribute('data-schedule', []);
    el.setAttribute('data-subject', campaignData.subject || '');
    el.setAttribute('data-body', campaignData.body || '');
    return el;
  }
  


// Function to handle form submission (for adding campaign)
function submitNewCampaign() {

    let fieldsFilled = true;
    //check to make sure 
    const fields = document.getElementById('addCampaignModal').querySelectorAll('input');
    fields.forEach(field => {
        if (field.value.length == 0) {
           
            field.classList.add('glow-error');
            fieldsFilled = false;
            //when clicked it will return to normal
            field.addEventListener('click', () => {
                field.classList.remove('glow-error');
            });
        }
    });

    

    if (fieldsFilled) {
            document.getElementById('loader').style.display = 'flex';
            // Get form data
            const name = document.getElementById('campaignName').value;

            const paused = getPausedStatus()




            
            
            

        
        let campaignData = {
           
            name,
            list_id: JSON.stringify([]),
            paused,
            subject: '', 
            body : '<p><br></p>', 
             
        };
        console.log(campaignData);

        fetch('/add_campaign', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(campaignData) 
        })
        .then(response => {
            if (!response.ok) {
              document.getElementById('loader').style.display = 'none';
              showToast('an error occurred', false);
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            //if sucsess ful 
            if (data.success) {
                //add a new campain element only when server has confimred upload to db
              

                campaignData.id  = data.campaign_id;
           
                campaignData.schedule = [];
                const ele = add_new_campaign(campaignData);
                document.getElementById('campaignName').value = '';
                
                //HIDE THE NO CAMPIGNS MESSAGE


                closeCampaignModal();
                backToCampaignList();
                showToast('Campaign Created Successfully');
                setTimeout(() => {
                    openCampaignDetails(ele);
                    document.getElementById('loader').style.display = 'none';
                }, 500);


            } 
            //on fail
            else {
                document.getElementById('loader').style.display = 'none';
                console.log(data.error);
                showToast('error : ' + data.error);

            }
        })
        //send to server for saving
        // Close the modal after submission
    }
    
};




// Filter campaigns on input changes
function applyFilters() {
  const statusFilter = document.getElementById('filterStatus').value;
  const nameFilter = document.getElementById('filterName').value.toLowerCase();
  const minRecipients = parseInt(document.getElementById('filterMinRecipients').value) || 0;

  const campaignList = document.getElementById('campaignList');
  const campaigns = campaignList.children;

  for (const campaignCard of campaigns) {
    // Get campaign details from data attributes
    const paused = campaignCard.getAttribute('data-paused') === 'true';
    const name = campaignCard.getAttribute('data-name').toLowerCase();
    const list_id = JSON.parse(campaignCard.getAttribute('data-list_id'));
    const recipientsCount = getRecipientCount(list_id);

    // Status filter
    let statusMatch = (statusFilter === 'all') ||
                      (statusFilter === 'paused' && paused) ||
                      (statusFilter === 'running' && !paused);

    // Name filter
    let nameMatch = name.includes(nameFilter);

    // Recipients count filter
    let recipientsMatch = recipientsCount >= minRecipients;

    // Show or hide campaign card
    if (statusMatch && nameMatch && recipientsMatch) {
      campaignCard.style.display = '';
    } else {
      campaignCard.style.display = 'none';
    }
  }
}

// Hook events to filters
document.getElementById('filterStatus').addEventListener('change', applyFilters);
document.getElementById('filterName').addEventListener('input', applyFilters);
document.getElementById('filterMinRecipients').addEventListener('input', applyFilters);




function deleteCampaign() {
    //get current id
    
    const id = currentEdit.getAttribute('data-id');

    if (!id) {return ErrorModal('no id found');}
    showConfirmation({
      title: "Delete Campaign",
      message: "This will permanently delete the campaign and cancel any scheduled emails. Are you sure you want to proceed?",
      onConfirm: () => {
        proceedDelete(id);
      }
    });
}

function proceedDelete(id) {
    loader.style.display = 'flex';
    const data = {table: 'campaigns', id: id};
    
    fetch('/api/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) 
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            //if sucsess ful 
            if (data.success) {
                //remove it from campaigns , and go back to campaiogn list 
                const campaignList = document.getElementById('campaignList');
                const element = campaignList.querySelector(`[data-id="${id}"]`);

                if (element) {
                element.remove();
                //here if there is no other ele in campaign list show
                    if (campaignList.children.length == 0){

                    display_no_campaign_message();
                } 
                }


                backToCampaignList();
                 showToast('Deleted Successfully');


            }
            else {
                ErrorModal(data.error);
            }
            loader.style.display = 'none';
    })
}
