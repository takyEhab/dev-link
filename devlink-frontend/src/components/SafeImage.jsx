import { useEffect, useState } from "react";
import { Image as ImageIcon, UserRound } from "lucide-react";

/**
 * ProjectImage: displays project image or falls back to default styled project placeholder on error / missing src.
 */
export const ProjectImage = ({
  src,
  alt = "Project",
  className = "",
  fallbackClassName = "",
  iconClassName = "w-10 h-10 text-indigo-300/70",
  icon: Icon = ImageIcon,
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={
          fallbackClassName ||
          `${className} bg-gradient-to-br from-indigo-500/20 to-pink-500/20 flex items-center justify-center border border-zinc-600/50`
        }
        aria-label={`${alt} placeholder`}
      >
        <Icon className={iconClassName} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

/**
 * AvatarImage: displays developer avatar or falls back to default styled avatar placeholder on error / missing src.
 */
export const AvatarImage = ({
  src,
  alt = "Developer",
  className = "",
  fallbackClassName = "",
  iconClassName = "w-10 h-10 text-emerald-300/70",
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={
          fallbackClassName ||
          `${className} border-2 border-slate-600 bg-emerald-500/10 flex items-center justify-center`
        }
        aria-label={`${alt} avatar placeholder`}
      >
        <UserRound className={iconClassName} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

export default ProjectImage;
