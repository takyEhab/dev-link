import { useState, useContext, useEffect } from "react";
import {
  MapPin,
  Code,
  Users,
  MessageCircle,
  Globe,
  Github,
  Linkedin,
  Mail,
  Share2,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  GraduationCap,
  Shield,
  FolderOpen,
  Edit,
  Plus,
  Info,
  Upload,
  Camera,
  ExternalLink,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import DeveloperNotFound from "./DeveloperNotFound";
import api from "../services/api";
import { ProjectImage, AvatarImage } from "../components/SafeImage";

const DeveloperProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditSaving, setIsEditSaving] = useState(false);
  const [isAddProjectSaving, setAddProjectSaving] = useState(false);
  const [isAddProject, setIsAddProject] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, setUser, loading: authLoading } = useContext(UserContext);
  const [editForm, setEditForm] = useState({});
  const [editSkillsInput, setEditSkillsInput] = useState("");
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
    linkedin: "",
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
            String(currentUserId))),
  );
  const navigate = useNavigate();

  const fetchDeveloper = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/profile/user/${id}`);
      const profile = res.data?.data?.profile;
      setMyDeveloper(profile);
      if (profile) {
        setEditForm({
          ...profile,
          name: profile.user?.name || "",
          avatar: profile.avatar || "",
          linkedin: profile.linkedin || profile.linkedIn || "",
        });
        setEditSkillsInput(
          Array.isArray(profile.skills) ? profile.skills.join(", ") : "",
        );
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

  const saveChanges = async () => {
    const parsedSkills = editSkillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (
      !editForm.title?.trim() ||
      !editForm.location?.trim() ||
      !editForm.bio?.trim() ||
      parsedSkills.length === 0
    ) {
      toast.error("Title, location, bio, and at least one skill are required.");
      return;
    }

    try {
      setIsEditSaving(true);

      const payload = {
        ...editForm,
        skills: parsedSkills,
      };

      const res = await api.post("/profile/", payload);
      toast.success("Profile updated successfully!");

      const updatedProfile = res.data?.data?.profile;
      if (updatedProfile && isOwnProfile && setUser) {
        setUser((prev) => ({
          ...prev,
          name: updatedProfile.user?.name || editForm.name || prev?.name,
          avatar: updatedProfile.avatar || prev?.avatar,
          title: updatedProfile.title || prev?.title,
        }));
      }

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

      const createdProfile = res.data?.data?.profile;
      setMyDeveloper(createdProfile);
      if (createdProfile && setUser) {
        setUser((prev) => ({
          ...prev,
          avatar: createdProfile.avatar || prev?.avatar,
          title: createdProfile.title || prev?.title,
        }));
      }
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
    const fullUrl = window.location.origin + `/developer/${id}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Profile link copied!");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      toast.success("Profile link copied!");
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
          "Failed to add project. Please try again.",
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
      <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-12 relative">
        <div className="max-w-2xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-10 shadow-xl">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Plus className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Create Your Developer Profile
              </h1>
              <p className="mt-2 text-xs text-zinc-400">
                Your account is ready. Add your professional details so other
                developers can discover and connect with you.
              </p>
            </div>

            {/* Avatar Photo for Setup */}
            <div className="mb-6 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                <AvatarImage
                  src={setupForm.avatar}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-xl object-cover border border-zinc-700"
                  fallbackClassName="w-16 h-16 rounded-xl border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400"
                  iconClassName="w-7 h-7"
                />
              </div>

              <div className="flex-1 w-full space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Profile Avatar Photo (Optional)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition">
                    <Upload className="w-3.5 h-3.5" /> Upload Photo
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
                      className="text-xs text-red-400 hover:text-red-300"
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
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Job Title <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={setupForm.title}
                  onChange={(e) =>
                    setSetupForm({ ...setupForm, title: e.target.value })
                  }
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Location <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={setupForm.location}
                  onChange={(e) =>
                    setSetupForm({ ...setupForm, location: e.target.value })
                  }
                  placeholder="e.g. Cairo, Egypt or Remote"
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Skills (comma-separated){" "}
                  <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={setupForm.skills}
                  onChange={(e) =>
                    setSetupForm({ ...setupForm, skills: e.target.value })
                  }
                  placeholder="React, Node.js, TypeScript, Docker"
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  About You <span className="text-indigo-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={setupForm.bio}
                  onChange={(e) =>
                    setSetupForm({ ...setupForm, bio: e.target.value })
                  }
                  placeholder="Tell other developers about your engineering journey and projects..."
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={setupForm.github}
                    onChange={(e) =>
                      setSetupForm({ ...setupForm, github: e.target.value })
                    }
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={setupForm.linkedin}
                    onChange={(e) =>
                      setSetupForm({ ...setupForm, linkedin: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={createProfile}
              disabled={isSetupSaving}
              className="w-full mt-6 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {isSetupSaving ? "Creating Profile..." : "Create Profile"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const developerName = myDeveloper.user?.name || user?.name || "Developer";
  const developerEmail = myDeveloper.user?.email || user?.email || "";
  const developerTitle = myDeveloper.title || "Developer";
  const developerLocation = myDeveloper.location || "Remote";
  const developerBio = myDeveloper.bio || "No bio added yet.";
  const developerSkills = Array.isArray(myDeveloper.skills)
    ? myDeveloper.skills
    : [];
  const developerEducation = myDeveloper.education || null;
  const developerPortfolio = myDeveloper.portfolio || null;
  const developerGithub = myDeveloper.github || null;
  const developerLinkedin = myDeveloper.linkedin || myDeveloper.linkedIn || null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top Navigation Bar */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          to={isOwnProfile ? "/" : "/developers"}
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {isOwnProfile ? "Back to Feed" : "Back to Developers"}
        </Link>
      </div>

      {/* Profile Header Banner Card */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-sm shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <AvatarImage
                  src={myDeveloper.avatar}
                  alt={developerName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-zinc-700 shadow-md"
                  fallbackClassName="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400"
                  iconClassName="w-10 h-10"
                />
                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={() => setIsEditMode(true)}
                    title="Change avatar photo"
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {developerName}
                  </h1>
                  {isOwnProfile && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-semibold">
                      You
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-indigo-400 mb-2">
                  {developerTitle}
                </p>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    {developerLocation}
                  </span>
                  <span>•</span>
                  <span>
                    {developerProjects.length}{" "}
                    {developerProjects.length === 1 ? "project" : "projects"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleContactDeveloper}
                  disabled={isContacting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  {isContacting ? "Opening Chat..." : "Send Message"}
                </button>
              )}

              <button
                type="button"
                onClick={handleShareProfile}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Layout */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* About / Bio */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-400" /> About
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {developerBio}
              </p>
            </div>

            {/* Skills */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" /> Technologies & Skills
              </h2>
              {developerSkills.length === 0 ? (
                <p className="text-xs text-zinc-500">No skills listed yet.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {developerSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/50 text-zinc-200 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Links & Contact */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" /> Links & Contact
              </h2>

              {developerEmail && (
                <div className="flex items-center gap-3 text-xs text-zinc-300">
                  <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                  <a
                    href={`mailto:${developerEmail}`}
                    className="hover:text-indigo-400 truncate"
                  >
                    {developerEmail}
                  </a>
                </div>
              )}

              {developerPortfolio && (
                <div className="flex items-center gap-3 text-xs text-zinc-300">
                  <Globe className="w-4 h-4 text-zinc-500 shrink-0" />
                  <a
                    href={
                      developerPortfolio.startsWith("http")
                        ? developerPortfolio
                        : `https://${developerPortfolio}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-indigo-400 truncate"
                  >
                    Portfolio Website
                  </a>
                </div>
              )}

              {developerEducation && (
                <div className="flex items-center gap-3 text-xs text-zinc-300 pt-1">
                  <GraduationCap className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="truncate">{developerEducation}</span>
                </div>
              )}

              {/* Social icons */}
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                {developerGithub && (
                  <a
                    href={
                      developerGithub.startsWith("http")
                        ? developerGithub
                        : `https://${developerGithub}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {developerLinkedin && (
                  <a
                    href={
                      developerLinkedin.startsWith("http")
                        ? developerLinkedin
                        : `https://${developerLinkedin}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Projects Showcase */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-indigo-400" />
                Projects ({developerProjects.length})
              </h2>

              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setIsAddProject(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Project
                </button>
              )}
            </div>

            {developerProjects.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
                <FolderOpen className="w-10 h-10 mx-auto mb-3 text-zinc-600" />
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">
                  No projects published yet
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6">
                  {isOwnProfile
                    ? "Showcase your work! Add projects with screenshots and links to demonstrate your engineering skills."
                    : "This developer has not added any public projects yet."}
                </p>
                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={() => setIsAddProject(true)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    Add Your First Project
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {developerProjects.map((project) => (
                  <div
                    key={project.id || project._id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-zinc-700/80 transition-all p-5 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="shrink-0 w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-zinc-800">
                        <ProjectImage
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          fallbackClassName="w-full h-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600"
                          iconClassName="w-8 h-8"
                          icon={Code}
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <h3 className="text-base font-bold text-white truncate">
                              {project.title}
                            </h3>
                            {project.duration && (
                              <span className="text-[11px] text-zinc-500 shrink-0">
                                {project.duration}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {(project.technologies || project.tech || []).map(
                              (tech) => (
                                <span
                                  key={tech}
                                  className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/50 text-[10px] font-medium text-zinc-300"
                                >
                                  {tech}
                                </span>
                              ),
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/60">
                          <Link
                            to={`/project/${project.id || project._id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                          >
                            Details <ExternalLink className="w-3 h-3" />
                          </Link>
                          {(project.githubLink || project.github_link) && (
                            <a
                              href={project.githubLink || project.github_link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white"
                            >
                              <Github className="w-3.5 h-3.5" /> Code
                            </a>
                          )}
                          {(project.liveDemo || project.live_demo) && (
                            <a
                              href={project.liveDemo || project.live_demo}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white"
                            >
                              <Globe className="w-3.5 h-3.5" /> Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditMode && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Edit Profile</h2>
              <button
                onClick={() => setIsEditMode(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Profile Avatar */}
              <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800 flex flex-col sm:flex-row items-center gap-4">
                <AvatarImage
                  src={editForm.avatar}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-xl object-cover border border-zinc-700"
                  fallbackClassName="w-16 h-16 rounded-xl border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400"
                  iconClassName="w-7 h-7"
                />
                <div className="flex-1 w-full space-y-2">
                  <label className="block text-xs font-medium text-zinc-300">
                    Profile Avatar
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition">
                      <Upload className="w-3.5 h-3.5" /> Upload Photo
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
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Remove
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
                    className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Job Title <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.title || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Location <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.location || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Education
                  </label>
                  <input
                    type="text"
                    value={editForm.education || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, education: e.target.value })
                    }
                    placeholder="e.g. BS in Software Engineering"
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Bio <span className="text-indigo-400">*</span>
                </label>
                <textarea
                  value={editForm.bio || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Skills (comma-separated){" "}
                  <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={editSkillsInput}
                  onChange={(e) => setEditSkillsInput(e.target.value)}
                  placeholder="React, TypeScript, Node.js..."
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={editForm.github || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, github: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={editForm.linkedin || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, linkedin: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="flex-1 h-9 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveChanges}
                  disabled={isEditSaving}
                  className="flex-1 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  {isEditSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isAddProject && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Add Project</h2>
              <button
                onClick={() => setIsAddProject(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={addForm.title}
                    onChange={(e) =>
                      setAddForm({ ...addForm, title: e.target.value })
                    }
                    placeholder="e.g. Real-Time Chat Platform"
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={addForm.duration}
                    onChange={(e) =>
                      setAddForm({ ...addForm, duration: e.target.value })
                    }
                    placeholder="e.g. 2 months"
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={addForm.description}
                  onChange={(e) =>
                    setAddForm({ ...addForm, description: e.target.value })
                  }
                  placeholder="Describe the problem solved, tech stack, and features..."
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={addForm.technologies}
                  onChange={(e) =>
                    setAddForm({ ...addForm, technologies: e.target.value })
                  }
                  placeholder="React, TypeScript, WebSocket, Tailwind"
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    GitHub Repository
                  </label>
                  <input
                    type="url"
                    value={addForm.githubLink}
                    onChange={(e) =>
                      setAddForm({ ...addForm, githubLink: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={addForm.liveDemo}
                    onChange={(e) =>
                      setAddForm({ ...addForm, liveDemo: e.target.value })
                    }
                    placeholder="https://demo.devlink.app"
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Project Image */}
              <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Project Screenshot / Thumbnail
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition">
                    <Upload className="w-3.5 h-3.5" /> Upload File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setAddForm({ ...addForm, file, imageUrl: "" });
                        }
                      }}
                    />
                  </label>
                  {addForm.file && (
                    <span className="text-xs text-zinc-400 truncate max-w-xs">
                      {addForm.file.name}
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="Or paste an image URL..."
                  value={addForm.imageUrl}
                  onChange={(e) =>
                    setAddForm({
                      ...addForm,
                      imageUrl: e.target.value,
                      file: null,
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddProject(false)}
                  className="flex-1 h-9 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addProject}
                  disabled={isAddProjectSaving}
                  className="flex-1 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  {isAddProjectSaving ? "Saving..." : "Add Project"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperProfile;
