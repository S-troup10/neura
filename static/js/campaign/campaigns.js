//if no campagns then set somthing there 




// Function to open the modal
function openCampaignModal() {
    const modal = document.getElementById('addCampaignModal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.querySelector('#addCampaignModalContent').classList.remove('opacity-0', 'scale-95');
    }, 10);
}

// Function to close the modal
function closeCampaignModal() {
    const modal = document.getElementById('addCampaignModal');
    modal.querySelector('#addCampaignModalContent').classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // Match the transition duration
}


// Function to navigate to the next section
function nextSection(section) {
    // Hide current section

    //check if elements are filled out first

    let _continue = true
    const currentSection = document.querySelector('.form-section:not(.hidden)');
    const fields = currentSection.querySelectorAll('input, textarea');
    fields.forEach(field => {
        if (field.value.length == 0) {
            _continue = false
            field.classList.add('glow-error');

            //when clicked it will return to normal
            field.addEventListener('click', () => {
                field.classList.remove('glow-error');
            });
        }
      });
    
    if (_continue) {
        currentSection.classList.add('hidden');
    
    // Show next section
    const nextSection = document.getElementById('section' + section);
    nextSection.classList.remove('hidden');
    }
    
}



// Function to navigate to the previous section
function prevSection(section) {
    // Hide current section
    const currentSection = document.querySelector('.form-section:not(.hidden)');
    currentSection.classList.add('hidden');
    
    // Show previous section
    const prevSection = document.getElementById('section' + section);
    prevSection.classList.remove('hidden');
}


function goToFirstSection() {
    // Hide currently visible section
    const currentSection = document.querySelector('.form-section:not(.hidden)');
    if (currentSection) {
        currentSection.classList.add('hidden');
    }

    // Show the first section (assuming its id is 'section1')
    const firstSection = document.getElementById('section1');
    if (firstSection) {
        firstSection.classList.remove('hidden');
    }
}
const error = document.getElementById('campaign-error');


function objectToCampaignCard(campaignData) {
    const el = document.createElement('div');
    el.setAttribute('data-id', campaignData.id || '');
    el.setAttribute('data-name', campaignData.name || '');
    el.setAttribute('data-paused', campaignData.paused ? 'true' : 'false');
    el.setAttribute('data-dates', JSON.stringify(campaignData.dates || []));
    el.setAttribute('data-subject', campaignData.subject || '');
    el.setAttribute('data-body', campaignData.body || '');
    return el;
  }
  


// Function to handle form submission (for adding campaign)
document.getElementById('addCampaignForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally
    const ele = document.getElementById('appPasswordContainer');
    const currentSection = document.querySelector('.form-section:not(.hidden)');
    let fieldsFilled = true;
    //check to make sure 
    const fields = currentSection.querySelectorAll('input, textarea');
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

    for (let child of ele.children) {
        if (child.value.length == 0) {
            child.classList.add('glow-error');
            fieldsFilled = false;
            child.classList.add('glow-error');
                child.addEventListener('click', () => {
                    for (let child of ele.children) {

                        child.classList.remove('glow-error');
                    }
        });
        }

    }
    

    if (fieldsFilled) {
            // Get form data
            const name = document.getElementById('campaignName').value;

            const statusValue = document.getElementById('campaignStatus').value;
            const paused = statusValue.toLowerCase() !== 'paused';

            const email = document.getElementById('email').value;
            let app_password = '';

            document.querySelectorAll('.single-inputs').forEach( item => {

                app_password += item.value;
            })
            
            
            

        
        let campaignData = {
           
            name,
            list_id: null,
            paused,
            subject: '', 
            body : '<p><br></p>', 
            dates: JSON.stringify([]), 
            email,
            app_password
        };
        console.log(campaignData);
        const loader = document.getElementById('loader');


        //show loader
        loader.style.display = 'flex';
        fetch('/add_campaign', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(campaignData) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            //if sucsess ful 
            if (data.success) {
                //add a new campain element only when server has confimred upload to db
                error.style.display = 'none';

                campaignData.id  = data.campaign_id;
                if (campaignData.paused) {
                    campaignData.paused = 0;
                }
                else {
                    campaignData.paused = 1;
                }
                add_new_campaign(campaignData);
                document.getElementById('addCampaignForm').reset();
                goToFirstSection();
                closeCampaignModal();
                backToCampaignList();
                openCampaignDetails(objectToCampaignCard(campaignData));

            } 
            //on fail
            else {
                error.textContent = 'error : ' + data.error;
                error.style.display = 'block';

            }
            loader.style.display = 'none';

        })

        

        //send to server for saving
        // Close the modal after submission
        
    }
    
});

function createPasswordInputs() {
    const container = document.getElementById('appPasswordContainer');
    container.innerHTML = ''; // Clear previous inputs

    for (let i = 0; i < 16; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.className = "single-inputs w-[6.25%] h-10 text-center bg-transparent text-gray-200 text-lg focus:outline-none border-b border-gray-600";

        // Add extra margin after every 4th input (except the last one)
        if (i % 4 === 3 && i !== 15) {
            input.style.marginRight = '1.5rem'; // adjust the space as you like
        }

        // Auto focus next input
        input.addEventListener('input', function () {
            if (input.value.length === 1 && input.nextElementSibling) {
                input.nextElementSibling.focus();
            }
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && input.value === '' && input.previousElementSibling) {
                input.previousElementSibling.focus();
            }
        });

        container.appendChild(input);
    }
}

createPasswordInputs();



