import { useEffect, useState } from "react";
import { Code2, UserRound } from "lucide-react";

/**
 * ProjectImage: displays project image or falls back to default styled project placeholder on error / missing src.
 */
export const ProjectImage = ({
  src,
  alt = "Project",
  className = "",
  fallbackClassName = "",
  iconClassName = "w-10 h-10 text-zinc-600",
  icon: Icon = Code2,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const isInvalid =
    !src ||
    typeof src !== "string" ||
    !src.trim() ||
    src.trim() === "null" ||
    src.trim() === "undefined";

  if (isInvalid || hasError) {
    return (
      <div
        className={
          fallbackClassName ||
          `${className} bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600`
        }
        aria-label={`${alt} placeholder`}
      >
        <Icon className={iconClassName} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center text-zinc-700 z-0"
          aria-hidden="true"
        >
          <Icon className={iconClassName} />
        </div>
      )}
      <img
        ref={(img) => {
          if (img?.complete && !isLoaded) {
            setIsLoaded(true);
          }
        }}
        src={src}
        alt={alt}
        className={`${className} ${
          isLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const isInvalid =
    !src ||
    typeof src !== "string" ||
    !src.trim() ||
    src.trim() === "null" ||
    src.trim() === "undefined";

  if (isInvalid || hasError) {
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
    <div
      className={`relative overflow-hidden shrink-0 inline-flex items-center justify-center ${className}`}
    >
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-zinc-800 animate-pulse flex items-center justify-center text-zinc-500"
          aria-hidden="true"
        >
          <UserRound className={iconClassName} />
        </div>
      )}
      <img
        ref={(img) => {
          if (img?.complete && !isLoaded) {
            setIsLoaded(true);
          }
        }}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${
          isLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-200`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
};

export default ProjectImage;
