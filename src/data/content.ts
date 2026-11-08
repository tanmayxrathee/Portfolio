export type BackgroundKey = "nebula" | "starMountain" | "deepSpace";

export const backgroundImages: Record<BackgroundKey, { src: string; alt: string }> = {
  nebula: {
    src: "/assets/nebula.webp",
    alt: "A colorful nebula and stars in deep space",
  },
  starMountain: {
    src: "/assets/star-mountain.webp",
    alt: "A mountain ridge beneath the Milky Way",
  },
  deepSpace: {
    src: "/assets/deep-space.webp",
    alt: "A wide field of stars in a dark sky",
  },
};

// Change this one value to switch the pixel canvas image.
export const activeBackground: BackgroundKey = "nebula";

export const content = {
  name: "Tanmay",
  pronouns: "he/him",
  title: "Tanmay — Learning by building",
  description: "Tanmay is a first-year CS & AI student from Sonipat, learning by building with code, video, and AI.",
  location: "Sonipat, Haryana, India",
  hero: {
    eyebrow: "PERSONAL INDEX / 01",
    headline: "tanmay",
    overline: "FIRST YEAR · COMPUTER SCIENCE & AI",
    tagline: "small ideas, made real one line at a time.",
    control: "CTRL",
    continue: "continued",
    returnToTop: "back to top",
    contactAction: "Contact Tanmay",
    continueLabel: "Continue to the next section",
  },
  about: {
    index: "01",
    label: "A little context",
    title: "Learning in public, building as I go.",
    paragraphs: [
      "I’m a first-year BTech student studying Computer Science and AI at Newton School of Technology, Rishihood University.",
      "Most days, I’m learning Python, trying an AI tool, or editing a video. I like taking an idea from a rough first pass to something I can share.",
    ],
    facts: [
      { label: "From", value: "Sonipat, Haryana, India" },
      { label: "Studying", value: "BTech · CS & AI · First year" },
      { label: "Before college", value: "12th · Non-Medical" },
    ],
  },
  skills: {
    index: "02",
    label: "Tools & practice",
    title: "A few things I’m learning by doing.",
    intro: "The list is a snapshot, not a scorecard.",
    items: [
      { number: "01", name: "Python", note: "Small programs, useful habits." },
      { number: "02", name: "AI", note: "Exploring how to build with it." },
      { number: "03", name: "Video editing", note: "Finding a story in the cut." },
      { number: "04", name: "Vibe coding", note: "Making ideas tangible, then refining." },
    ],
  },
  projects: {
    index: "03",
    label: "Work in progress",
    title: "Room for what comes next.",
    intro: "These spaces are ready for real projects. Nothing here is dressed up as a finished achievement.",
    entries: [
      { number: "01", title: "First project", status: "A place for a build in progress" },
      { number: "02", title: "Second project", status: "A place for something worth sharing" },
      { number: "03", title: "Third project", status: "A place for the next experiment" },
    ],
  },
  contact: {
    index: "04",
    label: "Say hello",
    title: "Have a good one to make?",
    note: "I’m open to a conversation about ideas, code, or creative work.",
    email: "your-email@example.com",
    socials: [
      { name: "GitHub", href: "https://github.com/your-handle" },
      { name: "LinkedIn", href: "https://www.linkedin.com/in/your-handle" },
      { name: "Instagram", href: "https://www.instagram.com/your-handle" },
      { name: "YouTube", href: "https://www.youtube.com/@your-handle" },
    ],
  },
  controls: {
    title: "Screen controls",
    crtIntensity: "CRT intensity",
    scanlines: "Scanlines",
    pixelSize: "Pixel size",
    close: "Close screen controls",
    open: "Open screen controls",
  },
  footer: "A small corner of the internet, made by Tanmay.",
} as const;
