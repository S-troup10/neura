

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


//malke sure user does not enter a past date
const startDateInput = document.getElementById('startDate');

const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
startDateInput.setAttribute('min', today);

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

// Function to handle form submission (for adding campaign)
document.getElementById('addCampaignForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally
    const ele = document.getElementById('appPassword');
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
    if (ele.value.length != 16) {
        ele.classList.add('glow-error');
        fieldsFilled = false;
        ele.classList.add('glow-error');
        ele.addEventListener('click', () => {
            ele.classList.remove('glow-error');
        });
        error.textContent = 'app password must be 16 characters';
        error.style.display = 'block';

    }

    if (fieldsFilled) {
            // Get form data
            const name = document.getElementById('campaignName').value;
            const email_incriments = document.getElementById('emailDelay').value;
            const statusValue = document.getElementById('campaignStatus').value;
            const paused = statusValue.toLowerCase() !== 'paused';
            const start_date = document.getElementById('startDate').value;
            const email = document.getElementById('email').value;
            const app_password = document.getElementById('appPassword').value;

        
        const campaignData = {
           
            name,
            email_incriments,
            paused,
            start_date,
            email,
            app_password
        };
        
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
                add_new_campaign(campaignData);
                document.getElementById('addCampaignForm').reset();
                goToFirstSection();
                closeCampaignModal();

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

