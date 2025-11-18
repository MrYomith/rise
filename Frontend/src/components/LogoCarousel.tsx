import { motion } from "framer-motion";

interface Logo {
  src: string;
  alt: string;
  url?: string;
}

interface LogoCarouselProps {
  logos: Logo[];
  height?: number;
  gap?: number;
  speed?: number;
}

export default function LogoCarousel({
  logos = [],
  height = 56,
  gap = 72,
  speed = 30,
}: LogoCarouselProps) {

  const Row = () => (
    <div className="flex items-center" style={{ gap: `${gap}px` }}>
      {logos.map((l, i) => {
        const isVegaLogo = l.src.includes('vegalogo.png');
        const logoHeight = isVegaLogo ? height * 2.6 : height;

        const logoImage = (
          <img
            key={`${l.alt}-${i}`}
            src={l.src}
            alt={l.alt}
            height={logoHeight}
            style={{ height: logoHeight, width: "auto" }}
            className="opacity-80 hover:opacity-100 transition-opacity max-w-full"
            loading="eager"
          />
        );

        if (l.url) {
          const isExternal = l.url.startsWith('http');
          return (
            <a
              key={`${l.alt}-${i}`}
              href={l.url}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="cursor-pointer pointer-events-auto"
            >
              {logoImage}
            </a>
          );
        }

        return logoImage;
      })}
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden py-8">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-l from-black to-transparent z-10" />

      <motion.div
        className="flex w-[max-content]"
        initial={{ x: "0%" }}
        animate={{ x: ["-0%", "-50%"] }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }}
        aria-label="Partner logos carousel"
      >
        <Row />
        <div style={{ width: gap }} />
        <Row />
        <div style={{ width: gap }} />
        <Row />
        <div style={{ width: gap }} />
        <Row />
        <div style={{ width: gap }} />
        <Row />
        <div style={{ width: gap }} />
        <Row />
      </motion.div>
    </div>
  );
}
