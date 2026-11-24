import { lazy, Suspense, useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { Theme } from "./types";
import { installSlowScroll } from "./utils/slowScroll";

const ScrollSpider = lazy(() => import("./components/ScrollSpider"));

const sections = [
  ["home", "Home"],
  ["about", "About"],
  ["skills", "Skills"],
  ["education", "Education"],
  ["projects", "Projects"],
  ["contact", "Contact"],
] as const;

const skillGroups = [
  { title: "Programming & web", skills: ["Python", "Core Java", "JavaScript", "SQL", "C", "C++", "React.js", "AngularJS", "REST APIs"] },
  { title: "Technologies & tools", skills: ["GitHub", "VS Code", "MATLAB", "Arduino"] },
  { title: "Core concepts", skills: ["OOPS", "Data Structures & Algorithms", "DBMS", "SQL Queries", "Frontend Development"] },
  { title: "How I work", skills: ["Communication", "Quick Adaptability", "Problem Solving", "Continuous Learning"] },
];

const education = [
  { title: "B.Tech in Electronics and Communication Engineering", school: "CMR University, Bangalore", year: "2022 – 2026", result: "CGPA: 7.95" },
  { title: "PCMB (Class XII)", school: "KLE Independent PU College, Chikodi", year: "May 2019 – July 2021", result: "Aggregate: 86.32" },
  { title: "SSLC (Class X)", school: "L.E.S English Medium School, Shamanewadi", year: "May 2018 – April 2019", result: "Aggregate: 86.00" },
];

const projects = [
  {
    title: "FitTrack",
    category: "Full-stack fitness tracker",
    image: "/images/fittrack-project.svg",
    alt: "FitTrack fitness dashboard with activity chart and workout stats",
    description: "A fitness tracker for recording workouts and measurements, joining challenges, and following progress. Includes account roles and persistent records.",
    technologies: ["React", "Vite", "Node.js", "SQLite", "Docker"],
  },
  {
    title: "Spotify Clone",
    category: "Interactive music player",
    image: "/images/spotify-project.svg",
    alt: "Music player interface with album art, playlist and playback controls",
    description: "A responsive music player with play and pause controls, progress tracking, song navigation, playlist management, and dynamic audio playback.",
    technologies: ["HTML", "CSS", "JavaScript", "HTML Audio API"],
  },
];

type IconName = "menu" | "close" | "linkedin" | "github" | "mail" | "phone" | "pin" | "arrow" | "send" | "up" | "network" | "sun" | "moon";

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    linkedin: <path d="M4 9h3v11H4zM5.5 4a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5ZM11 20V9h3v1.6c.6-1.1 1.6-1.9 3.2-1.9 2.4 0 3.8 1.5 3.8 4.5V20h-3v-6.1c0-1.7-.5-2.6-1.9-2.6-1.5 0-2.1 1.1-2.1 2.8V20z" />,
    github: <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.1-1.5 6.1-6.8a5.3 5.3 0 0 0-1.4-3.7 4.9 4.9 0 0 0-.1-3.7s-1.2-.4-3.9 1.4a13.5 13.5 0 0 0-7.1 0C5 1 3.8 1.4 3.8 1.4a4.9 4.9 0 0 0-.1 3.7A5.3 5.3 0 0 0 2.3 9c0 5.3 3.1 6.5 6.1 6.8a3.4 3.4 0 0 0-.9 2.6V22" />,
    mail: <path d="m3 6 9 7 9-7M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />,
    phone: <path d="M6.6 3H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-2.6a1 1 0 0 0-.8-1l-3.2-.7a1 1 0 0 0-1 .3l-1.4 1.8a14 14 0 0 1-6.4-6.4L10 12a1 1 0 0 0 .3-1l-.7-3.2a1 1 0 0 0-1-.8Z" />,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    up: <path d="m6 14 6-6 6 6" />,
    network: <><circle cx="12" cy="12" r="2.5" /><circle cx="5" cy="6" r="1.5" /><circle cx="19" cy="6" r="1.5" /><circle cx="5" cy="18" r="1.5" /><circle cx="19" cy="18" r="1.5" /><path d="m7 7 3.2 3.2M17 7l-3.2 3.2M7 17l3.2-3.2M17 17l-3.2-3.2" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
  };

  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: IconName }) {
  return (
    <a aria-label={label} className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-teal-300/50 hover:bg-teal-300/10 hover:text-teal-200" href={href} rel="noreferrer" target="_blank">
      <Icon name={icon} />
    </a>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-12 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal-300">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <span className="mx-auto mt-5 block h-0.5 w-12 rounded-full bg-teal-300" />
    </div>
  );
}

