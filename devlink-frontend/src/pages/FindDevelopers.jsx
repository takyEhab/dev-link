"use client";

import { useEffect, useState, useContext } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Code,
  Users,
  Award,
  ExternalLink,
  Heart,
  MessageCircle,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  Github,
  Linkedin,
  Mail,
  Phone,
  Download,
  Eye,
  Share2,
  CheckCircle,
  XCircle,
  TrendingUp,
  Sparkles,
  Zap,
  Target,
  Briefcase,
  UserRound,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { UserContext } from "../context/UserContext";
import { ProjectImage, AvatarImage } from "../components/SafeImage";

// Enhanced UI components with custom styling
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default:
      "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105",
    outline:
      "border-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 bg-transparent backdrop-blur-sm",
    ghost: "hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300",
    secondary: "bg-slate-700 text-white hover:bg-slate-600",
    glass:
      "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    warning: "bg-amber-600 text-white hover:bg-amber-700",
    premium:
      "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1",
  };

  const sizes = {
    default: "h-11 py-2.5 px-5",
    sm: "h-9 py-1.5 px-3 text-xs",
    lg: "h-14 py-3.5 px-8 text-base",
    icon: "h-11 w-11",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", ...props }) => (
  <div
    className={`rounded-2xl border bg-slate-800/60 border-slate-700/50 text-white shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm hover:bg-slate-800/80 hover:border-emerald-500/30 group ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const variants = {
    default: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-300",
    outline:
      "border border-emerald-400/40 text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20",
    success: "bg-emerald-600/20 border border-emerald-500/40 text-emerald-400",
    warning: "bg-amber-600/20 border border-amber-500/40 text-amber-400",
    danger: "bg-red-600/20 border border-red-500/40 text-red-400",
    premium: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    glow: "bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 shadow-lg shadow-emerald-500/25",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 hover:scale-110 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-14 w-full rounded-xl border-2 border-slate-600 bg-slate-800/50 px-5 py-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm transition-all duration-300 ${className}`}
    {...props}
  />
);

