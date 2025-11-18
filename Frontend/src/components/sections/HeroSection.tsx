interface HeroSectionProps {
  scrollProgress: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollProgress }) => {
  // Apply scale effect on scroll
  const smoothProgress = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);
  const imageTranslateY = 0; // Keep position fixed
  const imageScale = 1 - smoothProgress * 0.4; // Scale down from 100% to 60%
  const imageOpacity = 1; // Keep fully visible
  const imageBorderRadius = 0; // No border radius

  return (
    <section id="home" className="relative w-full h-screen overflow-hidden">
      <div
        className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none transition-opacity duration-500"
        style={{
          opacity: scrollProgress >= 1 ? 0 : 1,
          visibility: scrollProgress >= 1 ? 'hidden' : 'visible'
        }}
      >
        {/* Background Image with Animation */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden animate-zoom-out-images"
          style={{
            transform: `translateY(${imageTranslateY}px) scale(${imageScale})`,
            opacity: imageOpacity,
            borderRadius: `${imageBorderRadius}px`,
            willChange: 'transform, opacity',
          }}
        >
          <img
            src="/withbg.JPG"
            alt="Background"
            className="w-full h-full object-cover object-center"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </div>

        {/* Text between background and overlay */}
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 pt-16 sm:pt-24 md:pt-32 pointer-events-auto"
          style={{
            transform: `translateY(${imageTranslateY}px) scale(${imageScale})`,
            opacity: imageOpacity,
            willChange: 'transform, opacity',
          }}
        >
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[130px] font-light text-white text-center animate-slide-up-bottom-to-top -mt-40 sm:-mt-56 md:-mt-72 lg:-mt-100"
            style={{
              fontFamily: "'IM Fell English', serif",
              transform: 'scaleX(1.0)',
            }}
          >
            The Rise AI
          </h1>
        </div>

        {/* Image overlay on top with Animation - Full Screen */}
        <div
          className="absolute inset-0 w-full h-full z-20 pointer-events-none overflow-hidden animate-zoom-out-images"
          style={{
            transform: `translateY(${imageTranslateY}px) scale(${imageScale})`,
            opacity: imageOpacity,
            borderRadius: `${imageBorderRadius}px`,
            willChange: 'transform, opacity',
          }}
        >
          <img
            src="/withoutbg.png"
            alt="Image Overlay"
            className="w-full h-full object-cover"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
