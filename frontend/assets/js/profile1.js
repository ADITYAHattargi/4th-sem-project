const profiles = JSON.parse(localStorage.getItem("skillbloom_profiles")) || [];
const profileId = localStorage.getItem("selectedProfileId");

const profile = profiles.find(p => p.id === profileId);

if (!profile) {
  alert("Profile not found");
  window.location.href = "search.html";
}

document.getElementById("profileImage").src = profile.image || "https://via.placeholder.com/250";
document.getElementById("profileName").textContent = profile.name;
document.getElementById("profileRole").textContent = profile.role.toUpperCase();
document.getElementById("profileCity").textContent = "📍 " + profile.city;
document.getElementById("profileBio").textContent = profile.bio;

const skillsDiv = document.getElementById("profileSkills");
profile.skills.forEach(skill => {
  const span = document.createElement("span");
  span.textContent = skill;
  skillsDiv.appendChild(span);
});
