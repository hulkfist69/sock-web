import Image from "next/image";

/**
 * The Sock app icon. Use instead of the "S" purple placeholder everywhere.
 * size = px dimension (width and height are equal).
 */
export default function SockLogo({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/sock-icon.png"
      alt="Sock"
      width={size}
      height={size}
      className={`rounded-xl ${className}`}
      priority
    />
  );
}
