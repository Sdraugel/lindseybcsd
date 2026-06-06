# Claude Code Prompt — Draugel for District 2

Build a single-page campaign website for a school board candidate. Use **Angular (latest, standalone components + signals)**, **Tailwind CSS**, and **@spartan-ng/ui** primitives. Add **Motion One** (or @angular/animations) for subtle scroll-reveal animations. The site is a marketing landing page, not an app — prioritize a distinctive, polished look over component density.

## Design theme: "notebook paper"
The campaign signs use a lined-notebook-paper aesthetic. Match it, but make it feel modern and intentional, not clip-arty.

- **Background:** off-white paper with faint horizontal ruled lines (light blue) and a single vertical red margin line on the left. Use CSS (repeating-linear-gradient), not an image. Lines should be subtle and not interfere with readability.
- **Primary headline color:** bold royal blue (~#2748C8), rendered in a rounded "bubble"/marker display font (e.g. a chunky rounded font like "Baloo 2", "Fredoka", or similar from Google Fonts) with a slight darker outline/shadow to echo the sign.
- **Accent / secondary color:** dusty raspberry/mauve (~#B05878) for sub-headings, the "For School Board" tagline style, and key callouts.
- **Hand-drawn checkmarks:** the brand motif is a hand-drawn checkbox + check. Recreate as an inline SVG component and use it as the bullet for issue lists and key points. Slightly imperfect/sketchy stroke.
- **Body text:** clean, legible sans-serif (e.g. Inter or Nunito) in dark slate, not pure black.
- Keep generous whitespace. Mobile-first, fully responsive. Fast load, accessible (WCAG AA contrast, semantic headings, alt text).

## Candidate info
- **Name:** Lindsey Draugel
- **Slogan/handle:** Draugel for District 2
- **Contact email:** draugelfordistrict2@gmail.com
- **Office:** Berkeley County School District Board, District 2

## Page sections (in order)

### 1. Hero
- Big bubble-font headline: **DRAUGEL**
- Sub-headline in raspberry: **For School Board · District 2**
- Two hand-drawn-checkmark lines: "✔ For our students."  "✔ For our teachers."
- Primary CTA button: **Get Involved** (scrolls to contact). Optional secondary: **Meet Lindsey** (scrolls to bio).

### 2. Meet Lindsey (bio)
Use this copy:

> My name is Lindsey Draugel and I am a mom of three boys, including a child who is neurodivergent. Being a parent of a neurodivergent kiddo and navigating this school system motivated me to run for school board.
>
> I spent over 20 years in childcare, starting as a teacher in a classroom then building and running a preschool program from the ground up. I've researched developmentally appropriate practices, I know what it looks like when a school environment works for kids, and I know what it looks like when it doesn't.
>
> For the past several months I have been showing up at BCSD board meetings, asking hard questions, and advocating for students, teachers, and families who deserve better. I am running for the District 2 school board seat because our children and teachers need someone in that room who will fight for them every single day.

Add a short one-liner above it as a summary:
> As a parent, early childhood educator, and community advocate, I'm committed to being a student-centered, teacher-forward voice for our district.

Leave a clearly-marked placeholder `<!-- PHOTO: Lindsey headshot -->` for a portrait.

### 3. Experience / Background
Present as a clean timeline or card list (use the checkmark motif as accents):
- **20+ years in early childhood education & care** — started as a teacher across every age group (6 weeks to preK).
- **Assistant Director** at Trident Kids Academy and Coastal Kids Academy.
- **Built & ran the preschool program** at Cainhoy Children's Academy (2019–2022) — won Charleston's Choice Award for Childcare/Daycare in **2020 and 2021**.
- **PSE PTA:** 4 years volunteering; 3 years (going on 4th) on the board — Teacher Appreciation co-chair (2 yrs), Events chair + Teacher Appreciation committee (1 yr), Events chair again next year.
- **Currently:** Administrative Assistant at Happy Hearts Therapy.

### 4. Priorities / Issues
Four cards, each with a hand-drawn-checkmark icon, a heading, and the text below:

- **Teacher Support** — Improve working conditions, fill vacancies, and ensure teachers have the resources and classroom support they need to stay and thrive.
- **Curriculum & Assessment Reform** — Partner with curriculum and academic departments to rework pacing guides, reduce over-reliance on standardized assessments, and limit screen time in early elementary grades.
- **Intervention & Student Support** — Restore reading and math interventionists and promote Social Emotional Learning at every level, starting in lower elementary.
- **Parent Education & Communication** — Ensure families receive clear, transparent communication so they can be informed and empowered partners in their child's education.

### 5. Get Involved / Contact
- Email signup or contact form (name + email + optional message). Wire the form with a clearly-marked TODO for backend/Formspree/EmailJS — do not invent an endpoint.
- Display contact email: draugelfordistrict2@gmail.com
- Social links as placeholders.

### 6. Footer
- "Paid for by [PLACEHOLDER — campaign committee name]" (leave a comment; SC campaign finance disclaimers may be required — flag this for the user to confirm).
- Copyright line, email.

## Technical requirements
- Standalone components, one per section, composed in a single landing page route.
- Centralize theme tokens (colors, fonts, spacing) in Tailwind config + CSS variables so they're easy to tweak.
- Make the notebook background and the hand-drawn checkmark reusable components.
- Scroll-triggered fade/slide-in for sections; keep animations subtle and respect `prefers-reduced-motion`.
- No placeholder lorem ipsum — use the real copy above. Use clearly-labeled comments for any asset the user must supply (photos, social URLs, form endpoint, disclaimer).
- Include a short README with run instructions and a list of all the TODO placeholders to fill in.

Scaffold the project, install dependencies, and build all sections. Then summarize what's done and exactly which placeholders I need to fill in.
