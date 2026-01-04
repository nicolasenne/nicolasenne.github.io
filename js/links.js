document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = link.getAttribute("href");
  const targetEl = document.querySelector(targetId);

  if (!targetEl) return;

  e.preventDefault();

  targetEl.scrollIntoView({
    behavior: "smooth"
  });
});