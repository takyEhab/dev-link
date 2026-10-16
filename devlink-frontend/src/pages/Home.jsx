import { useEffect, useState, useContext } from "react";
import {
  Code,
  Search,
  TrendingUp,
  Award,
  ExternalLink,
  Share2,
  Sparkles,
  Star,
  Target,
  Rocket,
  Loader2,
  FolderGit2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { ProjectImage } from "../components/SafeImage";
import { UserContext } from "../context/UserContext";

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
  const { user } = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await api.get("/projects");
        setProjects(response.data.data.projects || []);
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.technologies &&
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(searchTerm.toLowerCase()),
        )) ||
      project.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Featured" && project.featured) ||
      (selectedCategory === "Premium" && project.premium) ||
      (project.technologies &&
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(selectedCategory.toLowerCase()),
        )) ||
      project.category?.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleShareProject = async (event, project) => {
    event.stopPropagation();
    const projectUrl = `${window.location.origin}/project/${project.id || project._id}`;

    try {
      await navigator.clipboard.writeText(projectUrl);
      toast.success("Project link copied to clipboard!");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = projectUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      toast.success("Project link copied to clipboard!");
    }
  };

  const handleShareProjectCTA = () => {
    if (user) {
      navigate(`/developer/${user.id || user._id}`);
    } else {
      toast.info("Please sign in to share your project.");
      navigate("/auth");
    }
  };

  const handleBrowseMoreCTA = () => {
    navigate("/developers");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative">
      {/* Subtle modern ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/10 blur-[130px] rounded-full" />
      </div>

      {/* Hero / Header Section */}
      <section className="relative z-10 pt-16 pb-12 px-6 border-b border-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-indigo-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Curated Developer Showcase
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
            Discover What Top Developers{" "}
            <span className="text-indigo-400">Are Building</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Explore cutting-edge applications, developer tooling, and innovative
            projects crafted by engineering talent worldwide.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search projects, technologies, or developers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-28 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm"
              />
              <div className="absolute right-3">
                <span className="px-2 py-1 rounded-md bg-zinc-800 text-[11px] font-medium text-zinc-400 border border-zinc-700/50">
                  {loading ? (
                    <Loader2 className="w-3 h-3 animate-spin inline" />
                  ) : (
                    `${filteredProjects.length} projects`
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Category Filters */}
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
                  {category === "Featured" && (
                    <Star className="w-3 h-3 mr-1 text-amber-400 fill-amber-400" />
                  )}
                  {category === "Premium" && (
                    <Sparkles className="w-3 h-3 mr-1 text-indigo-400" />
                  )}
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Feed */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 flex flex-col sm:flex-row gap-6 animate-pulse"
                >
                  <div className="w-full sm:w-56 h-36 rounded-xl bg-zinc-800/60 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-zinc-800/60 rounded-lg w-1/3" />
                    <div className="h-4 bg-zinc-800/40 rounded w-1/4" />
                    <div className="h-4 bg-zinc-800/30 rounded w-full" />
                    <div className="h-4 bg-zinc-800/30 rounded w-2/3" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 w-16 bg-zinc-800/50 rounded-md" />
                      <div className="h-6 w-16 bg-zinc-800/50 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800/60 p-12">
              <Code className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">
                No projects found
              </h3>
              <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
                No projects matched your search query or selected filter.
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
            <div className="space-y-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id || project._id}
                  onClick={() => navigate(`/project/${project.id || project._id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/project/${project.id || project._id}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-zinc-700/80 transition-all duration-200 cursor-pointer overflow-hidden p-6 sm:p-7 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Project Image */}
                    <div className="relative shrink-0 w-full sm:w-56 h-40 sm:h-36 rounded-xl overflow-hidden border border-zinc-800">
                      <ProjectImage
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        fallbackClassName="w-full h-full bg-zinc-900 border border-zinc-800 flex items-center justify-center"
                        iconClassName="w-8 h-8 text-zinc-600"
                      />
                      {project.featured && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/90 text-zinc-950 text-[10px] font-bold shadow">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            Featured
                          </span>
                        </div>
                      )}
                      {project.premium && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/90 text-white text-[10px] font-bold shadow">
                            <Sparkles className="w-2.5 h-2.5" />
                            Premium
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Project Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="min-w-0">
                            <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                              {project.title}
                            </h2>
                            <span className="inline-block text-xs font-medium text-indigo-400 mt-0.5">
                              {project.category}
                            </span>
                          </div>
                          <button
                            type="button"
                            title="Share project link"
                            aria-label="Share project link"
                            onClick={(event) =>
                              handleShareProject(event, project)
                            }
                            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed mb-4">
                          {project.description}
                        </p>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.technologies?.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/50 text-[11px] font-medium text-zinc-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Author & Action */}
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                        <span className="text-xs text-zinc-400">
                          By{" "}
                          <span className="font-semibold text-zinc-200">
                            {project.author}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                          View Details <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="relative z-10 py-16 px-6 border-t border-zinc-900 bg-zinc-900/20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 sm:p-12 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Ready to Showcase Your Project?
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Join DevLink to publish your work, receive peer feedback, and
              connect with engineering peers and opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleShareProjectCTA}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-sm transition-all"
              >
                <FolderGit2 className="w-4 h-4" /> Share Your Project
              </button>
              <button
                type="button"
                onClick={handleBrowseMoreCTA}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-sm font-semibold transition-all"
              >
                <Award className="w-4 h-4" /> Discover Developers
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
