// ================= SEARCH.JS =================

const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

// LOAD PROFILES
function getProfiles() {
  return JSON.parse(localStorage.getItem("skillbloom_profiles")) || [];
}

// SEARCH FUNCTION
searchInput.addEventListener("input", function () {
  const keyword = searchInput.value.toLowerCase();
  const profiles = getProfiles();

  resultsDiv.innerHTML = "";

  const filtered = profiles.filter(profile =>
    profile.name.toLowerCase().includes(keyword) ||
    profile.skills.join(" ").toLowerCase().includes(keyword) ||
    profile.city.toLowerCase().includes(keyword)
  );

  filtered.forEach(profile => {
    const card = document.createElement("div");
    card.className = "profile-card";

    card.innerHTML = `
      <img src="${profile.image}" alt="profile">
      <h3>${profile.name}</h3>
      <p>${profile.role}</p>
      <p>${profile.city}</p>
    `;

    card.onclick = () => openProfile(profile.id);
    resultsDiv.appendChild(card);
  });
});

// OPEN FULL PROFILE
function openProfile(id) {
  localStorage.setItem("skillbloom_view_profile", id);
  window.location.href = "profile.html";
}
