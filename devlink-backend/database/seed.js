import bcrypt from "bcryptjs";
import connectToDatabase from "./mongodb.js";
import User from "../models/user.js";
import Profile from "../models/profile.js";
import Project from "../models/project.js";

const DEFAULT_PASSWORD = "Password123!";

const seedData = [
  {
    email: "tkyehab@gmail.com",
    name: "taky_allah",
    profile: {
      title: "Full Stack Engineer & Web Architect",
      location: "Cairo, Egypt",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
      bio: "Passionate full-stack developer building scalable web applications with React, Node.js, and modern cloud stacks.",
      education: "B.S. Business & Information Systems, Alexandria University",
      github: "https://github.com/takyEhab",
      linkedin: "https://linkedin.com/in/taky-ehab",
      portfolio: "https://dev-link-frontend-mu.vercel.app",
      skills: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JavaScript", "TypeScript"],
    },
    projects: [
      {
        title: "DevLink Developer Network",
        description:
          "A collaborative platform for tech professionals to showcase portfolios, discover developer talent, and connect in real-time.",
        technologies: ["React", "Node.js", "MongoDB", "Tailwind CSS", "Socket.IO"],
        duration: "2 months",
        githubLink: "https://github.com/takyEhab/dev-link",
        liveDemo: "https://dev-link-frontend-mu.vercel.app",
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop",
      },
      {
        title: "TaskForge Pro Kanban",
        description:
          "Agile project and sprint management tool with drag-and-drop workflow boards, team collaboration, and productivity analytics.",
        technologies: ["React", "TypeScript", "Tailwind CSS", "Express"],
        duration: "1.5 months",
        githubLink: "https://github.com/takyEhab",
        liveDemo: "https://dev-link-frontend-mu.vercel.app",
        image:
          "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&h=500&fit=crop",
      },
    ],
  },
  {
    email: "atlas_1792082695137@example.com",
    name: "Taky Gad",
    profile: {
      title: "Senior Full Stack Engineer",
      location: "Cairo, Egypt",
      avatar:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face",
      bio: "Building high-performance cloud applications with React, Node.js, and distributed document databases.",
      education: "Computer Science, Cairo University",
      github: "https://github.com/takyEhab",
      linkedin: "https://linkedin.com/in/taky-ehab",
      portfolio: "https://dev-link-frontend-mu.vercel.app",
      skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express", "REST APIs"],
    },
    projects: [
      {
        title: "CloudScale Metrics Hub",
        description:
          "Serverless telemetry dashboard monitoring real-time API latency and throughput across distributed microservices.",
        technologies: ["Node.js", "React", "MongoDB", "Docker"],
        duration: "3 months",
        githubLink: "https://github.com/takyEhab",
        liveDemo: "https://dev-link-frontend-mu.vercel.app",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
      },
    ],
  },
  {
    email: "hamed@gmail.com",
    name: "Hamed",
    profile: {
      title: "Frontend & UI Developer",
      location: "Alexandria, Egypt",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      bio: "UI-focused Frontend Developer crafting responsive, accessible, and delightful web interfaces with modern CSS.",
      education: "Business, Alexandria University",
      github: "https://github.com/takyEhab",
      linkedin: "https://linkedin.com",
      portfolio: "https://dev-link-frontend-mu.vercel.app",
      skills: ["HTML5", "CSS3", "JavaScript", "React", "Tailwind CSS", "Figma"],
    },
    projects: [
      {
        title: "NexStore Modern E-Commerce",
        description:
          "Modern headless e-commerce store with seamless checkout flow, product filtering, and dark mode interface.",
        technologies: ["React", "Tailwind CSS", "JavaScript"],
        duration: "1.5 months",
        githubLink: "https://github.com/takyEhab",
        liveDemo: "https://dev-link-frontend-mu.vercel.app",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
      },
    ],
  },
  {
    email: "sarah.johnson@example.com",
    name: "Sarah Johnson",
    profile: {
      title: "Senior Full Stack Engineer",
      location: "San Francisco, CA",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
      bio: "Senior full stack engineer passionate about developer tooling, clean architecture, and delightful user experiences.",
      education: "B.S. Computer Science, Stanford University",
      github: "https://github.com/sarahjohnson",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      portfolio: "https://sarahjohnson.dev",
      skills: ["React", "TypeScript", "Node.js", "GraphQL", "Next.js", "PostgreSQL", "Tailwind CSS"],
    },
    projects: [
      {
        title: "DevPulse Engineering Analytics",
        description:
          "Real-time engineering telemetry and deployment analytics platform with GitHub CI/CD integration.",
        technologies: ["React", "TypeScript", "Node.js", "GraphQL"],
        duration: "3 months",
        githubLink: "https://github.com/sarahjohnson/devpulse",
        liveDemo: "https://devpulse.demo.com",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
      },
      {
        title: "EcoTrack Carbon Engine",
        description:
          "SaaS platform helping modern startups calculate, track, and offset their cloud infrastructure carbon footprint.",
        technologies: ["Next.js", "Tailwind CSS", "PostgreSQL", "Node.js"],
        duration: "2 months",
        githubLink: "https://github.com/sarahjohnson/ecotrack",
        liveDemo: "https://ecotrack.demo.com",
        image:
          "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?w=800&h=500&fit=crop",
      },
    ],
  },
  {
    email: "alex.rivera@example.com",
    name: "Alex Rivera",
    profile: {
      title: "DevOps & Cloud Architect",
      location: "Austin, TX",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Cloud infrastructure architect specialized in Kubernetes orchestration, zero-downtime deployments, and immutable infrastructure.",
      education: "M.S. Software Engineering, UT Austin",
      github: "https://github.com/alexrivera",
      linkedin: "https://linkedin.com/in/alexrivera",
      portfolio: "https://alexrivera.cloud",
      skills: ["Docker", "Kubernetes", "AWS", "Terraform", "Go", "CI/CD", "Prometheus"],
    },
    projects: [
      {
        title: "KubeFlow AutoScaler",
        description:
          "Intelligent horizontal pod autoscaler based on predictive traffic patterns and real-time GPU/CPU saturation.",
        technologies: ["Go", "Kubernetes", "Docker", "Prometheus"],
        duration: "4 months",
        githubLink: "https://github.com/alexrivera/kubeflow",
        liveDemo: "https://kubeflow.cloud",
        image:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
      },
      {
        title: "ZeroTrust Mesh Gateway",
        description:
          "A lightweight reverse proxy with mutual TLS authentication and granular microservice access control policies.",
        technologies: ["Go", "Docker", "AWS", "Terraform"],
        duration: "2.5 months",
        githubLink: "https://github.com/alexrivera/zerotrust",
        liveDemo: "https://zerotrust.cloud",
        image:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop",
      },
    ],
  },
  {
    email: "elena.rostova@example.com",
    name: "Elena Rostova",
    profile: {
      title: "Lead Mobile Engineer",
      location: "Berlin, Germany",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      bio: "Building fluid 60fps cross-platform mobile apps with offline-first sync and pixel-perfect design systems.",
      education: "B.S. Mobile Computing, TU Munich",
      github: "https://github.com/elenarostova",
      linkedin: "https://linkedin.com/in/elenarostova",
      portfolio: "https://elenarostova.dev",
      skills: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "Redux"],
    },
    projects: [
      {
        title: "Zenith Health & Fitness Tracker",
        description:
          "Cross-platform mobile application with Apple HealthKit and Google Fit sync, workout telemetry, and nutritional tracking.",
        technologies: ["React Native", "TypeScript", "Redux", "Firebase"],
        duration: "3.5 months",
        githubLink: "https://github.com/elenarostova/zenith",
        liveDemo: "https://zenithapp.io",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop",
      },
      {
        title: "CryptoVault Multi-Chain Wallet",
        description:
          "Non-custodial cryptocurrency mobile wallet with biometric hardware key protection and instant decentralized swaps.",
        technologies: ["Flutter", "Kotlin", "Swift", "Web3"],
        duration: "3 months",
        githubLink: "https://github.com/elenarostova/cryptovault",
        liveDemo: "https://cryptovault.app",
        image:
          "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=500&fit=crop",
      },
    ],
  },
  {
    email: "amina.hassan@example.com",
    name: "Amina Hassan",
    profile: {
      title: "AI Engineer & Data Scientist",
      location: "London, UK",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
      bio: "AI engineer focusing on production LLM agents, semantic retrieval pipelines, and actionable predictive modeling.",
      education: "M.S. Artificial Intelligence, Imperial College London",
      github: "https://github.com/aminahassan",
      linkedin: "https://linkedin.com/in/aminahassan",
      portfolio: "https://aminahassan.ai",
      skills: ["Python", "PyTorch", "LangChain", "FastAPI", "OpenAI", "Pandas", "Scikit-Learn"],
    },
    projects: [
      {
        title: "DocuMind AI Knowledge Copilot",
        description:
          "Enterprise document processing and intelligence copilot leveraging hybrid RAG retrieval and verified citations.",
        technologies: ["Python", "PyTorch", "LangChain", "FastAPI"],
        duration: "3 months",
        githubLink: "https://github.com/aminahassan/documind",
        liveDemo: "https://documind.ai",
        image:
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=500&fit=crop",
      },
      {
        title: "MarketPulse Sentiment Engine",
        description:
          "Real-time sentiment analyzer classifying market impact and financial news trends across global commodities.",
        technologies: ["Python", "Transformers", "Pandas", "FastAPI"],
        duration: "2 months",
        githubLink: "https://github.com/aminahassan/marketpulse",
        liveDemo: "https://marketpulse.ai",
        image:
          "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=500&fit=crop",
      },
    ],
  },
];

