const caption = document.getElementById("caption");
const media = document.getElementById("media");
const preview = document.getElementById("preview");

const loggedInUser = localStorage.getItem("loggedInUser");
const posts = JSON.parse(localStorage.getItem("skillbloom_posts")) || [];

if(!loggedInUser){
  alert("Please login");
  location.href="login.html";
}

// PREVIEW MEDIA
media.onchange = () => {
  preview.innerHTML="";
  const file = media.files[0];
  if(!file) return;

  const url = URL.createObjectURL(file);

  if(file.type.startsWith("video")){
    preview.innerHTML = `<video src="${url}" controls></video>`;
  } else {
    preview.innerHTML = `<img src="${url}">`;
  }
};

// CREATE POST
function createPost(){
  if(caption.value.trim()==="" && !media.files.length){
    alert("Post something!");
    return;
  }

  let mediaURL = "";
  let type = "";

  if(media.files.length){
    mediaURL = preview.querySelector("img,video").src;
    type = media.files[0].type.startsWith("video") ? "video" : "image";
  }

  const post = {
    id: Date.now(),
    userId: loggedInUser,
    caption: caption.value,
    media: mediaURL,
    type: type,
    time: new Date().toLocaleString()
  };

  posts.push(post);
  localStorage.setItem("skillbloom_posts", JSON.stringify(posts));

  location.href="feed.html";
}
