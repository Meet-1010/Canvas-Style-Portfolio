// The live domain. Everything SEO-related is built from it: the canonical
// URL, the sitemap, Open Graph tags and the structured data that tells search
// engines this site is Meet. If this ever points at a host that isn't the
// real site, search engines are told the canonical version lives elsewhere —
// worse than having no canonical at all, so keep it in step with the domain
// actually serving the site. Override per-environment with NEXT_PUBLIC_SITE_URL.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://meetchauhan.me"
).replace(/\/$/, "");

export const siteConfig = {
  name: "Meet Chauhan",
  fullName: "Meet Chauhan",
  subtitle: "Full Stack Developer · Open to opportunities",
  tagline: "I think in systems · I build for humans",
  photo: "/profile.jpg",
  links: {
    resume: "/MeetChauhan_FullStackDeveloper.pdf",
    linkedin: "https://linkedin.com/in/meet-chauhan-5574a4264/",
    email: "meetsc04@gmail.com",
    github: "https://github.com/Meet-1010",
    twitter: "#",
    figma: "#",
    unsplash: "#",
    instagram: "#",
    red: "#",
  },
  bio: [
    {
      text: "Full Stack Developer with hands-on experience building **scalable web applications**.",
    },
    {
      text: "Passionate about frontend craft — JavaScript, TypeScript, React, Vue, and the details that make products feel right.",
    },
    {
      text: "If you want a developer who **thinks deeply, ships cleanly, and never stops learning** — let's connect:",
    },
  ],
  connectUrl: "mailto:meetsc04@gmail.com",
  sections: [
    {
      id: "projects",
      title: "Projects",
      description:
        "Full Stack Developer building **scalable web apps** — from real estate platforms to AI-powered IDEs.",
      highlights: [
        {
          text: "I turn complex requirements into clean, maintainable code with a focus on UX and performance.",
        },
      ],
      cta: { label: "View on GitHub", url: "https://github.com/Meet-1010" },
    },
    {
      id: "skills",
      title: "Technical Skills",
      description:
        "Comfortable across the stack — from pixel-perfect frontends to backend APIs and databases.",
      highlights: [
        { text: "**Frontend:** HTML, CSS, JavaScript, TypeScript, React, Vue, Angular, Tailwind CSS, Bootstrap" },
        { text: "**Backend:** Node.js, Express.js, PHP" },
        { text: "**Databases:** MySQL, MongoDB, Firebase" },
        { text: "**Tools:** Git, Electron, Vite, AI APIs (Gemini, OpenAI, Claude)" },
      ],
      cta: { label: "See my resume", url: "/MeetChauhan_FullStackDeveloper.pdf" },
    },
    {
      id: "experience",
      title: "Experience",
      description:
        "Currently a **Full Stack Developer Intern at Rishabh Software** (Jan 2026 – Present), contributing to web application development and backend API design.",
      highlights: [
        {
          text: "Secured **8th Rank at AceHack 5.0** — Rajasthan's largest MLH-partnered 36-hour national hackathon (UEM Jaipur, March 2026).",
        },
        {
          text: "Authored research paper: **UdhyogUnity - A Digital Platform for Local Home Businesses** (September 2025).",
        },
      ],
      cta: { label: "View LinkedIn", url: "https://linkedin.com/in/meet-chauhan-5574a4264/" },
    },
    {
      id: "education",
      title: "Education",
      description:
        "Pursuing **B.Tech in Computer Science & Engineering** at Parul Institute of Engineering & Technology (2023–2026), CGPA 8.31/10.",
      highlights: [
        { text: "Diploma in Electrical Engineering — MSU Polytechnic (2020–2023)" },
        { text: "AWS Cloud Practitioner Essentials Certificate" },
        { text: "Meta Frontend Development Certificate — Coursera" },
        { text: "Full Stack MERN Training — Coding Blocks" },
      ],
      cta: { label: "See my resume", url: "/MeetChauhan_FullStackDeveloper.pdf" },
    },
  ],
  footer: {
    copyright: "2026",
    domain: "meetchauhan.me",
  },
};