async function seedDatabase() {
  console.log("Connecting to MongoDB Atlas...");
  await connectToDatabase();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

  console.log("Seeding developers, profiles, and projects...");

  for (const item of seedData) {
    // 1. Find or create user
    let user = await User.findOne({ email: item.email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name: item.name,
        email: item.email.toLowerCase(),
        password: hashedPassword,
        role: "user",
      });
      console.log(`Created user: ${user.name} (${user.email})`);
    } else {
      user.name = item.name;
      await user.save();
      console.log(`Existing user updated: ${user.name} (${user.email})`);
    }

    const userId = user._id;

    // 2. Find or create profile
    let profile = await Profile.findOne({ user: userId });
    const profilePayload = {
      user: userId,
      userId,
      ...item.profile,
    };

    if (profile) {
      await Profile.findOneAndUpdate({ user: userId }, { $set: profilePayload });
      console.log(`  Updated profile for: ${user.name}`);
    } else {
      await Profile.create(profilePayload);
      console.log(`  Created profile for: ${user.name}`);
    }

    // 3. Upsert projects for this user
    for (const proj of item.projects) {
      const existingProject = await Project.findOne({
        user: userId,
        title: proj.title,
      });

      if (!existingProject) {
        await Project.create({
          user: userId,
          userId,
          title: proj.title,
          description: proj.description,
          technologies: proj.technologies,
          duration: proj.duration,
          github_link: proj.githubLink,
          live_demo: proj.liveDemo,
          image: proj.image,
        });
        console.log(`    Added project: "${proj.title}"`);
      } else {
        await Project.findByIdAndUpdate(existingProject._id, {
          $set: {
            description: proj.description,
            technologies: proj.technologies,
            duration: proj.duration,
            github_link: proj.githubLink,
            live_demo: proj.liveDemo,
            image: proj.image,
          },
        });
        console.log(`    Updated project: "${proj.title}"`);
      }
    }
  }

  const userCount = await User.countDocuments();
  const profileCount = await Profile.countDocuments();
  const projectCount = await Project.countDocuments();

  console.log("\nSeeding Complete!");
  console.log(`Total Users: ${userCount}`);
  console.log(`Total Profiles: ${profileCount}`);
  console.log(`Total Projects: ${projectCount}`);

  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
