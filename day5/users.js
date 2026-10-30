
const API_URL = "https://jsonplaceholder.typicode.com/users";
const loadBtn = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

let allUsers = [];

function renderUsers(usersToRender) {
  usersList.innerHTML = ""; 
  if (usersToRender.length === 0) {
    statusText.textContent = "No users match your filter.";
    return;
  }
   usersToRender.forEach(user => {
    const li = document.createElement("li");
    const nameStrong = document.createElement("strong");
    nameStrong.textContent = user.name;
    const details = document.createElement("span");
    details.textContent = ` — Email: ${user.email} | City: ${user.address.city} | Company: ${user.company.name}`;

    li.appendChild(nameStrong);
    li.appendChild(details);
    usersList.appendChild(li);
  });
}

async function loadUsers() {
  statusText.textContent = "Loading users...";
  loadBtn.disabled = true; 
  usersList.innerHTML = "";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
    throw new Error(`Server responded with status: ${response.status}`);
    }

    allUsers = await response.json(); 
    renderUsers(allUsers); 
    statusText.textContent = `Successfully loaded ${allUsers.length} users.`;

  } catch (error) {
    statusText.textContent = "Could not load users. Please try again.";
    console.error("Fetch error:", error);
  } finally {    
    loadBtn.disabled = false;
  }
}
loadBtn.addEventListener("click", loadUsers);
filterInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase().trim();  
  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm)
  );
  renderUsers(filteredUsers);
});