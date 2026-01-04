const signature = document.querySelector('.signature');
const paths = signature.querySelectorAll('path');

paths.forEach(path => {
  const length = path.getTotalLength();
  path.style.setProperty('--length', length);
});

const observer = new IntersectionObserver(
  ([entry]) => {
    paths.forEach(path => {
      path.style.strokeDashoffset = entry.isIntersecting
        ? 0
        : path.getTotalLength();
    });
  },
  {
    threshold: 0.7,
    rootMargin: '0px 0px -50px 0px'
  }
);

observer.observe(signature);