const toggle = document.querySelector('.menu-toggle');
const menu   = document.querySelector('.mobile-menu');
const icon   = toggle.querySelector('i');

toggle.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('active');

  icon.className = isOpen ? 'bi bi-x-lg' : 'bi bi-list';
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('active');
    icon.className = 'bi bi-list';
    document.body.style.overflow = '';
  });
});