let currentScreen = 'dashboard';

const screens = {
  dashboard: document.getElementById('dashboard'),
  campaigns: document.getElementById('campaigns'),
  analytics: document.getElementById('analytics'),
  settings: document.getElementById('settings'),
  lists: document.getElementById('list')
};
function switchScreen(screen) {
  //fitst highlight the new icon
  document.getElementById(`${currentScreen}-button`).classList.remove('sel');

    if (!screens[screen] || screen === currentScreen) return;
  
    const current = screens[currentScreen];
    const next = screens[screen];
    document.getElementById(`${screen}-button`).classList.add('sel');
  
    // Fade out and slide left the current screen
    current.classList.remove('opacity-100', 'translate-x-0');
    current.classList.add('opacity-0', 'translate-x-full');
  
    setTimeout(() => {
      current.classList.add('hidden');
      next.classList.remove('hidden');
  
      // Fade in and slide right the next screen
      setTimeout(() => {
        next.classList.remove('opacity-0', 'translate-x-full');
        next.classList.add('opacity-100', 'translate-x-0');
      }, 50);
    }, 500);
    currentScreen = screen;
  }

  let MAIN_DETAILS;
  function set_main_details() {
    fetch('/all_data')
        .then(res => res.json())
        .then(data => {

          MAIN_DETAILS = data;
          console.log(MAIN_DETAILS);
        });
}
set_main_details();



let USER_DETAILS;
  function FillCustomerFields() {
    fetch('/session_user')
        .then(res => res.json())
        .then(user => {
          console.log(user);
          document.getElementById("nav-name").textContent = `${user.first_name} ${user.last_name}` || '';
          
            //temporily set this for now
            document.getElementById("nav-status").textContent = 'basic';
            //document.getElementById("nav-status").value = user.last_name || '';
           USER_DETAILS = user;
        });
}

window.onload = FillCustomerFields();

function openLogoutModal() {
  const modal = document.getElementById('logoutModal');
  const content = document.getElementById('logoutModalContent');
  modal.classList.remove('hidden');
  setTimeout(() => content.classList.remove('opacity-0', 'scale-90'), 50);
}

function closeModal() {
  const modal = document.getElementById('logoutModal');
  const content = document.getElementById('logoutModalContent');
  content.classList.add('opacity-0', 'scale-90');
  setTimeout(() => modal.classList.add('hidden'), 300);
}

function confirmLogout() {
  // Perform logout logic here
  fetch('/logout', { method: 'POST' })
      .then(() => window.location.href = '/')
      .catch(err => console.error("Logout failed", err));
}


//highlight the scrreen that is open



