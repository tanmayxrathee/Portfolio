import { useEffect, useRef, useState } from "react";
import { CrtOverlay } from "./components/CrtOverlay";
import { PixelCanvas } from "./components/PixelCanvas";
import { activeBackground, backgroundImages, content } from "./data/content";

const sectionIds = ["hero", "about", "skills", "projects", "contact"] as const;
type SectionId = (typeof sectionIds)[number];

export default function App() {
  const image = backgroundImages[activeBackground];
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [crtIntensity, setCrtIntensity] = useState(0.72);
  const [scanlines, setScanlines] = useState(true);
  const [pixelSize, setPixelSize] = useState(12);
  const controlsButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.title = content.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", content.description);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(preference.matches);
    const updatePreference = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const ratios = new Map<SectionId, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id as SectionId, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        const next = sectionIds.reduce((best, id) => (
          (ratios.get(id) ?? 0) > (ratios.get(best) ?? 0) ? id : best
        ), "hero" as SectionId);
        setActiveSection(next);
      },
      { threshold: [0.25, 0.5, 0.75] },
    );

    for (const id of sectionIds) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!controlsOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setControlsOpen(false);
        controlsButton.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [controlsOpen]);

  const goToNextSection = () => {
    const currentIndex = sectionIds.indexOf(activeSection);
    const nextSection = sectionIds[(currentIndex + 1) % sectionIds.length];
    document.getElementById(nextSection)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const isLastSection = activeSection === "contact";
  const visibleSectionIndex = sectionIds.indexOf(activeSection) + 1;

  return (
    <div className="portfolio">
      <div
        className="pixel-stage"
        role="img"
        aria-label={image.alt}
        style={{ backgroundImage: `linear-gradient(180deg, rgba(10, 8, 8, .38), rgba(10, 8, 8, .44)), url("${image.src}")` }}
      >
        <PixelCanvas imageSrc={image.src} pixelSize={pixelSize} reducedMotion={reducedMotion} />
      </div>
      <CrtOverlay intensity={crtIntensity} scanlines={scanlines} />

      <main>
        <section className="hero" id="hero" aria-labelledby="hero-title" data-enter>
          <div className="hero__topline">
            <span>{content.hero.eyebrow}</span>
            <span>{content.location}</span>
          </div>
          <div className="hero__copy">
            <p className="hero__overline">{content.hero.overline}</p>
            <h1 id="hero-title">{content.hero.headline}</h1>
            <p className="hero__tagline">{content.hero.tagline}</p>
            <a className="hero__contact" href="#contact">
              {content.hero.contactAction}<span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero__coordinates" aria-hidden="true">
            <span>{content.pronouns.toUpperCase()}</span>
            <span>{String(visibleSectionIndex).padStart(2, "0")} — {String(sectionIds.length).padStart(2, "0")}</span>
          </div>
        </section>

        <section className="story-section about-section" id="about" aria-labelledby="about-title">
          <div className="section-meta">
            <span>{content.about.label}</span>
            <span>{content.about.index} / 04</span>
          </div>
          <div className="about-layout">
            <h2 id="about-title">{content.about.title}</h2>
            <div className="about-copy">
              {content.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <dl className="facts-list">
                {content.about.facts.map((fact) => (
                  <div className="fact" key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="story-section skills-section" id="skills" aria-labelledby="skills-title">
          <div className="section-meta">
            <span>{content.skills.label}</span>
            <span>{content.skills.index} / 04</span>
          </div>
          <div className="skills-intro">
            <h2 id="skills-title">{content.skills.title}</h2>
            <p>{content.skills.intro}</p>
          </div>
          <ol className="skills-list">
            {content.skills.items.map((skill) => (
              <li className="skill" key={skill.number}>
                <span className="skill__number">{skill.number}</span>
                <span className="skill__name">{skill.name}</span>
                <span className="skill__note">{skill.note}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="story-section projects-section" id="projects" aria-labelledby="projects-title">
          <div className="section-meta">
            <span>{content.projects.label}</span>
            <span>{content.projects.index} / 04</span>
          </div>
          <div className="projects-intro">
            <h2 id="projects-title">{content.projects.title}</h2>
            <p>{content.projects.intro}</p>
          </div>
          <ol className="projects-list">
            {content.projects.entries.map((project) => (
              <li className="project-row" key={project.number}>
                <span className="project-row__number">{project.number}</span>
                <span className="project-row__title">{project.title}</span>
                <span className="project-row__status">{project.status}</span>
                <span className="project-row__mark" aria-hidden="true">↗</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="story-section contact-section" id="contact" aria-labelledby="contact-title">
          <div className="section-meta">
            <span>{content.contact.label}</span>
            <span>{content.contact.index} / 04</span>
          </div>
          <div className="contact-layout">
            <div className="contact-copy">
              <h2 id="contact-title">{content.contact.title}</h2>
              <p>{content.contact.note}</p>
              <a className="contact-email" href={`mailto:${content.contact.email}`}>
                {content.contact.email}<span aria-hidden="true">↗</span>
              </a>
            </div>
            <nav className="social-links" aria-label="Social profiles">
              {content.contact.socials.map((social) => (
                <a href={social.href} key={social.name} target="_blank" rel="noreferrer">
                  <span>{social.name}</span><span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          </div>
          <footer className="page-footer">
            <span>{content.footer}</span>
            <a className="image-credits" href="/credits.html">Image sources · Unsplash</a>
            <a href="#hero">{content.name} · Back to top ↑</a>
          </footer>
        </section>
      </main>

      <div className="screen-controls">
        <div className="controls-dock">
          {controlsOpen && (
            <div className="controls-panel" id="screen-controls-panel" role="dialog" aria-labelledby="controls-title">
              <div className="controls-panel__heading">
                <h2 id="controls-title">{content.controls.title}</h2>
                <button
                  className="controls-panel__close"
                  type="button"
                  aria-label={content.controls.close}
                  onClick={() => {
                    setControlsOpen(false);
                    controlsButton.current?.focus();
                  }}
                >
                  ×
                </button>
              </div>
              <label className="range-control" htmlFor="crt-intensity">
                <span><span>{content.controls.crtIntensity}</span><output>{Math.round(crtIntensity * 100)}%</output></span>
                <input
                  id="crt-intensity"
                  type="range"
                  min="0.15"
                  max="1"
                  step="0.05"
                  value={crtIntensity}
                  onChange={(event) => setCrtIntensity(Number(event.target.value))}
                />
              </label>
              <label className="toggle-control" htmlFor="scanlines">
                <span>{content.controls.scanlines}</span>
                <input
                  id="scanlines"
                  type="checkbox"
                  checked={scanlines}
                  onChange={(event) => setScanlines(event.target.checked)}
                />
                <span className="toggle-control__switch" aria-hidden="true" />
              </label>
              <label className="range-control" htmlFor="pixel-size">
                <span><span>{content.controls.pixelSize}</span><output>{pixelSize}px</output></span>
                <input
                  id="pixel-size"
                  type="range"
                  min="8"
                  max="20"
                  step="2"
                  value={pixelSize}
                  onChange={(event) => setPixelSize(Number(event.target.value))}
                />
              </label>
            </div>
          )}
          <button
            ref={controlsButton}
            className="screen-button"
            type="button"
            aria-label={content.controls.open}
            aria-expanded={controlsOpen}
            aria-controls="screen-controls-panel"
            onClick={() => setControlsOpen((open) => !open)}
          >
            <span>{content.hero.control}</span>
            <span aria-hidden="true">{controlsOpen ? "−" : "+"}</span>
          </button>
        </div>
        <button
          className="screen-button screen-button--continue"
          type="button"
          aria-label={isLastSection ? content.hero.returnToTop : content.hero.continueLabel}
          onClick={goToNextSection}
        >
          <span>{isLastSection ? content.hero.returnToTop : content.hero.continue}</span>
          <span className={`chevrons${isLastSection ? " chevrons--up" : ""}`} aria-hidden="true"><i /><i /></span>
        </button>
      </div>
    </div>
  );
}
