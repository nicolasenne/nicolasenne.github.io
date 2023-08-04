const cursor = document.querySelector('.cursor');

const moveCursor = (e)=> {
  const mouseY = e.pageY;
  const mouseX = e.pageX;
  
  cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
}

document.addEventListener('mousemove', moveCursor)