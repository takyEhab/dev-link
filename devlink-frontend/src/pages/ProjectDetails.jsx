import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Code2,
  ExternalLink,
  Github,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { ProjectImage } from "../components/SafeImage";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await api.get(`/projects/id/${id}`);
        setProject(response.data.data.project);
      } catch (error) {
        toast.error(error.response?.data?.error || "Unable to load project.");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center text-sm">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Project not found</h1>
        <p className="text-zinc-400 text-sm mb-6">
          This project may have been removed or is no longer available.
        </p>
        <Link
          to="/"
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
        >
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to projects
        </button>

        <section className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
          <div>
            <div className="h-72 md:h-96 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center">
              <ProjectImage
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                fallbackClassName="w-full h-full bg-zinc-900 border border-zinc-800 flex items-center justify-center"
                iconClassName="w-16 h-16 text-zinc-600"
                icon={Code2}
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies?.map((technology) => (
                <span
                  key={technology}
                  className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 backdrop-blur-sm">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400 mb-2 block">
              Project Showcase
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-4">
              {project.title}
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {project.description || "No description has been added yet."}
            </p>

            <div className="space-y-3 text-xs text-zinc-400 border-t border-zinc-800/80 pt-5">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-zinc-500" />
                <span>{project.duration || "Duration not specified"}</span>
              </div>
              {project.author?.location && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-zinc-500" />
                  <span>{project.author.location}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800/80">
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-1">
                Created by
              </span>
              <Link
                to={`/developer/${project.author?.id || project.author?._id}`}
                className="text-lg font-semibold text-white hover:text-indigo-400 transition-colors"
              >
                {project.author?.name}
              </Link>
              {project.author?.title && (
                <p className="text-xs text-zinc-400 mt-0.5">
                  {project.author.title}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-6">
                <Link
                  to={`/developer/${project.author?.id || project.author?._id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> View Developer
                </Link>
                {project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" /> Source Code
                  </a>
                )}
                {project.live_demo && (
                  <a
                    href={project.live_demo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProjectDetails;
