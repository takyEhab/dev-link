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
  iconClassName = "w-8 h-8 text-zinc-500",
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
          `${className} bg-zinc-900 border border-zinc-800 flex items-center justify-center`
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
  iconClassName = "w-6 h-6 text-zinc-400",
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
          `${className} border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400`
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
