const loggedId = localStorage.getItem("loggedInUser");
const profiles = JSON.parse(localStorage.getItem("skillbloom_profiles")) || [];

if (!loggedId) {
  location.href = "login.html";
}

const user = profiles.find(p => p.id === loggedId);

img.src = user.image || "https://via.placeholder.com/150";
name.textContent = user.name;
role.textContent = user.role.toUpperCase();
city.textContent = user.city;
bio.textContent = user.bio;

user.skills.forEach(skill => {
  const span = document.createElement("span");
  span.textContent = skill;
  skills.appendChild(span);
});

function logout(){
  localStorage.removeItem("loggedInUser");
  location.href="login.html";
}

function goSearch(){
  location.href="search.html";
}

function editProfile(){
  alert("Edit profile coming next 🔥");
}
