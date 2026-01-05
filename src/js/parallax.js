const banner = document.querySelector(".banner");
const image  = document.querySelector(".banner-image");
const text   = document.querySelector(".banner-info");

let imgY = 0;
let textY = 0;
let targetY = 0;

function lerp(a, b, n) {
  return a + (b - a) * n;
}

function animate() {
  imgY  = lerp(imgY, targetY, 0.12);

  textY = lerp(textY, targetY, 0.08);

  image.style.transform = `translateY(${imgY * 0.2}px)`;
  text.style.transform  = `translateY(${textY * -0.7}px)`;

  requestAnimationFrame(animate);
}

window.addEventListener("scroll", () => {
  const rect = banner.getBoundingClientRect();
  const vh = window.innerHeight;

  if (rect.bottom > 0 && rect.top < vh) {
    const progress = Math.max(0, -rect.top);
    targetY = progress * 0.3;
  }
});

animate();