import { useEffect, useState } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import ChatBot from '../components/ChatBot';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import ServicesSection from '../components/sections/ServicesSection';
import ContactSection from '../components/sections/ContactSection';

interface HomeProps {
  onSectionChange?: (section: string) => void;
}

const Home: React.FC<HomeProps> = ({ onSectionChange }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = ['home', 'about', 'services', 'contact'];
          const scrollPosition = window.scrollY + window.innerHeight / 3;

          for (const sectionId of sections) {
            const element = document.getElementById(sectionId);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                onSectionChange?.(sectionId);
                break;
              }
            }
          }

          const homeSection = document.getElementById('home');
          if (homeSection) {
            const homeHeight = homeSection.offsetHeight;
            const scrollY = window.scrollY;
            const progress = Math.min(scrollY / homeHeight, 1);

            // Update animation state based on scroll position
            if (scrollY > 0) {
              setIsAnimating(true);
            } else {
              setIsAnimating(false);
            }

            setScrollProgress(progress);
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [onSectionChange, isAnimating]);

  return (
    <div className="w-full overflow-hidden bg-black">
      {/* Home Section - Hero */}
      <HeroSection scrollProgress={scrollProgress} />

      {/* About Us Section */}
      <AboutSection />

      {/* Logo Carousel */}
      <section className="w-full bg-black relative z-10">
        <div className="absolute inset-0 bg-black z-0"></div>
        <div className="relative z-10">
          <LogoCarousel logos={[
            { src: '/vegalogo.png', alt: 'Vega Logo', url: 'https://www.vega.lk/' },
            { src: '/CG-Logo.png', alt: 'CG Logo', url: 'https://codegen.co.uk/' },
            { src: '/Aigrow.png', alt: 'AI Grow', url: 'https://aigrow.lk/' },
            { src: '/vite.png', alt: 'Rise Logo', url: '/' },
          ]} />
        </div>
      </section>

      {/* Service Cards with ScrollStack */}
      <ServicesSection />

      {/* Contact Section */}
      <ContactSection />

      {/* ChatBot Icon */}
      <ChatBot />
    </div>
  );
};

export default Home;
