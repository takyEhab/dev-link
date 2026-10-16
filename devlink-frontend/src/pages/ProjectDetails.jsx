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
      <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold mb-3">Project not found</h1>
        <p className="text-slate-400 mb-6">
          This project may have been removed or is no longer available.
        </p>
        <Link to="/" className="text-emerald-400 hover:text-emerald-300">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <section className="grid lg:grid-cols-[1.5fr_1fr] gap-8 items-start">
          <div>
            <div className="h-72 md:h-96 rounded-2xl overflow-hidden border border-slate-700 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center">
              <ProjectImage
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                fallbackClassName="w-full h-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center"
                iconClassName="w-24 h-24 text-emerald-400/50"
                icon={Code2}
              />
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <span
                  key={technology}
                  className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-sm"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-7">
            <p className="text-sm uppercase tracking-widest text-emerald-400 mb-3">
              Project showcase
            </p>
            <h1 className="text-4xl font-bold mb-5">{project.title}</h1>
            <p className="text-slate-300 leading-7">
              {project.description || "No description has been added yet."}
            </p>
            <div className="mt-7 space-y-4 text-slate-300">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-emerald-400" />{" "}
                {project.duration || "Duration not specified"}
              </div>
              {project.author.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400" />{" "}
                  {project.author.location}
                </div>
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Created by</p>
              <Link
                to={`/developer/${project.author.id}`}
                className="text-xl font-semibold text-white hover:text-emerald-300"
              >
                {project.author.name}
              </Link>
              <p className="text-sm text-emerald-400 mt-1">
                {project.author.title}
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  to={`/developer/${project.author.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-medium"
                >
                  <MessageCircle className="w-4 h-4" /> View Developer
                </Link>
                {project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                {project.live_demo && (
                  <a
                    href={project.live_demo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700"
                  >
                    <ExternalLink className="w-4 h-4" /> Live demo
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
