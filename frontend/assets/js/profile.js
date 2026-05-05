const params = new URLSearchParams(window.location.search);
const profileId = params.get("id");

const users = JSON.parse(localStorage.getItem("skillbloom_users")) || [];
const posts = JSON.parse(localStorage.getItem("skillbloom_posts")) || [];

const user = users.find(u => u.id === profileId);

if(!user){
  alert("Profile not found");
  history.back();
}

// BASIC INFO
avatar.src = user.image;
name.textContent = user.name;
role.textContent = user.role.toUpperCase() + " • " + user.city;
bio.textContent = user.bio;

// SKILLS
user.skills.forEach(s=>{
  const span=document.createElement("span");
  span.className="skill";
  span.textContent=s;
  skills.appendChild(span);
});

// POSTS
const userPosts = posts.filter(p=>p.userId===profileId);
if(userPosts.length){
  noPosts.style.display="none";
  userPosts.reverse().forEach(p=>{
    const div=document.createElement("div");
    div.className="post";
    div.innerHTML = p.type==="video"
      ? `<video src="${p.media}" controls></video>`
      : `<img src="${p.media}">`;
    document.getElementById("posts").appendChild(div);
  });
}

// ACTIONS
function goBack(){
  history.back();
}

function startChat(){
  alert("DM system coming next 🚀");
}
