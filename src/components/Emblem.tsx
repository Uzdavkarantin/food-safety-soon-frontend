import Image from "next/image";

export function Emblem({
  size = 44,
  alt = "",
}: {
  size?: number;
  alt?: string;
}) {
  return (
    <Image
      src="/logo.jpg"
      alt={alt}
      width={size}
      height={size}
      priority
      className="rounded-full"
    />
  );
}