function Header({ theme, onThemeToggle }: { theme: Theme; onThemeToggle: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(([id]) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-ink/85 backdrop-blur-xl">
      <nav aria-label="Main navigation" className="mx-auto flex min-h-[4.5rem] w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <div className="hidden items-center gap-2 lg:flex">
          <SocialLink href="https://www.linkedin.com/in/arihant-udagave/" label="LinkedIn" icon="linkedin" />
          <SocialLink href="https://github.com/arihantudagave22-cyber" label="GitHub" icon="github" />
          <SocialLink href="mailto:arihantudagave22@gmail.com" label="Email" icon="mail" />
        </div>
        <div className="ml-auto flex items-center gap-4 md:gap-8">
          <button aria-controls="primary-menu" aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"} className="grid size-10 place-items-center rounded-lg border border-white/10 text-slate-200 transition hover:border-teal-300/50 hover:text-teal-200 md:hidden" onClick={() => setMenuOpen((open) => !open)} type="button">
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
          <div className={`${menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0 md:visible md:translate-y-0 md:opacity-100"} absolute left-0 right-0 top-full border-b border-white/10 bg-ink px-5 pb-4 shadow-xl transition-all md:static md:border-0 md:bg-transparent md:p-0 md:shadow-none`} id="primary-menu">
            <ul className="flex flex-col md:flex-row md:items-center md:gap-7">
              {sections.map(([id, label]) => (
                <li className="border-b border-white/[0.06] last:border-0 md:border-0" key={id}>
                  <a aria-current={activeSection === id ? "page" : undefined} className={`block py-3 text-sm transition hover:text-teal-200 md:py-2 ${activeSection === id ? "text-teal-200" : "text-slate-300"}`} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <button
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-pressed={theme === "light"}
            className="theme-toggle grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 text-slate-200 transition hover:border-teal-300/50 hover:text-teal-200"
            onClick={onThemeToggle}
            type="button"
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} />
          </button>
        </div>
      </nav>
    </header>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-panel transition duration-300 hover:-translate-y-1 hover:border-teal-300/30 hover:shadow-2xl hover:shadow-black/25">
      <div className="overflow-hidden bg-slate-900">
        <img alt={project.alt} className="aspect-[1.875] w-full object-cover transition duration-500 group-hover:scale-[1.025]" height="640" loading="lazy" src={project.image} width="1200" />
      </div>
      <div className="p-6 sm:p-7">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-teal-300">{project.category}</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
        </div>
        <p className="mt-3 leading-7 text-slate-400">{project.description}</p>
        <ul aria-label={`${project.title} technologies`} className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((technology) => <li className="rounded-full border border-teal-200/15 bg-teal-200/[0.06] px-3 py-1 text-xs text-teal-100/85" key={technology}>{technology}</li>)}
        </ul>
      </div>
    </article>
  );
}

function ContactCard({ href, icon, label, value }: { href?: string; icon: IconName; label: string; value: string }) {
  const content = (
    <>
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-200/10 text-teal-200"><Icon name={icon} /></span>
      <span className="min-w-0"><span className="block text-xs text-slate-500">{label}</span><span className="mt-1 block break-all text-sm text-slate-100">{value}</span></span>
    </>
  );
  const className = "flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-panel p-5 transition hover:border-teal-300/30";
  return href ? <a className={className} href={href}>{content}</a> : <div className={className}>{content}</div>;
}

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [contactStatus, setContactStatus] = useState("");
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => installSlowScroll(), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#07111b" : "#f6f8fc");
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
    window.location.href = `mailto:arihantudagave22@gmail.com?subject=${subject}&body=${body}`;
    setContactStatus("Your email app will open with your message ready to send.");
  }

  return (
    <div className="min-h-screen overflow-clip bg-ink text-slate-100" data-theme={theme}>
      <Header onThemeToggle={() => setTheme((current) => current === "dark" ? "light" : "dark")} theme={theme} />
      <Suspense fallback={null}>
        <ScrollSpider />
      </Suspense>
      <main className="relative z-10">
        <section className="relative overflow-hidden scroll-mt-20 px-5 py-16 sm:px-8 sm:py-24 lg:py-28" id="home">
          <video
            aria-hidden="true"
            autoPlay
            className="hero-video"
            loop
            muted
            playsInline
            src="/videos/spider-backdrop.mp4"
            tabIndex={-1}
          />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_15%_50%,rgba(59,130,246,0.12),transparent_38%),radial-gradient(ellipse_at_90%_15%,rgba(244,63,94,0.11),transparent_35%)]" />
          <div className="relative z-10 mx-auto w-full max-w-4xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="welcome-badge mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200/20 bg-teal-200/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-teal-200 sm:text-sm">
                <Icon className="size-4" name="network" /> Welcome to my portfolio
              </p>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 sm:text-sm">Software developer <span className="px-1 text-slate-600">/</span> Bengaluru, India</p>
              <h1 className="welcome-title text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">Hi, I&apos;m <span className="text-teal-300">Arihant</span></h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">I build thoughtful, responsive web experiences with clean code and a focus on the details that make them feel effortless to use.</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a className="inline-flex items-center gap-2 rounded-xl bg-teal-300 px-5 py-3 font-semibold text-button transition hover:-translate-y-0.5 hover:bg-teal-200" href="#contact">Get in touch <Icon className="size-4" name="arrow" /></a>
                <a className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-medium text-slate-200 transition hover:border-teal-300/50 hover:text-teal-100" href="#projects">Explore projects</a>
              </div>
              <div className="mt-8 flex items-center justify-center gap-3 lg:hidden">
                <SocialLink href="https://www.linkedin.com/in/arihant-udagave/" label="LinkedIn" icon="linkedin" />
                <SocialLink href="https://github.com/arihantudagave22-cyber" label="GitHub" icon="github" />
                <SocialLink href="mailto:arihantudagave22@gmail.com" label="Email" icon="mail" />
              </div>
            </div>
          </div>
        </section>

        <section className="scroll-mt-20 border-y border-white/[0.06] bg-white/[0.025] px-5 py-20 sm:px-8 sm:py-24" id="about">
          <div className="mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <div className="portrait-frame mx-auto w-full max-w-xs rounded-3xl border border-white/10 p-2 shadow-2xl shadow-black/30">
              <img alt="Portrait of Arihant" className="aspect-square w-full rounded-[1.25rem] object-cover" height="600" loading="lazy" src="/images/about-perfil.png" width="600" />
            </div>
            <div>
              <SectionHeading eyebrow="A little about me" title="Building with purpose" />
              <p className="leading-8 text-slate-300">Motivated and detail-oriented Electronics and Communication Engineering student with hands-on experience in web development and software engineering fundamentals. I work with Java, JavaScript, SQL, HTML, CSS, and React, and enjoy learning modern technologies while building useful applications.</p>
              <div className="mt-6 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                <p><span className="text-slate-500">Email</span><br /><a className="mt-1 inline-block hover:text-teal-200" href="mailto:arihantudagave22@gmail.com">arihantudagave22@gmail.com</a></p>
                <p><span className="text-slate-500">Location</span><br /><span className="mt-1 inline-block">Bengaluru, India</span></p>
              </div>
              <a className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-teal-300/50 hover:text-teal-100" download href="/resume.pdf">Download résumé <Icon className="size-4" name="arrow" /></a>
            </div>
          </div>
        </section>

        <section className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-24" id="skills">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="What I work with" title="Skills & tools" />
            <div className="grid gap-4 sm:grid-cols-2">
              {skillGroups.map((group) => (
                <article className="rounded-2xl border border-white/[0.08] bg-panel p-6 sm:p-7" key={group.title}>
                  <h3 className="mb-5 font-semibold text-white">{group.title}</h3>
                  <ul className="flex flex-wrap gap-2.5">
                    {group.skills.map((skill) => <li className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-sm text-slate-300" key={skill}>{skill}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="scroll-mt-20 border-y border-white/[0.06] bg-white/[0.025] px-5 py-20 sm:px-8 sm:py-24" id="education">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="My academic journey" title="Education" />
            <div className="grid gap-4 md:grid-cols-3">
              {education.map((item) => (
                <article className="rounded-2xl border border-white/[0.08] border-l-2 border-l-teal-300/70 bg-panel p-6" key={item.title}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">{item.year}</p>
                  <h3 className="mt-4 text-lg font-semibold leading-7 text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.school}</p>
                  <p className="mt-5 text-sm text-slate-300">{item.result}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-24" id="projects">
          <div className="mx-auto max-w-5xl">
            <SectionHeading eyebrow="Selected work" title="Projects" />
            <div className="grid gap-6 lg:grid-cols-2">{projects.map((project) => <ProjectCard key={project.title} project={project} />)}</div>
          </div>
        </section>

        <section className="scroll-mt-20 border-y border-white/[0.06] bg-white/[0.025] px-5 py-20 sm:px-8 sm:py-24" id="contact">
          <div className="mx-auto max-w-5xl">
            <SectionHeading eyebrow="Have a project in mind?" title="Let’s talk" />
            <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr]">
              <div className="grid content-start gap-3">
                <ContactCard href="tel:+918867718108" icon="phone" label="Call me" value="+91 8867718108" />
                <ContactCard href="mailto:arihantudagave22@gmail.com" icon="mail" label="Email" value="arihantudagave22@gmail.com" />
                <ContactCard icon="pin" label="Based in" value="Bengaluru, India" />
              </div>
              <form className="grid gap-4" onSubmit={handleContactSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-slate-300">Your name
                    <input autoComplete="name" className="rounded-xl border border-white/10 bg-panel px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300/60" name="name" placeholder="Your name" required />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-300">Your email
                    <input autoComplete="email" className="rounded-xl border border-white/10 bg-panel px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300/60" name="email" placeholder="you@example.com" required type="email" />
                  </label>
                </div>
                <label className="grid gap-2 text-sm text-slate-300">Your message
                  <textarea className="min-h-36 resize-y rounded-xl border border-white/10 bg-panel px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300/60" name="message" placeholder="Tell me a little about what you have in mind..." required />
                </label>
                <button className="inline-flex w-fit items-center gap-2 rounded-xl bg-teal-300 px-5 py-3 font-semibold text-button transition hover:bg-teal-200" type="submit">Send a message <Icon className="size-4" name="send" /></button>
                <p aria-live="polite" className="min-h-5 text-sm text-teal-200">{contactStatus}</p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div><p className="font-semibold text-white">Arihant<span className="text-teal-300">.</span></p><p className="mt-1 text-xs text-slate-500">Software developer · Bengaluru, India</p></div>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Arihant Udagave. All rights reserved.</p>
          <div className="flex gap-2">
            <SocialLink href="https://www.linkedin.com/in/arihant-udagave/" label="LinkedIn" icon="linkedin" />
            <SocialLink href="https://github.com/arihantudagave22-cyber" label="GitHub" icon="github" />
          </div>
        </div>
      </footer>

      <a aria-label="Chat with me on WhatsApp" className="whatsapp-button fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-full border border-white/15 bg-emerald-500 text-white shadow-xl shadow-black/30 transition hover:-translate-y-1 hover:bg-emerald-400" href="https://wa.me/918867718108?text=Hi%20Arihant,%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect." rel="noreferrer" target="_blank" title="Chat with me on WhatsApp">
        <svg aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
          <path d="M20.2 11.5a8.2 8.2 0 0 1-12.4 7.1L4 19.7l1.1-3.6a8.2 8.2 0 1 1 15.1-4.6Z" />
          <path d="M8.4 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .3.1.4.3l.7 1.6c.1.2.1.4 0 .5l-.5.6c-.1.1-.1.3 0 .5.4.7 1 1.3 1.8 1.7.2.1.4.1.5-.1l.6-.7c.1-.2.3-.2.5-.1l1.5.7c.2.1.3.2.3.4 0 .3-.2 1-.6 1.3-.4.4-1 .6-1.6.5-1-.2-2.1-.8-3.2-1.8-1.1-1-1.8-2.1-2-3-.2-.6 0-1.2.4-2Z" />
        </svg>
      </a>
      {showScrollTop && <button aria-label="Scroll to top" className="fixed bottom-5 right-[4.75rem] z-40 grid size-12 place-items-center rounded-xl border border-white/10 bg-panel text-slate-200 shadow-xl shadow-black/30 transition hover:border-teal-300/40 hover:text-teal-200" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} type="button"><Icon name="up" /></button>}
    </div>
  );
}

export default App;
