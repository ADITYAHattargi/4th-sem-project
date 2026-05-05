// ================= AUTH.JS =================

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");

// LOGIN
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const profiles = JSON.parse(localStorage.getItem("skillbloom_profiles")) || [];

  const user = profiles.find(
    p => p.email === email && p.password === password
  );

  if (!user) {
    alert("Invalid email or password");
    return;
  }

  // SAVE LOGGED USER
  localStorage.setItem("skillbloom_logged_user", JSON.stringify(user));

  // REDIRECT
  if (user.role === "student") {
    window.location.href = "student-dashboard.html";
  } else {
    window.location.href = "business-dashboard.html";
  }
});
