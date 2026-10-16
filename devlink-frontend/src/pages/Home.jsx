"use client";

import { useEffect, useState } from "react";
import {
  Github,
  Linkedin,
  MapPin,
  Star,
  Users,
  Code,
  Image as ImageIcon,
  Search,
  TrendingUp,
  Award,
  ExternalLink,
  Share2,
  Sparkles,
  Zap,
  Target,
  Briefcase,
  Rocket,
  Globe,
  Palette,
  Database,
  Smartphone,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { ProjectImage } from "../components/SafeImage";

// Custom UI components for Home page
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
      "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105",
    outline:
      "border-2 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-400 bg-transparent backdrop-blur-sm",
    ghost: "hover:bg-indigo-500/10 text-indigo-400 hover:text-indigo-300",
    secondary: "bg-zinc-700 text-white hover:bg-zinc-600",
    glass:
      "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
    success: "bg-indigo-600 text-white hover:bg-indigo-700",
    warning: "bg-amber-600 text-white hover:bg-amber-700",
    premium:
      "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1",
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
    className={`rounded-2xl border bg-zinc-800/60 border-zinc-700/50 text-white shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm hover:bg-zinc-800/80 hover:border-indigo-500/30 group ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const variants = {
    default: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white",
    secondary: "bg-zinc-700 hover:bg-zinc-600 text-zinc-300",
    outline:
      "border border-indigo-400/40 text-indigo-400 bg-indigo-400/10 hover:bg-indigo-400/20",
    success: "bg-indigo-600/20 border border-indigo-500/40 text-indigo-400",
    warning: "bg-amber-600/20 border border-amber-500/40 text-amber-400",
    danger: "bg-red-600/20 border border-red-500/40 text-red-400",
    premium: "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
    glow: "bg-indigo-400/20 border border-indigo-400/50 text-indigo-300 shadow-lg shadow-indigo-500/25",
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
    className={`flex h-14 w-full rounded-xl border-2 border-zinc-600 bg-zinc-800/50 px-5 py-4 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 backdrop-blur-sm transition-all duration-300 ${className}`}
    {...props}
  />
);

// Enhanced projects data with more details
const _projectsData = [
  {
    id: 1,
    title: "E-commerce Platform",
    description:
      "A fully-featured ecommerce platform built with React, Node.js, and MongoDB. Features include user authentication, payment processing, admin dashboard, and real-time inventory management.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    author: "Sarah Johnson",
    likes: 128,
    views: 2456,
    featured: true,
    premium: true,
    category: "Full Stack",
  },
  {
    id: 2,
    title: "Chat Application",
    description:
      "A real-time chat application with WebSocket integration and a modern UI. Supports group chats, file sharing, and message encryption with end-to-end security.",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop",
    technologies: ["React", "TypeScript", "WebSocket", "Socket.io"],
    author: "Michael Brown",
    likes: 89,
    views: 1892,
    featured: false,
    premium: false,
    category: "Frontend",
  },
  {
    id: 3,
    title: "Task Management App",
    description:
      "A task management app featuring drag-and-drop and a Kanban board layout. Includes team collaboration, time tracking, and project analytics with beautiful visualizations.",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68e2c6b7d3?w=300&h=200&fit=crop",
    technologies: ["Vue.js", "Firebase", "Tailwind CSS", "Chart.js"],
    author: "Emily White",
    likes: 156,
    views: 3124,
    featured: true,
    premium: false,
    category: "Frontend",
  },
  {
    id: 4,
    title: "Blog CMS",
    description:
      "Content management system with markdown support and SEO optimization. Features include rich text editor, image optimization, and advanced analytics dashboard.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
    technologies: ["Next.js", "PostgreSQL", "Prisma", "AWS"],
    author: "David Kim",
    likes: 203,
    views: 4567,
    featured: true,
    premium: true,
    category: "Full Stack",
  },
  {
    id: 5,
    title: "Fitness Tracking App",
    description:
      "Mobile app for tracking workouts and fitness goals with social features. Includes workout plans, progress tracking, and community challenges with gamification elements.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
    technologies: ["React Native", "Firebase", "Redux", "Expo"],
    author: "Alex Chen",
    likes: 167,
    views: 2987,
    featured: false,
    premium: false,
    category: "Mobile",
  },
  {
    id: 6,
    title: "Weather Dashboard",
    description:
      "Real-time weather dashboard with interactive maps and forecasts. Features include 7-day forecasts, radar maps, and weather alerts with beautiful data visualizations.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop",
    technologies: ["Vue.js", "OpenWeather API", "Chart.js", "Leaflet"],
    author: "Lisa Wang",
    likes: 94,
    views: 2134,
    featured: false,
    premium: false,
    category: "Frontend",
  },
];

const categories = [
  "All",
  "React",
  "Vue.js",
  "Node.js",
  "Mobile",
  "Full Stack",
  "UI/UX",
  "Featured",
  "Premium",
];

const Home = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await api.get("/projects");
        setProjects(response.data.data.projects);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      project.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Featured" && project.featured) ||
      (selectedCategory === "Premium" && project.premium) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(selectedCategory.toLowerCase()),
      ) ||
      project.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleShareProject = async (event, project) => {
    event.stopPropagation();
    const projectUrl = `${window.location.origin}/project/${project.id}`;

    try {
      await navigator.clipboard.writeText(projectUrl);
      toast.success("Project link copied!");
    } catch {
      // Clipboard access can be unavailable in some browsers or contexts.
      const textArea = document.createElement("textarea");
      textArea.value = projectUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      toast.success("Project link copied!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-pink-900/10"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-indigo-400 rounded-full animate-pulse"
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
      <section className="relative bg-zinc-900/60 backdrop-blur-sm border-b border-zinc-700/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-full px-6 py-3 mb-8">
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-indigo-400">
                <Rocket className="w-4 h-4 inline mr-2" />
                Live Projects Feed
              </span>
            </div>

            <h1 className="text-6xl lg:text-8xl font-black mb-8">
              <span className="bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent">
                DevLink
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Projects Feed
              </span>
            </h1>

            <p className="text-xl text-zinc-300 max-w-4xl mx-auto leading-relaxed mb-10">
              Discover amazing projects built by talented developers from around
              the world. Explore cutting-edge technologies and innovative
              solutions.
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto mb-10">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-zinc-400 w-6 h-6 group-focus-within:text-indigo-400 transition-colors" />
                <Input
                  placeholder="Search projects, technologies, or developers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-16 h-16 text-lg group-hover:border-zinc-500 group-focus-within:border-indigo-500"
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
                        {filteredProjects.length} projects
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
                  className="border-zinc-600"
                >
                  {category === "Featured" && <Star className="w-3 h-3 mr-1" />}
                  {category === "Premium" && (
                    <Sparkles className="w-3 h-3 mr-1" />
                  )}
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Projects Feed */}
      <section className="relative py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-10">
            {loading ? (
              <div className="space-y-8 animate-pulse">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="rounded-2xl border bg-zinc-800/40 border-zinc-700/40 p-8 flex flex-col md:flex-row gap-8"
                  >
                    <div className="w-full md:w-48 h-32 rounded-2xl bg-zinc-700/50 shrink-0" />
                    <div className="flex-1 space-y-4">
                      <div className="h-7 bg-zinc-700/50 rounded-lg w-1/3" />
                      <div className="h-4 bg-zinc-700/40 rounded w-1/4" />
                      <div className="h-4 bg-zinc-700/30 rounded w-full" />
                      <div className="h-4 bg-zinc-700/30 rounded w-2/3" />
                      <div className="flex gap-2 pt-2">
                        <div className="h-6 w-16 bg-zinc-700/40 rounded-full" />
                        <div className="h-6 w-16 bg-zinc-700/40 rounded-full" />
                        <div className="h-6 w-16 bg-zinc-700/40 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-zinc-800/60 rounded-3xl p-16 border border-zinc-700/50 backdrop-blur-sm">
                  <Code className="w-20 h-20 mx-auto mb-8 text-zinc-400 opacity-50" />
                  <h3 className="text-3xl font-bold text-zinc-200 mb-4">
                    No projects found
                  </h3>
                  <p className="text-zinc-400 mb-8 text-lg">
                    Try adjusting your search or filters to find what you're
                    looking for
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                    }}
                    className="border-zinc-600 hover:bg-zinc-700"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            ) : (
              filteredProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className="group hover:scale-[1.02] transition-all duration-700 hover:shadow-2xl hover:shadow-indigo-500/20"
                  style={{ animationDelay: `${index * 150}ms` }}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(`/project/${project.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/project/${project.id}`);
                    }
                  }}
                >
                  <div className="flex gap-8 p-8">
                    {/* Enhanced Project Image */}
                    <div className="flex-shrink-0 relative">
                      <ProjectImage
                        src={project.image}
                        alt={project.title}
                        className="w-48 h-32 object-cover rounded-2xl border border-zinc-600/50 group-hover:border-indigo-500/50 transition-all duration-500 group-hover:scale-110"
                        fallbackClassName="w-48 h-32 rounded-2xl border border-zinc-600/50 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 flex items-center justify-center"
                        iconClassName="w-10 h-10 text-indigo-300/70"
                      />
                      {project.featured && (
                        <div className="absolute -top-3 -left-3">
                          <Badge variant="warning" className="text-xs">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      {project.premium && (
                        <div className="absolute -top-3 -right-3">
                          <Badge variant="premium" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Project Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-3xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-300 mb-2">
                            {project.title}
                          </h3>
                          <Badge variant="outline" className="text-xs mb-3">
                            {project.category}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10"
                            title="Copy project link"
                            aria-label="Copy project link"
                            onClick={(event) =>
                              handleShareProject(event, project)
                            }
                          >
                            <Share2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-zinc-300 text-sm mb-6 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Enhanced Technology Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      {/* Project Author */}
                      <div className="flex items-center justify-between">
                        <p className="text-indigo-400 font-semibold">
                          By {project.author}
                        </p>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/project/${project.id}`);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/40 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open project
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-zinc-800/60 to-zinc-900/60 border-t border-zinc-700/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl p-16 border border-indigo-500/30 backdrop-blur-sm">
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-8">
              Ready to Share Your Project?
            </h2>
            <p className="text-xl text-zinc-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join our community of developers and showcase your amazing
              projects to the world. Get feedback, collaborate, and grow your
              network.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="premium" className="text-lg">
                <TrendingUp className="w-6 h-6 mr-3" />
                Share Your Project
              </Button>
              <Button variant="glass" size="lg" className="text-lg">
                <Award className="w-6 h-6 mr-3" />
                Browse More Projects
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
