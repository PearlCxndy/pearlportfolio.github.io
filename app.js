

// Typing effect for navbar title
const pearly = document.getElementById("pearly");
const pearl = "Pearl";

function typeWriter(element, text, index, speed) {
  if (index < text.length) {
    element.innerHTML += text.charAt(index);
    index++;
    setTimeout(() => typeWriter(element, text, index, speed), speed);
  }
}

// New Typing effect for header h1
// New Typing effect for header h1
const headerH1 = document.getElementById("typewriter-header");
const headerText = headerH1.textContent;
headerH1.textContent = "";

const achievementsH1 = document.getElementById("typewriter-achievements");
const achievementsText = achievementsH1.textContent;
achievementsH1.textContent = "";

document.addEventListener("DOMContentLoaded", () => {
  typeWriter(headerH1, headerText, 0, 120);
  typeWriter(achievementsH1, achievementsText, 0, 100);
});

typeWriter(pearly, pearl, 0, 150);


// Navbar active link handling
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

function setActiveLink() {
  const scrollY = window.scrollY;
  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop - 100;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      navLinks.forEach((link) => link.classList.remove('active'));
      navLinks[index].classList.add('active');
    }
  });
}

function stickyNav() {
  const nav = document.querySelector('nav');
  const headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;
  if (window.scrollY >= headerHeight) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

function smoothScroll(event) {
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute('href');
  const targetSection = document.querySelector(targetId);
  targetSection.scrollIntoView({ behavior: 'smooth' });
}

navLinks.forEach(link => {
  link.addEventListener('click', smoothScroll);
});

window.addEventListener('scroll', () => {
  setActiveLink();
  stickyNav();
});

window.addEventListener('load', () => {
  const p5Canvas = document.getElementById('p5-canvas');
  p5Canvas.classList.add('drop-in');
});



// Matter.js and p5.js integration
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

let engine;
let items = [];
let lastMouseX = -1;
let lastMouseY = -1;

function setup() {
  const canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent(document.getElementById('p5-canvas'));
  engine = Engine.create();
  engine.world.gravity.y = 0;

  addBoundaries();

  for (let i = 0; i < 12; i++) {
    let x = random(100, width - 100);
    let y = random(100, height - 100);
    items.push(new Item(x, y, `./assets/img${i + 1}.jpg`));
  }
}

function addBoundaries() {
  const thickness = 50;
  World.add(engine.world, [
    Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }),
    Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }),
    Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }),
    Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true }),
  ]);
}

function draw() {
  Engine.update(engine);
  items.forEach((item) => item.update());
}

class Item {
  constructor(x, y, imagePath) {
    let options = {
      frictionAir: 0.075,
      restitution: 0.25,
      density: 0.002,
      angle: Math.random() * Math.PI * 2,
    };

    this.body = Bodies.rectangle(x, y, 100, 200, options);
    World.add(engine.world, this.body);

    this.div = document.createElement("div");
    this.div.className = "item";
    this.div.style.left = `${this.body.position.x - 50}px`;
    this.div.style.top = `${this.body.position.y - 100}px`;
    const img = document.createElement("img");
    img.src = imagePath;
    this.div.appendChild(img);
    document.body.appendChild(this.div);
  }

  update() {
    this.div.style.left = `${this.body.position.x - 50}px`;
    this.div.style.top = `${this.body.position.y - 100}px`;
    this.div.style.transform = `rotate(${this.body.angle}rad)`;
  }
}




function mouseMoved() {
  if (dist(mouseX, mouseY, lastMouseX, lastMouseY) > 10) {
    lastMouseX = mouseX;
    lastMouseY = mouseY;

    items.forEach((item) => {
      if (dist(mouseX, mouseY, item.body.position.x, item.body.position.y) < 150) {
        let forceMagnitude = 3;
        Body.applyForce(
          item.body,
          {
            x: item.body.position.x,
            y: item.body.position.y,
          },
          {
            x: random(-forceMagnitude, forceMagnitude),
            y: random(-forceMagnitude, forceMagnitude),
          }
        );
      }
    });
  }
}

// GSAP and Barba.js animations
const animationLeave = (container) => {
  const tl = gsap.timeline({
    onComplete: pageTransition(),
  });

  const heading = container.querySelector("h1");
  const img = container.querySelectorAll("img");

  tl.to(img, {
    y: 200,
    opacity: 0,
  }).to(
    heading,
    {
      y: 20,
      opacity: 0,
    },
    "-=.5"
  );
};

const pageTransition = () => {
  const tl = gsap.timeline({ delay: 0.6 });
  tl.to(".transition li", {
    scaleY: 1,
    transformOrigin: "bottom left",
    stagger: 0.1,
  });
  tl.to(".transition li", {
    scaleY: 0,
    transformOrigin: "top left",
    stagger: 0.1,
  });
  return tl;
};



document.addEventListener('DOMContentLoaded', () => {
  // Select necessary elements
  const slider = document.querySelector('.slider');
  const sliderWrapper = document.querySelector('.slider-wrapper');
  const activeSlide = document.querySelector('.active-slide');
  const slides = document.querySelectorAll('.slide');

  // Calculate the maximum scrollable width
  let maxScroll = sliderWrapper.scrollWidth - slider.clientWidth;

  // Function to update the active slide number
  function updateActiveSlideNumber() {
      const totalSlides = slides.length;
      const partWidth = maxScroll / totalSlides;
      const currentSlideIndex = Math.round(slider.scrollLeft / partWidth);
      activeSlide.textContent = `${currentSlideIndex + 1}/${totalSlides}`;
  }

  // Function to update maxScroll on window resize
  function updateMaxScroll() {
      maxScroll = sliderWrapper.scrollWidth - slider.clientWidth;
  }

  // Listen to the horizontal scroll event
  slider.addEventListener('scroll', updateActiveSlideNumber);

  // Update maxScroll on window resize
  window.addEventListener('resize', updateMaxScroll);

  // Initial call to set the correct maxScroll value
  updateMaxScroll();
  updateActiveSlideNumber(); // Initial update to display the correct slide number
});

function delay(n) {
  n = n || 4000;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}


barba.init({
  sync: true,
  transitions: [
    {
      async once({ next }) {
        animationEnter(next.container);
      },
      async leave({ current }) {
        const done = this.async();
        animationLeave(current.container);
        await delay(2300);
        done();
      },
      async enter({ next }) {
        animationEnter(next.container);
      },
    },
  ],
});


