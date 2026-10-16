import { useEffect, useState, useContext } from "react";
import {
  Search,
  MapPin,
  Code,
  Users,
  ExternalLink,
  MessageCircle,
  Eye,
  Share2,
  CheckCircle,
  Briefcase,
  Github,
  Linkedin,
  Mail,
  Loader2,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { UserContext } from "../context/UserContext";
import { ProjectImage, AvatarImage } from "../components/SafeImage";

const categories = [
  "All",
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "DevOps",
  "AI / ML",
];

const TalentDiscovery = () => {
  const [talentProfiles, setTalentProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactingId, setContactingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("projects");

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

  const handleShareDeveloper = async (event, talent) => {
    event.stopPropagation();
    const profileUrl = `${window.location.origin}/developer/${talent.id}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Developer profile link copied!");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = profileUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      toast.success("Developer profile link copied!");
    }
  };

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const response = await api.get("/profile");
        const profiles = (response.data.data.profiles || []).map((profile) => ({
          id: profile.user?.id || profile.user_id || profile.id,
          name: profile.user?.name || "Developer",
          title: profile.title || "Developer",
          location: profile.location || "Remote",
          avatar: profile.avatar || null,
          projects: profile.projectCount || 0,
          skills: profile.skills || [],
          education: profile.education || null,
          recentProjects: profile.recentProjects || [],
          bio: profile.bio || "No bio added yet.",
          github: profile.github || null,
          linkedin: profile.linkedin || null,
          email: profile.user?.email || null,
        }));
        setTalentProfiles(profiles);
      } catch (error) {
        console.error("Failed to load developers", error);
        toast.error("Failed to load developer profiles.");
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
      talent.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "All" ||
      talent.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      talent.skills.some((skill) =>
        skill.toLowerCase().includes(selectedCategory.toLowerCase()),
      );

    return matchesSearch && matchesCategory;
  });

  const sortedTalent = [...filteredTalent].sort((a, b) => {
    switch (sortBy) {
      case "projects":
        return b.projects - a.projects;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative">
      {/* Subtle modern ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/10 blur-[130px] rounded-full" />
      </div>

      {/* Header Section */}
      <section className="relative z-10 pt-16 pb-12 px-6 border-b border-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-indigo-400 mb-6">
            <Users className="w-3.5 h-3.5" />
            Talent Discovery
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
            Connect with World-Class{" "}
            <span className="text-indigo-400">Developers</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Explore verified engineers, designers, and tech creators. Direct
            messaging, verified project portfolios, and transparent collaboration.
          </p>

          {/* Search & Sort Controls */}
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, skills, title, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 px-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-medium text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="projects">Sort by Most Projects</option>
                <option value="name">Sort by Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Developers Directory Grid */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-4 animate-pulse"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-zinc-800/60 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-zinc-800/60 rounded w-1/2" />
                      <div className="h-4 bg-zinc-800/40 rounded w-1/3" />
                      <div className="h-3 bg-zinc-800/30 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-10 bg-zinc-800/30 rounded" />
                </div>
              ))}
            </div>
          ) : sortedTalent.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800/60 p-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">
                No developers found
              </h3>
              <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
                No profiles matched your search or category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {sortedTalent.map((talent) => (
                <div
                  key={talent.id}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-zinc-700/80 transition-all duration-200 p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Avatar, Name, Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative shrink-0">
                        <AvatarImage
                          src={talent.avatar}
                          alt={talent.name}
                          className="w-16 h-16 rounded-xl object-cover border border-zinc-700"
                          fallbackClassName="w-16 h-16 rounded-xl border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400"
                          iconClassName="w-7 h-7"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/developer/${talent.id}`}
                            className="text-lg font-bold text-white hover:text-indigo-400 transition-colors truncate block"
                          >
                            {talent.name}
                          </Link>
                          <button
                            type="button"
                            title="Share developer profile"
                            onClick={(event) =>
                              handleShareDeveloper(event, talent)
                            }
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors shrink-0"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-medium text-indigo-400 truncate">
                          {talent.title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-zinc-500" />
                            {talent.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-zinc-500" />
                            {talent.projects} {talent.projects === 1 ? "project" : "projects"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-4">
                      {talent.bio}
                    </p>

                    {/* Skills */}
                    {talent.skills && talent.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {talent.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/50 text-[10px] font-medium text-zinc-300"
                          >
                            {skill}
                          </span>
                        ))}
                        {talent.skills.length > 5 && (
                          <span className="px-1.5 py-0.5 text-[10px] text-zinc-500 font-medium">
                            +{talent.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions & Social Links */}
                  <div className="pt-4 border-t border-zinc-800/70 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {(!user ||
                        String(talent.id) !==
                          String(user?.id || user?._id)) && (
                        <button
                          type="button"
                          disabled={contactingId === talent.id}
                          onClick={() => handleContactDeveloper(talent.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {contactingId === talent.id ? "Opening..." : "Message"}
                        </button>
                      )}
                      <Link
                        to={`/developer/${talent.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Profile
                      </Link>
                    </div>

                    {/* Social icons */}
                    <div className="flex items-center gap-1 text-zinc-400">
                      {talent.github && (
                        <a
                          href={
                            talent.github.startsWith("http")
                              ? talent.github
                              : `https://${talent.github}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
                          title="GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {talent.linkedin && (
                        <a
                          href={
                            talent.linkedin.startsWith("http")
                              ? talent.linkedin
                              : `https://${talent.linkedin}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {talent.email && (
                        <a
                          href={`mailto:${talent.email}`}
                          className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
                          title="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modern CTA */}
      <section className="relative z-10 py-16 px-6 border-t border-zinc-900 bg-zinc-900/20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 sm:p-12 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Are You a Developer?
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Create your developer profile to showcase your code, connect with
              collaborators, and build your engineering presence.
            </p>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() =>
                  user
                    ? navigate(`/developer/${user.id || user._id}`)
                    : navigate("/auth")
                }
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" /> Join as Developer
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TalentDiscovery;
