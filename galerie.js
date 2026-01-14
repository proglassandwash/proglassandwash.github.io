const items = document.querySelectorAll(".galerie-item");
const lightbox = document.getElementById("lightbox");
const img = document.querySelector(".lightbox-img");
const video = document.querySelector(".lightbox-video");
const close = document.querySelector(".lightbox-close");

items.forEach(item => {
  item.addEventListener("click", () => {
    const type = item.dataset.type;
    const src = item.dataset.src;

    lightbox.style.display = "flex";

    if (type === "image") {
      img.src = src;
      img.style.display = "block";
      video.style.display = "none";
      video.pause();
    } else {
      video.src = src;
      video.style.display = "block";
      img.style.display = "none";
      video.play();
    }
  });
});

close.addEventListener("click", () => {
  lightbox.style.display = "none";
  video.pause();
});
