// window.SimpleAnime=class{constructor(){
//   this.items=document.querySelectorAll("[data-anime]"),
//   this.init()}animateItems(){this.items.forEach(t => {
//     const e=Number(t.getAttribute("data-anime"));
//     isNaN(e)||setTimeout(() => { 
//       t.classList.add("anime")},e)})}
//       handleVisibility() {void 0!==document.visibilityState?"visible"===document.visibilityState&&this.animateItems():this.animateItems()}init(){
//         this.handleVisibility=this.handleVisibility.bind(this),
//         this.handleVisibility(),document.addEventListener("visibilitychange",
//         this.handleVisibility)
//       }}

// new SimpleAnime();

window.SimpleAnime = class {
  constructor() {
    // anima imediatamente (load)
    this.instantItems = document.querySelectorAll(
      "nav [data-anime], .social [data-anime], #main [data-anime]"
    );

    // anima no scroll
    this.sections = document.querySelectorAll(
      "#about, #work, #game, #contact"
    );

    this.init();
  }

  animateItems(items) {
    items.forEach(el => {
      const delay = Number(el.getAttribute("data-anime"));
      if (isNaN(delay)) return;

      setTimeout(() => {
        el.classList.add("anime");
      }, delay);
    });
  }

  observeSections() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll("[data-anime]");
            this.animateItems(items);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.25
      }
    );

    this.sections.forEach(section => observer.observe(section));
  }

  init() {
    // anima menu, social e main
    this.animateItems(this.instantItems);

    // anima resto no scroll
    this.observeSections();
  }
};

new SimpleAnime();