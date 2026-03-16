// ─── Hero ───────────────────────────────────────────────────────────────────
export type HeroContent = {
  badgeInner: string;
  badgeOuter: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  heroImageLight: string;
  heroImageDark: string;
  heroImageAlt: string;
};

// (other types unchanged...)

export type HomeContent = {
  hero: HeroContent;
  sponsors: SponsorsContent;
  benefits: BenefitsContent;
  features: FeaturesContent;
  services: ServicesContent;
  testimonials: TestimonialsContent;
  team: TeamContent;
  pricing: PricingContent;
  contact: ContactContent;
  faq: FaqContent;
  footer: FooterContent;
  navbar: NavbarContent;
};

export const defaultHomeContent: HomeContent = {
  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    badgeInner: "Startup Power",
    badgeOuter: "Welcome to MailFlux",
    titleBefore: "Effortless",
    titleHighlight: "Email Marketing",
    titleAfter: "for Startups",
    subtitle:
      "MailFlux helps startups engage audiences, automate campaigns, and grow—all with an easy, powerful email marketing platform built just for founders.",
    primaryCta: { label: "Get Started Free", href: "#pricing" },
    secondaryCta: { label: "See Startup Features", href: "#features" },
    heroImageLight: "/hero-image-light.jpeg",
    heroImageDark: "/hero-image-dark.jpeg",
    heroImageAlt: "MailFlux dashboard preview",
  },

  // ── Sponsors ─────────────────────────────────────────────────────────────
  sponsors: {
    heading: "Backed by proven cloud & AI tools",
    items: [
      { icon: "Crown", name: "Vercel" },
      { icon: "Vegan", name: "Stripe" },
      { icon: "Ghost", name: "OpenAI" },
      { icon: "Puzzle", name: "Supabase" },
      { icon: "Cookie", name: "Resend" },
    ],
  },

  // ── Benefits ─────────────────────────────────────────────────────────────
  benefits: {
    eyebrow: "Why MailFlux",
    heading: "Email Marketing Built for Startup Growth",
    description:
      "Launch your first campaign in minutes. Built from the ground up to let startup teams focus on growth—without tech headaches or hidden costs.",
    items: [
      {
        icon: "Send",
        title: "Send With Confidence",
        description: "Simple campaign flows, bounce protection, and clean email delivery—out of the box.",
      },
      {
        icon: "Users",
        title: "Audience Management",
        description: "Segment lists, manage unsubscribes, and keep founders in full control of audience data.",
      },
      {
        icon: "LayoutPanelTop",
        title: "No-Code Templates",
        description: "Quickly build beautiful campaigns—no designer required.",
      },
      {
        icon: "ChartBar",
        title: "Startup-Friendly Analytics",
        description: "Actionable insights into opens, clicks, bounces, and engagement. No wasted time.",
      },
    ],
  },

  // ── Features ─────────────────────────────────────────────────────────────
  features: {
    eyebrow: "MailFlux Features",
    heading: "Everything Startups Need—Right Out of the Box",
    subtitle:
      "Focus on what matters: connect with your audience, automate workflows, and accelerate your startup’s growth. MailFlux makes email marketing painless—for founders, teams, and marketers.",
    items: [
      { icon: "Mail", title: "Campaign Management", description: "Create, schedule, and send beautiful campaigns tailored for your startup’s brand." },
      { icon: "Users2", title: "Audience Lists & Segments", description: "Import, segment, and manage contacts with powerful tools—no list fatigue." },
      { icon: "Palette", title: "Template Builder", description: "Drag-and-drop or code your perfect newsletter. Save and reuse favorite layouts." },
      { icon: "Clock", title: "Advanced Scheduling", description: "Send now or later—never miss the perfect launch window, even across timezones." },
      { icon: "BarChartHorizontal", title: "Real-Time Reporting", description: "Track delivered, opened, and clicked. See what’s working and double down." },
      { icon: "Lock", title: "Multi-tenant & Secure", description: "Every team, template, audience, and campaign is isolated and protected by default." },
    ],
  },

  // ── Services ─────────────────────────────────────────────────────────────
  services: {
    eyebrow: "Services",
    heading: "What MailFlux Delivers",
    subtitle:
      "A focused, founder-friendly platform to help you scale, learn, and grow—without complexity.",
    items: [
      { title: "Instant Campaigns", description: "Go from draft to delivered in minutes, not days.", pro: false },
      { title: "Audience Import", description: "Upload CSV lists—no app switching required.", pro: false },
      { title: "Starter Templates", description: "Choose from proven layouts or make your own.", pro: false },
      { title: "Stats First", description: "Metrics that make sense—open rate, CTR, and list growth live in your dashboard.", pro: true },
    ],
  },

  // ── Testimonials ─────────────────────────────────────────────────────────
  testimonials: {
    eyebrow: "Why Startups Love MailFlux",
    heading: "From Zero to Inbox in Record Time",
    reviews: [
      { image: "/demo-img.jpg", name: "Rachel Lee", role: "Co-founder, Brite", comment: "We ran our first campaign in under 15 minutes. Unmatched for early stage startups.", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Dev Sharma", role: "Growth Marketer, NeoForms", comment: "Intuitive, fast, and every feature just works. MailFlux sets the bar for SaaS email tools.", rating: 4.9 },
      { image: "/demo-img.jpg", name: "Helen Wu", role: "Founder, Uply", comment: "Best onboarding and campaign builder I’ve tried as a solo founder.", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Felix Müller", role: "Product Lead, Sprintly", comment: "Analytics and CSV import even in the starter plan—no extra charge.", rating: 4.8 },
      { image: "/demo-img.jpg", name: "Anders Jonsson", role: "CTO, LaunchLion", comment: "Compliant, reliable, and founder-focused. Exactly what we needed.", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Amina El-Refai", role: "Head of Marketing, SproutIQ", comment: "MailFlux is the go-to for our bootstrapped launch team. No-nonsense pricing, too.", rating: 5.0 },
    ],
  },

  // ── Team ─────────────────────────────────────────────────────────────────
  team: {
    eyebrow: "Team",
    heading: "Meet the MailFlux Team",
    members: [
      {
        imageUrl: "/team1.jpg",
        firstName: "Leo",
        lastName: "Miranda",
        positions: ["Product Engineering"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/leopoldo-miranda/" },
          { name: "Github", url: "https://github.com/leoMirandaa" },
        ],
      },
      // ...retain a similar structure as before, but update the heading and adjust other bios later
    ],
  },

  // ── Pricing ──────────────────────────────────────────────────────────────
  pricing: {
    eyebrow: "Pricing",
    heading: "Startup-Friendly Pricing",
    subtitle: "Simple, flat-rate plans. Start free and scale as you grow—no contracts or surprise fees.",
    priceSuffix: "/month",
    plans: [
      {
        title: "Launch",
        popular: false,
        price: 0,
        description: "All core features. Up to 1,000 emails/month. Perfect for new startups.",
        buttonText: "Get Started Free",
        benefits: [
          "Campaign manager",
          "Audience lists (CSV supported)",
          "Template builder",
          "Basic insights",
          "Up to 3 users",
          "Email support"
        ],
      },
      {
        title: "Scale",
        popular: true,
        price: 49,
        description: "For growing teams. 10,000 emails/month + advanced reporting.",
        buttonText: "Upgrade & Scale",
        benefits: [
          "Enhanced analytics",
          "Full segmentation",
          "Unlimited templates",
          "Priority support",
          "Unlimited team members"
        ],
      },
      {
        title: "Pro",
        popular: false,
        price: 199,
        description: "Serious reach for established startups – custom send limits, onboarding, and more.",
        buttonText: "Contact Us",
        benefits: [
          "Custom quotas",
          "Dedicated delivery",
          "Personalized onboarding",
          "Advanced compliance",
          "Direct founder support"
        ],
      },
    ],
  },

  // ── Contact ──────────────────────────────────────────────────────────────
  contact: {
    eyebrow: "Contact",
    heading: "Connect with MailFlux",
    description:
      "Questions about onboarding, integrations, or growth? Reach out to MailFlux—founder-friendly support, always.",
    mailtoAddress: "hi@chirag.co",
    info: {
      address: { label: "Find us", value: "Remote-first • San Francisco, CA" },
      phone: { label: "Call us", value: "" },
      email: { label: "Email us", value: "hi@chirag.co" },
      hours: { label: "Office hours", value: ["Monday - Friday", "9AM - 5PM PT"] },
    },
    formSubjects: ["Product Onboarding", "CSV Import Question", "Partnership Inquiry", "Startup Pricing", "Press"],
    formSubmitLabel: "Get in touch",
  },

  // ── FAQ ──────────────────────────────────────────────────────────────────
  faq: {
    eyebrow: "FAQ",
    heading: "MailFlux Answers for Startups",
    items: [
      { question: "Is MailFlux free to start?", answer: "Yes! Start campaigns on the Launch plan, then only pay to scale." },
      { question: "Can I import my existing audience?", answer: "Absolutely—MailFlux allows CSV contact import for quick setup." },
      { question: "Can my whole team collaborate?", answer: "Invite teammates, assign roles, and work together on campaigns and stats." },
      { question: "Does MailFlux protect my data?", answer: "MailFlux is built for startups, with strong tenant isolation and privacy controls by default." },
      { question: "Will I see campaign analytics?", answer: "Every campaign includes instant insights: delivery, opens, clicks, bounces, unsubscribes, and more." },
    ],
  },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    brandName: "MailFlux",
    columns: [
      {
        heading: "Contact",
        links: [
          { label: "hi@chirag.co", href: "mailto:hi@chirag.co" },
          { label: "Github", href: "#" },
          { label: "LinkedIn", href: "https://linkedin.com" },
          { label: "Twitter", href: "https://x.com" },
        ],
      },
      {
        heading: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Contact", href: "#contact" },
        ],
      },
      {
        heading: "Help",
        links: [
          { label: "Contact Us", href: "#contact" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        heading: "Socials",
        links: [
          { label: "GitHub", href: "https://github.com" },
          { label: "LinkedIn", href: "https://linkedin.com" },
          { label: "X", href: "https://x.com" },
        ],
      },
    ],
    copyright: "© 2026 MailFlux. All rights reserved.",
    attribution: { label: "Built on Next.js", href: "https://nextjs.org" },
  },

  // ── Navbar ───────────────────────────────────────────────────────────────
  navbar: {
    brandName: "MailFlux",
    routes: [
      { href: "/#testimonials", label: "Why Startups Love MailFlux" },
      { href: "/#features", label: "Features" },
      { href: "/#contact", label: "Contact" },
      { href: "/#faq", label: "FAQ" },
    ],
    featureDropdownLabel: "Startup Features",
    featureImage: { src: "/demo-img.jpg", alt: "Startup campaign preview" },
    features: [
      { title: "Campaign Management", description: "Create, schedule, and report with startup-scale speed." },
      { title: "Audience Management", description: "Import, segment, and manage contacts in one view." },
      { title: "Template Builder", description: "Design beautiful emails—no code, no bloat." },
    ],
    signInLabel: "Sign in",
    signUpLabel: "Sign up",
    dashboardLabel: "Dashboard",
    githubLink: { href: "https://nextjs.org/docs", ariaLabel: "View on GitHub" },
  },
};

export function getHomeContent(): HomeContent {
  return defaultHomeContent;
}