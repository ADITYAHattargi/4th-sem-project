const feed = document.getElementById("feed");
const posts = JSON.parse(localStorage.getItem("skillbloom_posts")) || [];
const profiles = JSON.parse(localStorage.getItem("skillbloom_profiles")) || [];

function loadFeed(){
  feed.innerHTML = "";

  posts.reverse().forEach(post => {
    const user = profiles.find(p => p.id === post.userId);

    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <div class="post-header" onclick="openProfile('${user.id}')">
        <img src="${user.image}">
        <div>
          <h4>${user.name}</h4>
          <small>${user.role} • ${user.city}</small>
        </div>
      </div>

      ${post.media ? `
        <div class="post-media">
          ${post.type === "video"
            ? `<video src="${post.media}" controls></video>`
            : `<img src="${post.media}">`
          }
        </div>` : ""}

      <div class="post-content">
        <p>${post.caption}</p>
      </div>

      <div class="actions">
        <span>❤️</span>
        <span>💬</span>
        <span>🔗</span>
      </div>
    `;

    feed.appendChild(div);
  });
}

function openProfile(id){
  localStorage.setItem("viewProfile", id);
  location.href = "profile.html";
}

function logout(){
  localStorage.removeItem("loggedInUser");
  location.href="login.html";
}

loadFeed();
