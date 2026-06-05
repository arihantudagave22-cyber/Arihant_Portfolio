/*=============== SKILLS DATA ===============*/
const skillsData = {
  'Programming & Web Technologies': ['Python', 'Core Java', 'JavaScript', 'SQL', 'C', 'C++', 'React.js', 'AngularJS', 'REST APIs'],
  'Technologies & Tools': ['GitHub', 'VS Code', 'MATLAB', 'Arduino'],
  'Core Concepts': ['OOPS', 'Data Structures & Algorithms', 'DBMS', 'SQL Queries', 'Frontend Development'],
  'Soft Skills': ['Communication', 'Quick Adaptability', 'Problem Solving', 'Ability to Learn New Technologies']
};

/*=============== EDUCATION DATA ===============*/
const educationData = [
  {
    title: 'B.Tech in Electronics and Communication Engineering',
    university: 'CMR University, Bangalore',
    year: '2022 - 2026',
    details: 'CGPA: 7.95'
  },
  {
    title: 'PCMB (Class XII)',
    university: 'KLE Independent PU College, Chikodi',
    year: 'May 2019 – July 2021',
    details: 'Aggregate: 86.32'
  },
  {
    title: 'SSLC (Class X)',
    university: 'L.E.S English Medium School, Shamanewadi',
    year: 'May 2018 – April 2019',
    details: 'Aggregate: 86.00'
  }
];

/*=============== PROJECTS DATA ===============*/
const projectsData = [
  {
    image: 'New folder/img/projects-2.jpg',
    title: 'Spotify Clone',
    description: 'Developed a responsive Spotify Clone web application using HTML, CSS, and JavaScript. Implemented core music player functionalities including play/pause controls, progress bar, song navigation, playlist management, and dynamic audio playback using JavaScript DOM manipulation and the HTML Audio API.',
    viewLink: '#',
    codeLink: 'https://github.com/arihantudagave22-cyber/SpotifyClone'
  }
];

/*=============== GENERATE SKILLS HTML ===============*/
function generateSkills() {
  const skillsContainer = document.querySelector('.skills__container');
  if (!skillsContainer) return;
  
  skillsContainer.innerHTML = '';
  
  Object.entries(skillsData).forEach(([category, skills]) => {
    const skillContent = document.createElement('div');
    skillContent.className = 'skills__content';
    
    let skillsHTML = `<h3 class="skills__title">${category}</h3><div class="skills__list">`;
    
    skills.forEach(skill => {
      skillsHTML += `
        <div class="skills__item">
          <div class="skills__item-header">
            <span class="skills__name">${skill}</span>
          </div>
        </div>
      `;
    });
    
    skillsHTML += '</div>';
    skillContent.innerHTML = skillsHTML;
    skillsContainer.appendChild(skillContent);
  });
}

/*=============== GENERATE EDUCATION HTML ===============*/
function generateEducation() {
  const educationContainer = document.querySelector('.education__container');
  if (!educationContainer) return;
  
  educationContainer.innerHTML = '';
  
  educationData.forEach(edu => {
    const eduContent = document.createElement('div');
    eduContent.className = 'education__content';
    eduContent.innerHTML = `
      <h3 class="education__title">${edu.title}</h3>
      <p class="education__university">${edu.university}</p>
      <p class="education__year">${edu.year}</p>
      <p class="education__details">${edu.details}</p>
    `;
    educationContainer.appendChild(eduContent);
  });
}

/*=============== GENERATE PROJECTS HTML ===============*/
function generateProjects() {
  const projectsContainer = document.querySelector('.projects__container');
  if (!projectsContainer) return;
  
  projectsContainer.innerHTML = '';
  
  projectsData.forEach(project => {
    const projectCard = document.createElement('article');
    projectCard.className = 'projects__card';
    projectCard.innerHTML = `
      <img src="${project.image}" alt="${project.title}" class="projects__img" />
      <div class="projects__modal">
        <div>
          <h3 class="projects__title">${project.title}</h3>
          <p class="projects__description">${project.description}</p>
        </div>
        <div class="projects__buttons">
          <a href="${project.viewLink}" class="projects__link">View</a>
          <a href="${project.codeLink}" target="_blank" class="projects__link">Code</a>
        </div>
      </div>
    `;
    projectsContainer.appendChild(projectCard);
  });
}

/*=============== INITIALIZE CONTENT ===============*/
document.addEventListener('DOMContentLoaded', () => {
  generateSkills();
  generateEducation();
  generateProjects();
});

/*=============== IMAGE HOVER & CLICK EFFECTS ===============*/
const homeImage = document.querySelector('.home__image');
const aboutImage = document.querySelector('.about__image');

// Simple hover red background effect
if (homeImage) {
  homeImage.addEventListener('mouseenter', () => {
    homeImage.style.backgroundColor = '#d71a1a';
  });
  homeImage.addEventListener('mouseleave', () => {
    homeImage.style.backgroundColor = '';
  });
  
  // Simple click ripple effect
  homeImage.addEventListener('click', (e) => {
    const rect = homeImage.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;
    
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.backgroundColor = '#d71a1a';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.opacity = '0.8';
    
    homeImage.style.position = 'relative';
    homeImage.style.overflow = 'hidden';
    homeImage.appendChild(ripple);
    
    // Animate ripple
    let scale = 1;
    const interval = setInterval(() => {
      scale += 0.1;
      ripple.style.transform = `translate(-50%, -50%) scale(${scale})`;
      ripple.style.opacity = Math.max(0, 0.8 - scale * 0.1);
      
      if (scale > 3) {
        clearInterval(interval);
        ripple.remove();
      }
    }, 30);
  });
}

if (aboutImage) {
  aboutImage.addEventListener('mouseenter', () => {
    aboutImage.style.backgroundColor = '#d71a1a';
  });
  aboutImage.addEventListener('mouseleave', () => {
    aboutImage.style.backgroundColor = '';
  });
  
  // Simple click ripple effect
  aboutImage.addEventListener('click', (e) => {
    const rect = aboutImage.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;
    
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.backgroundColor = '#d71a1a';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.opacity = '0.8';
    
    aboutImage.style.position = 'relative';
    aboutImage.style.overflow = 'hidden';
    aboutImage.appendChild(ripple);
    
    // Animate ripple
    let scale = 1;
    const interval = setInterval(() => {
      scale += 0.1;
      ripple.style.transform = `translate(-50%, -50%) scale(${scale})`;
      ripple.style.opacity = Math.max(0, 0.8 - scale * 0.1);
      
      if (scale > 3) {
        clearInterval(interval);
        ripple.remove();
      }
    }, 30);
  });
}

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

/*=============== WHATSAPP FLOAT BUTTON ===============*/
const whatsappFloat = document.querySelector('.whatsapp-float');

if (whatsappFloat) {
  // Keep the floating contact button accessible across devices.
  whatsappFloat.setAttribute('aria-label', 'Chat with me on WhatsApp');
  whatsappFloat.setAttribute('title', 'Chat with me on WhatsApp');
}

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
