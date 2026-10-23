import Image from "next/image";

export function Emblem({
  size = 44,
  alt = "",
  preload = false,
  className = "",
}: {
  size?: number;
  alt?: string;
  preload?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/logo.jpg"
      alt={alt}
      width={size}
      height={size}
      preload={preload}
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  );
}
