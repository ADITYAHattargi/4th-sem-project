// ================= REGISTER.JS =================

// FORM ELEMENTS
const form = document.getElementById("registerForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const roleInput = document.getElementById("role");
const skillsInput = document.getElementById("skills");
const cityInput = document.getElementById("city");
const bioInput = document.getElementById("bio");
const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");

// IMAGE PREVIEW
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => preview.src = reader.result;
  reader.readAsDataURL(file);
});

// SAVE PROFILE
function saveProfile(profile) {
  const profiles = JSON.parse(localStorage.getItem("skillbloom_profiles")) || [];
  profiles.push(profile);
  localStorage.setItem("skillbloom_profiles", JSON.stringify(profiles));
}

// FORM SUBMIT
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const profile = {
    id: "SB" + Date.now(),
    role: roleInput.value,
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
    skills: Array.from(skillsInput.selectedOptions).map(o => o.value),
    city: cityInput.value.trim(),
    bio: bioInput.value.trim(),
    image: preview.src
  };

  if (!profile.name || !profile.email || !profile.password) {
    alert("Please fill all mandatory fields");
    return;
  }

  saveProfile(profile);
  alert("Registration Successful!");
  window.location.href = "login.html";
});
