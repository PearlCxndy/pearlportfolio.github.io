// Get the button and content elements
const pearly = document.getElementById("pearly");

// Function to simulate typing effect
function typeWriter(element, text, index, speed) {
  if (index < text.length) {
    element.innerHTML += text.charAt(index);
    index++;
    setTimeout(() => typeWriter(element, text, index, speed), speed);
  }
}

// Typing effect on pearl text
const pearl = "Pearl";
typeWriter(pearly, pearl, 0, 150);

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

function setActiveLink() {
  const scrollY = window.scrollY;
  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop - 100;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      navLinks.forEach((link) => link.classList.remove('active'));
      navLinks.forEach((link) => link.classList.add('inactive'));
      navLinks[index].classList.add('active');
      navLinks[index].classList.remove('inactive');
    }
  });
}

function stickyNav() {
  const nav = document.querySelector('nav');
  const headerHeight = document.querySelector('header').offsetHeight;
  if (window.scrollY >= headerHeight) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

// Smooth Scroll
function smoothScroll(event) {
  event.preventDefault();
  const targetId = event.target.getAttribute('href');
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

// Add drop-in animation to p5 canvas
window.addEventListener('load', () => {
  const p5Canvas = document.getElementById('p5-canvas');
  p5Canvas.classList.add('drop-in');
});

// Matter.js and p5.js integration for interactive divs
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
    Bodies.rectangle(width / 2, -thickness / 2, width, thickness, {
      isStatic: true,
    }),
    Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, {
      isStatic: true,
    }),
    Bodies.rectangle(-thickness / 2, height / 2, thickness, height, {
      isStatic: true,
    }),
    Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, {
      isStatic: true,
    }),
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
      if (
        dist(mouseX, mouseY, item.body.position.x, item.body.position.y) <
        150
      ) {
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
