const profiles = JSON.parse(localStorage.getItem("skillbloom_profiles")) || [];

function searchProfiles() {
  const role = document.getElementById("roleFilter").value;
  const skill = document.getElementById("skillFilter").value.toLowerCase();

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const filtered = profiles.filter(p => {
    const roleMatch = role ? p.role === role : true;
    const skillMatch = skill
      ? p.skills.some(s => s.toLowerCase().includes(skill))
      : true;

    return roleMatch && skillMatch;
  });

  if (filtered.length === 0) {
    resultsDiv.innerHTML = "<p>No profiles found</p>";
    return;
  }

  filtered.forEach(profile => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${profile.image || 'https://via.placeholder.com/300'}">
      <h3>${profile.name}</h3>
      <div class="role">${profile.role.toUpperCase()}</div>
      <p>${profile.city}</p>
    `;

    card.onclick = () => {
      localStorage.setItem("selectedProfileId", profile.id);
      window.location.href = "profile.html";
    };

    resultsDiv.appendChild(card);
  });
}
