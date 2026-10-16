import { useState, useContext, useEffect } from "react";
import {
  Star,
  MapPin,
  Code,
  Users,
  Heart,
  MessageCircle,
  Clock,
  Globe,
  Github,
  Linkedin,
  Mail,
  Phone,
  Share2,
  CheckCircle,
  XCircle,
  Sparkles,
  Target,
  ArrowLeft,
  GraduationCap,
  Languages,
  Shield,
  FolderOpen,
  Edit,
  Plus,
  Info,
  UserRound,
  Upload,
  Camera,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import DeveloperNotFound from "./DeveloperNotFound";
import api from "../services/api";
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
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Sample developer data (in a real app, this would come from an API)
const developerData = {
  id: 1,
  name: "Sarah Johnson",
  title: "Senior Full Stack Developer",
  location: "San Francisco, CA",
  avatar:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  coverImage:
    "https://i.pinimg.com/originals/c8/67/3a/c8673ad4c46ade00cf3bd0049db62b16.jpg",
  projects: 24,
  completedProjects: 89,
  skills: [
    "React",
    "Node.js",
    "TypeScript",
    "AWS",
    "MongoDB",
    "Docker",
    "Python",
    "Vue.js",
    "PostgreSQL",
    "Redis",
    "GraphQL",
    "Kubernetes",
  ],
  specialties: [
    "E-commerce",
    "SaaS",
    "API Development",
    "Cloud Architecture",
    "Microservices",
    "DevOps",
  ],
  languages: ["English", "Spanish"],
  education: "BS Computer Science, Stanford University",
  bio: "I'm a seasoned full-stack developer with a passion for creating innovative digital solutions. With over 8 years of experience in the tech industry, I've worked with startups and enterprise companies to build scalable, high-performance applications. My expertise spans the entire development stack, from frontend frameworks like React and Vue.js to backend technologies like Node.js and Python. I'm particularly skilled in cloud architecture and DevOps practices, having deployed applications on AWS, Google Cloud, and Azure. I believe in writing clean, maintainable code and following best practices to ensure long-term project success.",
  github: "https://github.com/sarahjohnson",
  linkedin: "https://linkedin.com/in/sarahjohnson",
  portfolio: "https://sarahjohnson.dev",
  recentProjects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
      tech: ["React", "Node.js", "Stripe", "MongoDB"],
      description:
        "A full-featured e-commerce platform with payment processing, inventory management, and admin dashboard.",
      status: "Completed",
      rating: 5.0,
      budget: 15000,
      duration: "3 months",
      client: "TechStart Inc.",
    },
    {
      id: 2,
      title: "SaaS Dashboard",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      tech: ["Vue.js", "Python", "PostgreSQL", "Redis"],
      description:
        "Analytics dashboard for SaaS companies with real-time data visualization and reporting tools.",
      status: "Completed",
      rating: 4.8,
      budget: 12000,
      duration: "2.5 months",
      client: "DataFlow Solutions",
    },
    {
      id: 3,
      title: "Mobile Banking App",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop",
      tech: ["React Native", "Node.js", "PostgreSQL", "AWS"],
      description:
        "Secure mobile banking application with biometric authentication and real-time transaction processing.",
      status: "In Progress",
      rating: null,
      budget: 25000,
      duration: "4 months",
      client: "FinTech Pro",
    },
  ],
};

const objForEdit = {
  name: "Sarah Johnson",
  title: "Senior Full Stack Developer",
  location: "San Francisco, CA",
  bio: "I'm a seasoned full-stack developer with a passion for creating innovative digital solutions. With over 8 years of experience in the tech industry, I've worked with startups and enterprise companies to build scalable, high-performance applications. My expertise spans the entire development stack, from frontend frameworks like React and Vue.js to backend technologies like Node.js and Python. I'm particularly skilled in cloud architecture and DevOps practices, having deployed applications on AWS, Google Cloud, and Azure. I believe in writing clean, maintainable code and following best practices to ensure long-term project success.",
  experience: "8+ years",
  education: "BS Computer Science, Stanford University",
  skills: [
    "React",
    "Node.js",
    "TypeScript",
    "AWS",
    "MongoDB",
    "Docker",
    "Python",
    "Vue.js",
    "PostgreSQL",
    "Redis",
    "GraphQL",
    "Kubernetes",
  ],

  github: "https://github.com/sarahjohnson",
  linkedin: "https://linkedin.com/in/sarahjohnson",
  portfolio: "https://sarahjohnson.dev",
};

const DeveloperProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditSaving, setIsEditSaving] = useState(false);
  const [isAddProjectSaving, setAddProjectSaving] = useState(false);
  const [isAddProject, setIsAddProject] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useContext(UserContext);
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm] = useState({
    title: "",
    duration: "",
    description: "",
    technologies: "",
    githubLink: "",
    liveDemo: "",
    file: null,
    imageUrl: "",
  });
  const [developerProjects, setDeveloperProjects] = useState([]);
  const [myDeveloper, setMyDeveloper] = useState(null);
  const [isContacting, setIsContacting] = useState(false);
  const [isSetupSaving, setIsSetupSaving] = useState(false);
  const [setupForm, setSetupForm] = useState({
    title: "",
    location: "",
    bio: "",
    skills: "",
    education: "",
    github: "",
    linkedIn: "",
    portfolio: "",
    avatar: "",
  });
  const currentUserId = user?.id || user?._id;
  const isOwnProfile = Boolean(
    currentUserId &&
      (String(currentUserId) === String(id) ||
        String(currentUserId) === String(myDeveloper?.user_id) ||
        String(currentUserId) === String(myDeveloper?.user?.id) ||
        String(currentUserId) === String(myDeveloper?.user?._id) ||
        (myDeveloper?.id &&
          String(myDeveloper.id) === String(id) &&
          String(myDeveloper?.user_id || myDeveloper?.user?.id) ===
            String(currentUserId)))
  );
  const navigate = useNavigate();

  // Get current user and developer data from API
  const fetchDeveloper = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/profile/user/${id}`);
      const data = res.data;
      const profile = data?.data?.profile;
      setMyDeveloper(profile);
      if (profile) {
        setEditForm({
          ...profile,
          name: profile.user?.name || "",
          avatar: profile.avatar || "",
        });
      }

      // Load real projects from backend
      try {
        const projRes = await api.get(`/projects/user/${id}`);
        const list = Array.isArray(projRes.data)
          ? projRes.data
          : projRes.data?.data?.projects || [];
        setDeveloperProjects(list);
      } catch (err) {
        console.warn("Could not load projects for developer", err);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeveloper();
  }, [id]);

  let developer = {
    ...developerData,
    ...myDeveloper,
    projects: developerProjects.length,
    recentProjects: developerProjects,
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "projects", label: "Projects", icon: FolderOpen },
  ];

  const saveChanges = async () => {
    if (
      !editForm.title?.trim() ||
      !editForm.location?.trim() ||
      !editForm.bio?.trim() ||
      !Array.isArray(editForm.skills) ||
      editForm.skills.length === 0
    ) {
      toast.error("Title, location, bio, and at least one skill are required.");
      return;
    }

    try {
      setIsEditSaving(true);

      const res = await api.post("/profile/", editForm);
      toast.success("Profile updated!");

      await fetchDeveloper();
      setIsEditMode(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save changes.");
      console.error(error);
    } finally {
      setIsEditSaving(false);
    }
  };

  const createProfile = async () => {
    const skills = setupForm.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (
      !setupForm.title.trim() ||
      !setupForm.location.trim() ||
      !setupForm.bio.trim() ||
      skills.length === 0
    ) {
      toast.error("Title, location, bio, and at least one skill are required.");
      return;
    }

    try {
      setIsSetupSaving(true);
      const res = await api.post("/profile/", {
        ...setupForm,
        skills,
      });

      setMyDeveloper(res.data.data.profile);
      toast.success("Your developer profile was created.");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to create your profile.",
      );
    } finally {
      setIsSetupSaving(false);
    }
  };

  const handleShareProfile = async () => {
    const fullUrl =
      window.location.origin + location.pathname + location.search;

    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Link copied!", {
        closeButton: false,
        hideProgressBar: true,
        autoClose: 1500,
      });
    } catch (err) {
      toast.error("Failed to copy link.");
      toast.error(err.message);
    }
  };

  const handleContactDeveloper = async () => {
    if (!user) {
      toast.error("Please sign in to send messages.");
      navigate("/auth");
      return;
    }

    if (isOwnProfile) {
      toast.info("You cannot message yourself.");
      return;
    }

    const targetUserId =
      myDeveloper?.user?.id ||
      myDeveloper?.user?._id ||
      myDeveloper?.user_id ||
      id;

    try {
      setIsContacting(true);
      const response = await api.post("/chats", { participantId: targetUserId });
      navigate("/messages", {
        state: { conversationId: response.data?.data?.conversation?.id },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Unable to open this conversation.",
      );
    } finally {
      setIsContacting(false);
    }
  };
  const addProject = async () => {
    if (!addForm.title?.trim()) {
      toast.error("Project title is required.");
      return;
    }

    try {
      setAddProjectSaving(true);

      const formData = new FormData();
      formData.append("title", addForm.title.trim());
      formData.append("description", (addForm.description || "").trim());
      formData.append("technologies", addForm.technologies || "");
      formData.append("duration", (addForm.duration || "").trim());
      if (addForm.githubLink?.trim()) {
        formData.append("githubLink", addForm.githubLink.trim());
      }
      if (addForm.liveDemo?.trim()) {
        formData.append("liveDemo", addForm.liveDemo.trim());
      }

      if (addForm.file) {
        formData.append("image", addForm.file);
      } else if (addForm.imageUrl?.trim()) {
        formData.append("image", addForm.imageUrl.trim());
      }

      await api.post("/projects", formData);

      toast.success("Project added successfully!");
      setIsAddProject(false);
      setAddForm({
        title: "",
        duration: "",
        description: "",
        technologies: "",
        githubLink: "",
        liveDemo: "",
        file: null,
        imageUrl: "",
      });

      await fetchDeveloper();
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Failed to add project. Please try again."
      );
    } finally {
      setAddProjectSaving(false);
    }
  };

  if (loading || authLoading) {
    return <Loading />;
  }
  if (!myDeveloper) {
    if (!isOwnProfile) {
      return <DeveloperNotFound />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Plus className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold">
                Create Your Developer Profile
              </h1>
              <p className="mt-3 text-slate-300">
                Your account is ready. Add your professional details so other
                developers can discover you.
              </p>
            </div>

            {/* Avatar Photo for Setup */}
            <div className="mb-6 p-4 bg-slate-700/50 rounded-xl border border-slate-600/70 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative shrink-0">
                <AvatarImage
                  src={setupForm.avatar}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-lg"
                  fallbackClassName="w-20 h-20 rounded-2xl border-2 border-slate-600 bg-emerald-500/10 flex items-center justify-center"
                  iconClassName="w-9 h-9 text-emerald-300/70"
                />
              </div>

              <div className="flex-1 w-full space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Profile Avatar Photo (Optional)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition">
                    <Upload className="w-4 h-4" /> Upload Avatar Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setSetupForm((prev) => ({
                              ...prev,
                              avatar: ev.target.result,
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {setupForm.avatar && (
                    <button
                      type="button"
                      onClick={() =>
                        setSetupForm((prev) => ({ ...prev, avatar: "" }))
                      }
                      className="text-xs text-red-400 hover:text-red-300 underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="Or paste an image URL (https://...)"
                  value={
                    setupForm.avatar?.startsWith("data:")
                      ? ""
                      : setupForm.avatar || ""
                  }
                  onChange={(e) =>
                    setSetupForm((prev) => ({
                      ...prev,
                      avatar: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-1.5 text-xs bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                ["title", "Job Title", "e.g. Senior Frontend Developer"],
                ["location", "Location", "e.g. Cairo, Egypt"],
                ["education", "Education", "e.g. Computer Science"],
                ["portfolio", "Portfolio URL", "https://yourportfolio.com"],
                ["github", "GitHub URL", "https://github.com/username"],
                [
                  "linkedIn",
                  "LinkedIn URL",
                  "https://linkedin.com/in/username",
                ],
              ].map(([field, label, placeholder]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {label}
                    {["title", "location"].includes(field) && (
                      <span className="text-emerald-400"> *</span>
                    )}
                  </label>
                  <input
                    type={
                      field.includes("portfolio") ||
                      field.includes("github") ||
                      field.includes("linkedIn")
                        ? "url"
                        : "text"
                    }
                    value={setupForm[field]}
                    onChange={(event) =>
                      setSetupForm({
                        ...setupForm,
                        [field]: event.target.value,
                      })
                    }
                    placeholder={placeholder}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Skills (comma-separated){" "}
                  <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={setupForm.skills}
                  onChange={(event) =>
                    setSetupForm({ ...setupForm, skills: event.target.value })
                  }
                  placeholder="React, Node.js, TypeScript"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  About You <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  rows={5}
                  value={setupForm.bio}
                  onChange={(event) =>
                    setSetupForm({ ...setupForm, bio: event.target.value })
                  }
                  placeholder="Tell other developers about your experience and interests"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mt-8"
              onClick={createProfile}
              disabled={isSetupSaving}
            >
              {isSetupSaving ? "Saving Profile..." : "Create Profile"}
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-6">
          <Link
            to={isOwnProfile ? "/" : "/developers"}
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {isOwnProfile ? "Back to Home Page" : "Back to Developers"}
          </Link>
        </div>

        {/* Cover Image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={
              developer.coverImage ||
              "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=400&fit=crop"
            }
            alt="Cover"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=400&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        </div>

        {/* Profile Header */}
        <div className="container mx-auto px-4 -mt-20 relative z-20">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative group/avatar">
              <AvatarImage
                src={developer.avatar}
                alt={developer.name}
                className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-slate-800 shadow-xl"
                fallbackClassName="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-slate-800 bg-emerald-500/10 flex items-center justify-center shadow-xl"
                iconClassName="w-12 h-12 text-emerald-300/70"
              />
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  title="Change avatar photo"
                  className="absolute bottom-1 right-1 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-transform hover:scale-110"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                      {developer.user.name}
                    </h1>
                    {isOwnProfile && (
                      <Badge variant="success" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        My Profile
                      </Badge>
                    )}
                  </div>
                  <p className="text-xl text-emerald-400 mb-3">
                    {developer.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-slate-300 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {developer.location}
                    </div>
                  </div>

                  {/* green alert if viewing own profile */}
                  {isOwnProfile && (
                    <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <p className="text-emerald-300 text-sm">
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        This is your profile. You can edit your information and
                        manage your settings.
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 min-w-fit">
                  {isOwnProfile ? (
                    // Own profile - show edit and settings buttons
                    // this will not be shown when isEditMode equal true
                    <>
                      <Button
                        size="lg"
                        className="w-full"
                        onClick={() => setIsEditMode(!isEditMode)}
                      >
                        <Edit className="w-5 h-5 mr-2" />
                        {isEditMode ? "Cancel Edit" : "Edit Profile"}
                      </Button>
                    </>
                  ) : (
                    // Other developer's profile - show contact and save buttons
                    <>
                      <Button
                        size="lg"
                        className="w-full"
                        onClick={handleContactDeveloper}
                        disabled={isContacting}
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        {isContacting ? "Opening Chat..." : "Send Message"}
                      </Button>
                      <Button variant="outline" size="lg" className="w-full">
                        <Heart className="w-5 h-5 mr-2" />
                        Save Profile
                      </Button>
                    </>
                  )}

                  <Button
                    onClick={handleShareProfile}
                    variant="ghost"
                    size="lg"
                    className="w-full"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-400" />
                Contact Info
              </h3>
              {isOwnProfile && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-amber-300 text-sm">
                    <Shield className="w-4 h-4 inline mr-2" />
                    This contact information is visible to other developers and
                    potential clients.
                  </p>
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-4 h-4" />
                  <span>{developer.user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Globe className="w-4 h-4" />
                  <a
                    href={developer.portfolio}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    Portfolio
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex gap-3">
                  <a
                    href={developer.github}
                    className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <Github className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href={developer.linkedin}
                    className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </Card>

            {/* Education */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                Education
              </h3>
              <div className="text-slate-300">
                <p className="font-medium">{developer.education}</p>
              </div>
            </Card>

            {/* Languages */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Languages className="w-5 h-5 text-emerald-400" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {developer.languages.map((language) => (
                  <Badge key={language} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <Card className="p-1">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-emerald-500 text-white"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Tab Content */}
            <div className="min-h-96">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="flex gap-2 items-center text-xl font-semibold text-white mb-4">
                      <Info />
                      About
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {developer.bio}
                    </p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="flex gap-2 items-center text-xl font-semibold text-white mb-4">
                      <Code />
                      Skills
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {developer.skills.map((skill) => (
                        <div
                          key={skill}
                          className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg"
                        >
                          <Target className="w-4 h-4 text-emerald-400" />
                          <span className="text-slate-300">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "projects" && (
                <div className="space-y-6">
                  {isOwnProfile && (
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => setIsAddProject(!isAddProject)}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Project
                    </Button>
                  )}
                  {developer.recentProjects.length === 0 ? (
                    <Card className="p-12 text-center">
                      <FolderOpen className="w-12 h-12 mx-auto mb-4 text-slate-500 opacity-60" />
                      <h4 className="text-lg font-semibold text-white mb-2">
                        No projects yet
                      </h4>
                      <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                        {isOwnProfile
                          ? "Showcase your work! Add projects with screenshots and links to impress other developers and clients."
                          : "This developer hasn't published any projects yet."}
                      </p>
                      {isOwnProfile && (
                        <Button onClick={() => setIsAddProject(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Project
                        </Button>
                      )}
                    </Card>
                  ) : (
                    developer.recentProjects.map((project) => (
                      <Card key={project.id || project._id} className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <ProjectImage
                            src={project.image}
                            alt={project.title}
                            className="w-full lg:w-56 h-36 object-cover rounded-xl border border-slate-700 bg-slate-800"
                            fallbackClassName="w-full lg:w-56 h-36 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
                            iconClassName="w-10 h-10 text-emerald-400/50"
                            icon={Code}
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-xl font-semibold text-white">
                                {project.title}
                              </h3>
                              {project.duration && (
                                <Badge variant="secondary">
                                  {project.duration}
                                </Badge>
                              )}
                            </div>
                            <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {(
                                project.technologies ||
                                project.tech ||
                                []
                              ).map((tech) => (
                                <Badge key={tech} variant="outline">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                              <Link
                                to={`/project/${project.id || project._id}`}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors"
                              >
                                View Details
                              </Link>
                              {(project.githubLink || project.github_link) && (
                                <a
                                  href={project.githubLink || project.github_link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-600 transition-colors"
                                >
                                  <Github className="w-3.5 h-3.5" /> Code
                                </a>
                              )}
                              {(project.liveDemo || project.live_demo) && (
                                <a
                                  href={project.liveDemo || project.live_demo}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-600 transition-colors"
                                >
                                  <Globe className="w-3.5 h-3.5" /> Demo
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditMode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                <button
                  onClick={() => setIsEditMode(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Photo / Avatar */}
              <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/70 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative shrink-0">
                  <AvatarImage
                    src={editForm.avatar}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-lg"
                    fallbackClassName="w-20 h-20 rounded-2xl border-2 border-slate-600 bg-emerald-500/10 flex items-center justify-center"
                    iconClassName="w-9 h-9 text-emerald-300/70"
                  />
                </div>

                <div className="flex-1 w-full space-y-2">
                  <label className="block text-sm font-medium text-slate-200">
                    Profile Avatar Photo
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition">
                      <Upload className="w-4 h-4" /> Upload New Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setEditForm((prev) => ({
                                ...prev,
                                avatar: ev.target.result,
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {editForm.avatar && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm((prev) => ({ ...prev, avatar: "" }))
                        }
                        className="text-xs text-red-400 hover:text-red-300 underline"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste an image URL (https://...)"
                    value={
                      editForm.avatar?.startsWith("data:")
                        ? ""
                        : editForm.avatar || ""
                    }
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        avatar: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-1.5 text-xs bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Job Title <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., Senior Full Stack Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Location <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Education
                  </label>
                  <input
                    type="text"
                    value={editForm.education}
                    onChange={(e) =>
                      setEditForm({ ...editForm, education: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Bio <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Write a description of your experience and expertise..."
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Skills (comma-separated){" "}
                  <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.skills.join(", ")}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      skills: e.target.value
                        .split(", ")
                        .filter((skill) => skill.trim()),
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="React, Node.js, TypeScript, AWS..."
                />
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={editForm.github}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        github: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={editForm.linkedIn}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        linkedIn: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={editForm.portfolio}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        portfolio: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-700">
                <Button
                  variant="outline"
                  onClick={() => setIsEditMode(false)}
                  className="flex-1"
                  disabled={isEditSaving}
                >
                  Cancel
                </Button>

                <Button
                  variant="success"
                  onClick={saveChanges}
                  className="flex-1"
                  disabled={isEditSaving}
                >
                  {isEditSaving ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add project Modal */}
      {isAddProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Add Project</h2>
                <button
                  onClick={() => setIsAddProject(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={addForm.title}
                    onChange={(e) =>
                      setAddForm({
                        ...addForm,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={addForm.duration}
                    onChange={(e) =>
                      setAddForm({
                        ...addForm,
                        duration: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter Project duration"
                  />
                </div>
              </div>

              {/* description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project description
                </label>
                <textarea
                  rows={3}
                  value={addForm.description}
                  onChange={(e) =>
                    setAddForm({
                      ...addForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Write a description for your project..."
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={addForm.technologies}
                  onChange={(e) =>
                    setAddForm({
                      ...addForm,
                      technologies: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="React, Node.js, TypeScript, AWS..."
                />
              </div>

              {/* Project Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={addForm.githubLink || ""}
                    onChange={(e) =>
                      setAddForm({ ...addForm, githubLink: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="https://github.com/username/project"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={addForm.liveDemo || ""}
                    onChange={(e) =>
                      setAddForm({ ...addForm, liveDemo: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="https://myproject.demo.com"
                  />
                </div>
              </div>

              {/* Project Image */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">
                  Project Image / Screenshot
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow hover:bg-emerald-500 transition">
                    <Upload className="w-4 h-4" /> Upload Screenshot File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setAddForm({
                            ...addForm,
                            file,
                            imageUrl: "",
                          });
                        }
                      }}
                    />
                  </label>
                  {addForm.file && (
                    <span className="text-xs text-slate-300 truncate max-w-xs">
                      {addForm.file.name}
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-400">
                  Or paste an image URL:
                </div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={addForm.imageUrl || ""}
                  onChange={(e) =>
                    setAddForm({
                      ...addForm,
                      imageUrl: e.target.value,
                      file: null,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                {/* Preview the image */}
                {(addForm.file || addForm.imageUrl) && (
                  <div className="mt-3">
                    <ProjectImage
                      src={
                        addForm.file
                          ? URL.createObjectURL(addForm.file)
                          : addForm.imageUrl
                      }
                      alt="Preview"
                      className="w-56 h-36 object-cover rounded-xl border border-slate-600 shadow-md bg-slate-800"
                      fallbackClassName="w-56 h-36 rounded-xl border border-slate-600 bg-slate-800 flex items-center justify-center shadow-md"
                      iconClassName="w-10 h-10 text-emerald-400/50"
                      icon={Code}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-700">
                <Button
                  variant="outline"
                  onClick={() => setIsAddProject(false)}
                  className="flex-1"
                  disabled={isAddProjectSaving}
                >
                  Cancel
                </Button>

                <Button
                  variant="success"
                  onClick={addProject}
                  className="flex-1"
                  disabled={isAddProjectSaving}
                >
                  {isAddProjectSaving ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperProfile;
