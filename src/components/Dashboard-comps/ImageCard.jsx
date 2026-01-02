"use client";

import Image from "next/image";
import PropTypes from "prop-types";

/**
 * ImageCard
 *
 * Props:
 * - image: string | StaticImport (required) — path or imported image
 * - alt: string
 * - title: string
 * - subtitle: string
 * - badge: string
 * - aspect: "1/1" | "4/3" | "16/9" | "3/4" (default "4/3")
 * - className: additional wrapper classes
 * - onClick: optional click handler
 */
export default function ImageCard({
  image,
  alt = "",
  title,
  subtitle,
  badge,
  aspect = "4/3",
  className = "",
  onClick,
}) {
  // map aspect prop to Tailwind aspect-ratio classes
  const aspectMap = {
    "1/1": "aspect-square",
    "4/3": "aspect-[4/3]",
    "16/9": "aspect-video",
    "3/4": "aspect-[3/4]",
  };
  const aspectClass = aspectMap[aspect] ?? aspectMap["4/3"];

  return (
    <article
      role={onClick ? "button" : "article"}
      onClick={onClick}
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-150 ${className}`}
    >
      <div className={`${aspectClass} relative w-full bg-gray-100`}>
        <Image
          src={image}
          alt={alt || title || "image"}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          style={{ objectFit: "cover" }}
          className="group-hover:scale-105 transition-transform duration-300"
          priority={false}
        />
        {badge && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm ring-1 ring-black/5">
            {badge}
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4">
        {title && <h3 className="text-sm sm:text-base font-medium text-slate-900">{title}</h3>}
        {subtitle && <p className="mt-1 text-xs sm:text-sm text-slate-500">{subtitle}</p>}
      </div>
    </article>
  );
}

ImageCard.propTypes = {
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  alt: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  badge: PropTypes.string,
  aspect: PropTypes.oneOf(["1/1", "4/3", "16/9", "3/4"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
};