const Select = ({ className = "", children, ...props }) => (
  <select
    className={`flex h-14 w-full rounded-xl border-2 border-slate-600 bg-slate-800/50 px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </select>
);

// Enhanced talent profiles data with more details
const _talentProfiles = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Full Stack Developer",
    location: "San Francisco, CA",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    reviews: 47,
    hourlyRate: 85,
    availability: "Available",
    experience: "8+ years",
    projects: 24,
    skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB", "Docker"],
    specialties: [
      "E-commerce",
      "SaaS",
      "API Development",
      "Cloud Architecture",
    ],
    languages: ["English", "Spanish"],
    education: "BS Computer Science, Stanford",
    featured: true,
    verified: true,
    premium: true,
    recentProjects: [
      {
        title: "E-Commerce Platform",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=120&fit=crop",
        tech: ["React", "Node.js", "Stripe"],
      },
      {
        title: "SaaS Dashboard",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=120&fit=crop",
        tech: ["Vue.js", "Python", "PostgreSQL"],
      },
    ],
    bio: "Passionate full-stack developer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture. I love creating user-centric solutions that drive business growth.",
  },
  {
    id: 2,
    name: "Alex Chen",
    title: "Frontend Specialist & UI/UX Designer",
    location: "New York, NY",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    reviews: 32,
    hourlyRate: 75,
    availability: "Available",
    experience: "6+ years",
    projects: 18,
    skills: ["React", "Vue.js", "TypeScript", "Figma", "CSS", "Animation"],
    specialties: ["UI/UX Design", "Animation", "Design Systems", "Performance"],
    languages: ["English", "Mandarin"],
    education: "BFA Design, Parsons",
    featured: false,
    verified: true,
    premium: false,
    recentProjects: [
      {
        title: "Design System",
        image:
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=120&fit=crop",
        tech: ["React", "Storybook", "Figma"],
      },
      {
        title: "Animation Library",
        image:
          "https://images.unsplash.com/photo-1558655146-d09347e92766?w=200&h=120&fit=crop",
        tech: ["Framer Motion", "TypeScript"],
      },
    ],
    bio: "Creative frontend developer and UI/UX designer focused on creating beautiful, accessible, and performant user experiences. Expert in modern CSS, animations, and design systems.",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    title: "Backend Engineer & DevOps Specialist",
    location: "Austin, TX",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    reviews: 41,
    hourlyRate: 90,
    availability: "Busy",
    experience: "10+ years",
    projects: 31,
    skills: ["Python", "Django", "PostgreSQL", "Docker", "Kubernetes", "AWS"],
    specialties: ["APIs", "Microservices", "DevOps", "Database Design"],
    languages: ["English", "Spanish"],
    education: "MS Computer Science, UT Austin",
    featured: true,
    verified: true,
    premium: true,
    recentProjects: [
      {
        title: "API Gateway",
        image:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&h=120&fit=crop",
        tech: ["Python", "FastAPI", "Redis"],
      },
      {
        title: "Microservices Platform",
        image:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=120&fit=crop",
        tech: ["Docker", "Kubernetes", "PostgreSQL"],
      },
    ],
    bio: "Senior backend engineer with extensive experience in building scalable, high-performance systems. Expert in Python, cloud architecture, and DevOps practices. Passionate about clean code and system reliability.",
  },
  {
    id: 4,
    name: "Emily Davis",
    title: "Mobile Developer & React Native Expert",
    location: "Seattle, WA",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    reviews: 28,
    hourlyRate: 80,
    availability: "Available",
    experience: "5+ years",
    projects: 15,
    skills: ["React Native", "Flutter", "iOS", "Android", "Firebase", "Redux"],
    specialties: [
      "Cross-platform",
      "Native Apps",
      "Performance",
      "Push Notifications",
    ],
    languages: ["English"],
    education: "BS Software Engineering, UW",
    featured: false,
    verified: true,
    premium: false,
    recentProjects: [
      {
        title: "Fitness App",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=120&fit=crop",
        tech: ["React Native", "Firebase", "Redux"],
      },
      {
        title: "E-commerce Mobile",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=120&fit=crop",
        tech: ["Flutter", "Stripe", "Firebase"],
      },
    ],
    bio: "Mobile development specialist with expertise in React Native and Flutter. Focused on creating smooth, performant mobile experiences that users love. Experienced in both iOS and Android development.",
  },
  {
    id: 5,
    name: "David Kim",
    title: "Data Scientist & ML Engineer",
    location: "Boston, MA",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    reviews: 35,
    hourlyRate: 100,
    availability: "Available",
    experience: "7+ years",
    projects: 19,
    skills: ["Python", "TensorFlow", "PyTorch", "SQL", "R", "AWS"],
    specialties: [
      "Machine Learning",
      "Data Analytics",
      "Computer Vision",
      "NLP",
    ],
    languages: ["English", "Korean"],
    education: "PhD Computer Science, MIT",
    featured: true,
    verified: true,
    premium: true,
    recentProjects: [
      {
        title: "ML Dashboard",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=120&fit=crop",
        tech: ["Python", "TensorFlow", "React"],
      },
      {
        title: "Recommendation Engine",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=120&fit=crop",
        tech: ["Python", "Scikit-learn", "PostgreSQL"],
      },
    ],
    bio: "Data scientist and ML engineer with a PhD from MIT. Specialized in building intelligent systems and data-driven solutions. Expert in deep learning, computer vision, and natural language processing.",
  },
  {
    id: 6,
    name: "Lisa Wang",
    title: "DevOps Engineer & Cloud Architect",
    location: "Los Angeles, CA",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    reviews: 22,
    hourlyRate: 95,
    availability: "Available",
    experience: "9+ years",
    projects: 22,
    skills: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Docker", "Linux"],
    specialties: ["Cloud Architecture", "Automation", "Security", "Monitoring"],
    languages: ["English", "Mandarin"],
    education: "BS Computer Engineering, UCLA",
    featured: false,
    verified: true,
    premium: false,
    recentProjects: [
      {
        title: "Cloud Infrastructure",
        image:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=120&fit=crop",
        tech: ["AWS", "Terraform", "Kubernetes"],
      },
      {
        title: "CI/CD Pipeline",
        image:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&h=120&fit=crop",
        tech: ["Jenkins", "Docker", "AWS"],
      },
    ],
    bio: "DevOps engineer and cloud architect with extensive experience in AWS, Kubernetes, and infrastructure automation. Passionate about building reliable, scalable, and secure cloud solutions.",
  },
];

const categories = [
  "All",
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "DevOps",
  "Data Science",
  "UI/UX",
  "Featured",
  "Premium",
];

const experienceLevels = ["All", "Junior", "Mid-level", "Senior", "Expert"];
const availabilityOptions = ["All", "Available", "Busy", "Unavailable"];
const hourlyRateRanges = ["All", "$0-50", "$50-100", "$100-150", "$150+"];

const TalentDiscovery = () => {
  const [talentProfiles, setTalentProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactingId, setContactingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [selectedRateRange, setSelectedRateRange] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleContactDeveloper = async (talentId) => {
    if (!user) {
      toast.error("Please sign in to send messages.");
      navigate("/auth");
      return;
    }

    const currentUserId = user?.id || user?._id;
    if (String(currentUserId) === String(talentId)) {
      toast.info("You cannot message yourself.");
      return;
    }

    try {
      setContactingId(talentId);
      const response = await api.post("/chats", { participantId: talentId });
      const conversationId = response.data?.data?.conversation?.id;
      navigate("/messages", {
        state: { conversationId },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Unable to open this conversation.",
      );
    } finally {
      setContactingId(null);
    }
  };

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const response = await api.get("/profile");
        const profiles = response.data.data.profiles.map((profile) => ({
          id: profile.user.id,
          name: profile.user.name,
          title: profile.title || "Developer",
          location: profile.location || "Location not specified",
          avatar: profile.avatar || null,
          rating: 0,
          reviews: 0,
          hourlyRate: 0,
          availability: "Available",
          experience: "Experience not specified",
          projects: profile.projectCount || 0,
          skills: profile.skills || [],
          specialties: [],
          languages: [],
          education: profile.education || "Education not specified",
          featured: false,
          verified: false,
          premium: false,
          recentProjects: profile.recentProjects || [],
          bio: profile.bio || "This developer has not added a bio yet.",
          github: profile.github || null,
          linkedin: profile.linkedin || null,
          email: profile.user?.email || null,
        }));
        setTalentProfiles(profiles);
      } catch (error) {
        console.error("Failed to load developers", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, []);

  const filteredTalent = talentProfiles.filter((talent) => {
    const matchesSearch =
      talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      talent.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      talent.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Featured" && talent.featured) ||
      (selectedCategory === "Premium" && talent.premium) ||
      talent.skills.some((skill) =>
        skill.toLowerCase().includes(selectedCategory.toLowerCase()),
      ) ||
      talent.specialties.some((specialty) =>
        specialty.toLowerCase().includes(selectedCategory.toLowerCase()),
      );

    const matchesExperience =
      selectedExperience === "All" ||
      (selectedExperience === "Senior" && talent.experience.includes("8+")) ||
      (selectedExperience === "Expert" && talent.experience.includes("10+")) ||
      (selectedExperience === "Mid-level" &&
        talent.experience.includes("5+")) ||
      (selectedExperience === "Junior" && talent.experience.includes("3+"));

    const matchesAvailability =
      selectedAvailability === "All" ||
      talent.availability === selectedAvailability;

    const matchesRateRange =
      selectedRateRange === "All" ||
      (selectedRateRange === "$0-50" && talent.hourlyRate <= 50) ||
      (selectedRateRange === "$50-100" &&
        talent.hourlyRate > 50 &&
        talent.hourlyRate <= 100) ||
      (selectedRateRange === "$100-150" &&
        talent.hourlyRate > 100 &&
        talent.hourlyRate <= 150) ||
      (selectedRateRange === "$150+" && talent.hourlyRate > 150);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesExperience &&
      matchesAvailability &&
      matchesRateRange
    );
  });

  const sortedTalent = [...filteredTalent].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "rate":
        return a.hourlyRate - b.hourlyRate;
      case "experience":
        return parseInt(b.experience) - parseInt(a.experience);
      case "projects":
        return b.projects - a.projects;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-teal-900/10 to-cyan-900/10"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Header Section */}
      <section className="relative bg-slate-900/60 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-full px-6 py-3 mb-8">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-emerald-400">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Find Top Talent
              </span>
            </div>

            <h1 className="text-6xl lg:text-8xl font-black mb-8">
              <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                Find
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Developers
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-10">
              Connect with talented tech professionals from around the world.
              Browse profiles, view portfolios, and hire the perfect match for
              your project.
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto mb-10">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-emerald-400 transition-colors" />
                <Input
                  placeholder="Search talent, skills, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-16 h-16 text-lg group-hover:border-slate-500 group-focus-within:border-emerald-500"
                />
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                  <Badge variant="glow" className="text-xs">
                    {loading ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Target className="w-3 h-3 mr-1" />
                        {filteredTalent.length} talent profiles
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Enhanced Category Filters */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "glass"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="border-slate-600"
                >
                  {category === "Featured" && <Star className="w-3 h-3 mr-1" />}
                  {category === "Premium" && (
                    <Sparkles className="w-3 h-3 mr-1" />
                  )}
                  {category}
                </Button>
              ))}
            </div>

            {/* Enhanced Filter Toggle */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-slate-600"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Advanced Filters"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Advanced Filters */}
      {showFilters && (
        <section className="relative bg-slate-800/40 backdrop-blur-sm border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Experience Level
                </label>
                <Select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                >
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Availability
                </label>
                <Select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                >
                  {availabilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Hourly Rate
                </label>
                <Select
                  value={selectedRateRange}
                  onChange={(e) => setSelectedRateRange(e.target.value)}
                >
                  {hourlyRateRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  <Zap className="w-4 h-4 inline mr-2" />
                  Sort By
                </label>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating">Rating</option>
                  <option value="rate">Hourly Rate</option>
                  <option value="experience">Experience</option>
                  <option value="projects">Projects</option>
                </Select>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Developers Grid */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10">
            {loading ? (
              <div className="contents">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="rounded-2xl border bg-slate-800/40 border-slate-700/40 p-8 space-y-6 animate-pulse"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 rounded-2xl bg-slate-700/50 shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-7 bg-slate-700/50 rounded-lg w-1/2" />
                        <div className="h-4 bg-slate-700/40 rounded w-1/3" />
                        <div className="h-4 bg-slate-700/30 rounded w-1/4" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-700/30 rounded w-full" />
                      <div className="h-4 bg-slate-700/30 rounded w-4/5" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-slate-700/40 rounded-full" />
                      <div className="h-6 w-16 bg-slate-700/40 rounded-full" />
                      <div className="h-6 w-16 bg-slate-700/40 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              sortedTalent.map((talent, index) => (
                <Card
                  key={talent.id}
                  className="group hover:scale-[1.02] transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-500/20"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="p-8">
                    {/* Enhanced Talent Header */}
                    <div className="flex items-start gap-6 mb-8">
                      <div className="relative">
                        <AvatarImage
                          src={talent.avatar}
                          alt={talent.name}
                          className="w-24 h-24 rounded-2xl border-2 border-slate-600 group-hover:border-emerald-500/50 transition-all duration-500 group-hover:scale-110 object-cover"
                          fallbackClassName="w-24 h-24 rounded-2xl border-2 border-slate-600 bg-emerald-500/10 flex items-center justify-center"
                          iconClassName="w-10 h-10 text-emerald-300/70"
                        />
                        {talent.verified && (
                          <div className="absolute -bottom-2 -right-2">
                            <CheckCircle className="w-6 h-6 text-emerald-400 bg-slate-900 rounded-full p-1" />
                          </div>
                        )}
                        {talent.featured && (
                          <div className="absolute -top-3 -left-3">
                            <Badge variant="warning" className="text-xs">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </Badge>
                          </div>
                        )}
                        {talent.premium && (
                          <div className="absolute -top-3 -right-3">
                            <Badge variant="premium" className="text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <Link
                              to={`/developer/${talent.id}`}
                              className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 hover:underline"
                            >
                              {talent.name}
                            </Link>
                            <p className="text-slate-400 text-lg">
                              {talent.title}
                            </p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10"
                            >
                              <Heart className="w-5 h-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10"
                            >
                              <Share2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-slate-400 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {talent.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                            {talent.rating} ({talent.reviews} reviews)
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />$
                            {talent.hourlyRate}
                            /hr
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <Badge
                            variant={
                              talent.availability === "Available"
                                ? "success"
                                : talent.availability === "Busy"
                                  ? "warning"
                                  : "danger"
                            }
                          >
                            {talent.availability}
                          </Badge>
                          <span className="text-slate-400">
                            {talent.experience} experience
                          </span>
                          <span className="text-slate-400">
                            {talent.projects} projects
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Bio */}
                    <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                      {talent.bio}
                    </p>

                    {/* Enhanced Skills */}
                    <div className="mb-8">
                      <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center">
                        <Code className="w-4 h-4 mr-2" />
                        Skills & Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {talent.skills.slice(0, 6).map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {talent.skills.length > 6 && (
                          <Badge variant="secondary" className="text-xs">
                            +{talent.skills.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Specialties */}
                    <div className="mb-8">
                      <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Specialties
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {talent.specialties.map((specialty) => (
                          <Badge
                            key={specialty}
                            variant="secondary"
                            className="text-xs"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Recent Projects */}
                    <div className="mb-8">
                      <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Recent Projects
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {talent.recentProjects.map((project, idx) => (
                          <div
                            key={idx}
                            className="relative overflow-hidden rounded-xl group/project"
                          >
                            <ProjectImage
                              src={project.image}
                              alt={project.title}
                              className="w-full h-20 object-cover group-hover/project:scale-110 transition-transform duration-500"
                              fallbackClassName="w-full h-20 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"
                              iconClassName="w-8 h-8 text-emerald-300/60"
                              icon={Code}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent opacity-0 group-hover/project:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute bottom-2 left-3 text-white text-xs font-semibold">
                              {project.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        {(!user ||
                          String(talent.id) !==
                            String(user?.id || user?._id)) && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={contactingId === talent.id}
                            onClick={() => handleContactDeveloper(talent.id)}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {contactingId === talent.id
                              ? "Opening..."
                              : "Message"}
                          </Button>
                        )}
                        <Link to={`/developer/${talent.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </Link>
                      </div>

                      <div className="flex gap-2">
                        {talent.github ? (
                          <a
                            href={
                              talent.github.startsWith("http")
                                ? talent.github
                                : `https://${talent.github}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center h-10 w-10 rounded-xl hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-colors"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-slate-500 pointer-events-none"
                          >
                            <Github className="w-5 h-5" />
                          </Button>
                        )}
                        {talent.linkedin ? (
                          <a
                            href={
                              talent.linkedin.startsWith("http")
                                ? talent.linkedin
                                : `https://${talent.linkedin}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center h-10 w-10 rounded-xl hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-colors"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-slate-500 pointer-events-none"
                          >
                            <Linkedin className="w-5 h-5" />
                          </Button>
                        )}
                        {talent.email ? (
                          <a
                            href={`mailto:${talent.email}`}
                            className="inline-flex items-center justify-center h-10 w-10 rounded-xl hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-colors"
                          >
                            <Mail className="w-5 h-5" />
                          </a>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-slate-500 pointer-events-none"
                          >
                            <Mail className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Enhanced No Results */}
          {!loading && sortedTalent.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-slate-800/60 rounded-3xl p-16 border border-slate-700/50 backdrop-blur-sm">
                <Users className="w-20 h-20 mx-auto mb-8 text-slate-400 opacity-50" />
                <h3 className="text-3xl font-bold text-slate-200 mb-4">
                  No developers found
                </h3>
                <p className="text-slate-400 mb-8 text-lg">
                  Try adjusting your search or filters to find what you're
                  looking for
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSelectedExperience("All");
                    setSelectedAvailability("All");
                    setSelectedRateRange("All");
                  }}
                  className="border-slate-600 hover:bg-slate-700"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-slate-800/60 to-slate-900/60 border-t border-slate-700/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-3xl p-16 border border-emerald-500/30 backdrop-blur-sm">
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-8">
              Ready to Hire a Developer?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Post your project and get proposals from qualified developers.
              Find the perfect match for your next project.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="premium" className="text-lg">
                <TrendingUp className="w-6 h-6 mr-3" />
                Post a Project
              </Button>
              <Button variant="glass" size="lg" className="text-lg">
                <Award className="w-6 h-6 mr-3" />
                Join as Developer
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TalentDiscovery;
