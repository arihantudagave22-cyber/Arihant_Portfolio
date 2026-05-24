/*=============== EMAIL JS ===============*/
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (name && email && message) {
      // You can integrate EmailJS here
      // For now, just show a simple alert
      alert('Thank you! Your message has been sent. I will get back to you soon!');
      contactForm.reset();
    }
  });
}

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = document.getElementById('scroll-up');

if (scrollUp) {
  window.addEventListener('scroll', () => {
    if (window.scrollY >= 560) {
      scrollUp.classList.add('show');
    } else {
      scrollUp.classList.remove('show');
    }
  });

  scrollUp.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const highlightLink = () => {
  let scrollPosition = window.scrollY + 100;

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop;
    const sectionId = current.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
};

window.addEventListener('scroll', highlightLink);

/*=============== MOBILE NAV TOGGLE ===============*/
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

// Open nav
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('active');
  });
}

// Close nav
if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
}

// Close nav when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2500,
  delay: 400,
  reset: true
});

// Home section
sr.reveal('.home__perfil', { origin: 'left' });
sr.reveal('.home__info', { origin: 'right' });
sr.reveal('.home__social', { delay: 600 });
sr.reveal('.home__button', { delay: 800 });

// About section
sr.reveal('.about__image', { origin: 'left' });
sr.reveal('.about__info', { origin: 'right' });
sr.reveal('.about__details', { delay: 600 });

// Skills section
sr.reveal('.skills__content', { interval: 100 });

// Projects section
sr.reveal('.projects__card', { interval: 100 });

// Experience section
sr.reveal('.experience__content', { interval: 100 });

// Contact section
sr.reveal('.contact__info', { origin: 'left' });
sr.reveal('.contact__form', { origin: 'right', delay: 600 });

// Footer
sr.reveal('.footer__content', { interval: 100 });


