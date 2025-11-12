import { useEffect, useState } from 'react';
import LogoCarousel from '../components/LogoCarousel';
import ChatBot from '../components/ChatBot';
import { submitContactForm } from '../services/api';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack';
import Particles from '../components/Particles';
import GlassSurface from '../components/GlassSurface';

interface HomeProps {
  onSectionChange?: (section: string) => void;
}

const Home: React.FC<HomeProps> = ({ onSectionChange }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  // Apply scale effect on scroll
  const smoothProgress = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);
  const imageTranslateY = 0; // Keep position fixed
  const imageScale = 1 - smoothProgress * 0.4; // Scale down from 100% to 60%
  const imageOpacity = 1; // Keep fully visible
  const imageBorderRadius = 0; // No border radius

  // Contact form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await submitContactForm(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', description: '' });
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full overflow-hidden bg-black">
      {/* Home Section - Hero */}
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
              className="text-4xl sm:text-6xl md:text-8xl lg:text-[130px] font-light text-white text-center animate-slide-up-bottom-to-top -mt-20 sm:-mt-40 md:-mt-60 lg:-mt-100"
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

      {/* About Us Section */}
      <section id="about" className="w-full py-8 sm:py-12 md:py-20 lg:py-28 relative bg-black">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Particles
            particleColors={['#ffffff', '#ffffff']}
            particleCount={400}
            particleSpread={10}
            speed={0.05}
            particleBaseSize={80}
            moveParticlesOnHover={false}
            alphaParticles={true}
            disableRotation={false}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-center mb-6 sm:mb-8 md:mb-12 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            About Us
          </h2>

          <div className="max-w-5xl mx-auto">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-center leading-relaxed md:leading-relaxed lg:leading-loose text-white">
              Rise is a multi-disciplinary builder and tech partner uniting Rise Constructions, Rise Architects, Rise AI, and Rise Aluminum to deliver smarter projects end-to-end. We plan, design, and construct with tight cost and schedule control; our architects craft sustainable, code-compliant spaces; our AI tools optimize schedules, quality, and energy performance; and our in-house aluminum and façade systems bring precision, speed, and durability to every envelope. With one accountable team, real-time reporting, and rigorous safety and QA/QC, we reduce risk, cut rework, and hand over assets that perform longer and cost less to operate—so you get a better build from concept to completion.
            </p>
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <section className="w-full bg-black">
        <LogoCarousel logos={[
          { src: '/vegalogo.png', alt: 'Vega Logo' },
          { src: '/CG-Logo.png', alt: 'CG Logo' },
          { src: '/Aigrow.png', alt: 'AI Grow' },
          { src: '/vite.png', alt: 'Rise Logo' },
        ]} />
      </section>

      {/* Service Cards with ScrollStack */}
      <section id="services" className="w-full relative bg-black overflow-hidden" style={{ height: '320vh', willChange: 'auto' }}>
        <ScrollStack
          useWindowScroll={true}
          itemDistance={50}
          itemStackDistance={40}
          stackPosition="20%"
          baseScale={0.9}
          itemScale={0.02}
        >
          {/* Rise Construction Card */}
          <ScrollStackItem itemClassName="!bg-transparent !p-0 !h-auto !shadow-none">
            <div className="w-full">
              <div className="w-full min-h-[50vh] sm:min-h-[45vh] md:min-h-[40vh] lg:h-[50vh] flex items-center justify-center rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px] py-4 sm:py-6 md:py-10 lg:py-12 relative overflow-hidden" style={{ backgroundColor: '#191D23' }}>
                <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-6 lg:gap-8 px-3 sm:px-4 md:px-8">
                  <div className="w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-xl xl:max-w-2xl md:pl-4 lg:pl-8 xl:pl-12 order-1">
                    <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl xl:text-6xl font-light text-white text-center md:text-left mb-2 sm:mb-3 md:mb-4 lg:mb-6 xl:mb-8 break-words" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Rise Construction
                    </h2>
                    <p className="text-xs sm:text-sm md:text-sm lg:text-base xl:text-xl text-white text-center md:text-left leading-relaxed md:leading-snug lg:leading-relaxed xl:leading-loose break-words">
                      Building the future with innovative construction solutions. From residential to commercial projects, we deliver excellence in every structure.
                    </p>
                  </div>
                  <div className="flex-shrink-0 order-2 w-full md:w-auto flex justify-center md:justify-end md:-mr-8 lg:-mr-16 xl:-mr-32">
                    <img
                      src="/excavator.png"
                      alt="Construction Excavator"
                      className="w-full max-w-[220px] sm:max-w-[280px] md:w-auto md:max-w-[400px] lg:max-w-[650px] xl:max-w-[1070px] h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollStackItem>

          {/* Rise Architecture Card */}
          <ScrollStackItem itemClassName="!bg-transparent !p-0 !h-auto !shadow-none">
            <div className="w-full">
              <div className="w-full min-h-[50vh] sm:min-h-[45vh] md:min-h-[40vh] lg:h-[50vh] flex items-center justify-center rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px] py-4 sm:py-6 md:py-10 lg:py-12 relative overflow-hidden" style={{ backgroundColor: '#57707A' }}>
                <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-6 lg:gap-8 px-3 sm:px-4 md:px-8">
                  <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start md:-ml-8 lg:-ml-16 xl:-ml-32 md:order-1">
                    <img
                      src="/architecture-house.png"
                      alt="Architecture House"
                      className="w-full max-w-[200px] sm:max-w-[220px] md:w-auto md:max-w-[300px] lg:max-w-[480px] xl:max-w-[750px] h-auto object-contain"
                    />
                  </div>
                  <div className="w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-xl xl:max-w-2xl md:pr-4 lg:pr-8 xl:pr-12 md:order-2">
                    <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl xl:text-6xl font-light text-white text-center md:text-right mb-2 sm:mb-3 md:mb-4 lg:mb-6 xl:mb-8 break-words" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Rise Architecture
                    </h2>
                    <p className="text-xs sm:text-sm md:text-sm lg:text-base xl:text-xl text-white text-center md:text-right leading-relaxed md:leading-snug lg:leading-relaxed xl:leading-loose break-words">
                      Innovative architectural designs that blend aesthetics with functionality. Creating spaces that inspire and endure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollStackItem>

          {/* Rise AI Card */}
          <ScrollStackItem itemClassName="!bg-transparent !p-0 !h-auto !shadow-none">
            <div className="w-full">
              <div className="w-full min-h-[50vh] sm:min-h-[45vh] md:min-h-[40vh] lg:h-[50vh] flex items-center justify-center rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px] py-4 sm:py-6 md:py-10 lg:py-12 relative overflow-hidden" style={{ backgroundColor: '#7B919C' }}>
                <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-6 lg:gap-8 px-3 sm:px-4 md:px-8">
                  <div className="w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-xl xl:max-w-2xl md:pl-4 lg:pl-8 xl:pl-12 order-1">
                    <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl xl:text-6xl font-light text-white text-center md:text-left mb-2 sm:mb-3 md:mb-4 lg:mb-6 xl:mb-8 break-words" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Rise AI
                    </h2>
                    <p className="text-xs sm:text-sm md:text-sm lg:text-base xl:text-xl text-white text-center md:text-left leading-relaxed md:leading-snug lg:leading-relaxed xl:leading-loose break-words">
                      Cutting-edge artificial intelligence solutions transforming industries. Smart technology for a smarter future.
                    </p>
                  </div>
                  <div className="flex-shrink-0 order-2 w-full md:w-auto flex justify-center md:justify-end md:-mr-8 lg:-mr-16 xl:-mr-32">
                    <img
                      src="/ai-hand.png"
                      alt="AI Hand"
                      className="w-full max-w-[200px] sm:max-w-[220px] md:w-auto md:max-w-[300px] lg:max-w-[480px] xl:max-w-[750px] h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollStackItem>

          {/* Rise Aluminium Card */}
          <ScrollStackItem itemClassName="!bg-transparent !p-0 !h-auto !shadow-none">
            <div className="w-full">
              <div className="w-full min-h-[50vh] sm:min-h-[45vh] md:min-h-[40vh] lg:h-[50vh] flex items-center justify-center rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px] py-4 sm:py-6 md:py-10 lg:py-12 relative overflow-hidden" style={{ backgroundColor: '#989DAA' }}>
                <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-6 lg:gap-8 px-3 sm:px-4 md:px-8">
                  <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start md:-ml-8 lg:-ml-16 xl:-ml-32 md:order-1">
                    <img
                      src="/aluminium-tubes.png"
                      alt="Aluminium Tubes"
                      className="w-full max-w-[180px] sm:max-w-[200px] md:w-auto md:max-w-[280px] lg:max-w-[450px] xl:max-w-[700px] h-auto object-contain scale-x-[-1]"
                    />
                  </div>
                  <div className="w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-xl xl:max-w-2xl md:pr-4 lg:pr-8 xl:pr-12 md:order-2">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white text-center md:text-right mb-2 sm:mb-3 md:mb-6 lg:mb-7 xl:mb-8 break-words" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Rise Aluminium
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white text-center md:text-right leading-relaxed md:leading-relaxed lg:leading-relaxed xl:leading-loose break-words">
                      Premium aluminium fabrication and installation services. Quality materials for lasting performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollStackItem>
        </ScrollStack>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full min-h-screen bg-black relative overflow-hidden flex items-center justify-center pb-0">
        {/* Blurred Background Image */}
        <div
          className="absolute w-full"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: '-50px',
            minHeight: '200vh',
            height: '200vh',
            backgroundImage: 'url(/nature.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            filter: 'blur(10px)',
            transform: 'scale(1.15)'
          }}
        />
        <div className="absolute w-full h-full" style={{ top: 0, left: 0, right: 0, bottom: '-50px', minHeight: '200vh', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}></div>

        <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-24 relative z-10 flex flex-col justify-center py-8 sm:py-12 md:py-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Let's get in touch.
          </h2>

          {/* Contact Card Container */}
          <div className="max-w-7xl mx-auto w-full flex items-center pb-8 sm:pb-12">
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={40}
              brightness={55}
              opacity={0.9}
              blur={12}
              displace={0}
              backgroundOpacity={0.05}
              saturation={1.2}
              distortionScale={-180}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              className="!p-0 hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.5)] transition-all duration-500 overflow-hidden w-full"
            >
              <div className="flex flex-col lg:flex-row min-h-[350px] sm:min-h-[450px] lg:min-h-[550px]">
                {/* Left Side - Image */}
                <div className="w-full lg:w-2/5 relative overflow-hidden min-h-[200px] sm:min-h-[250px] lg:min-h-full">
                  <img
                    src="/nature.png"
                    alt="Nature Background"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-black/70 to-black/50"></div>

                  {/* Text Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-10 text-white">
                    <div className="space-y-4 sm:space-y-6">
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          Get in Touch
                        </h3>
                        <p className="text-base sm:text-lg lg:text-xl leading-relaxed opacity-90 max-w-sm">
                          We're here to help with any questions or inquiries you may have.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm sm:text-base font-light opacity-80">Follow us:</p>
                        <div className="flex gap-5">
                          <a href="#" className="hover:scale-110 hover:opacity-80 transition-all duration-300" aria-label="Instagram">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>
                          <a href="#" className="hover:scale-110 hover:opacity-80 transition-all duration-300" aria-label="Telegram">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                          </a>
                          <a href="#" className="hover:scale-110 hover:opacity-80 transition-all duration-300" aria-label="YouTube">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                          </a>
                          <a href="#" className="hover:scale-110 hover:opacity-80 transition-all duration-300" aria-label="Pinterest">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Contact Form */}
                <div className="w-full lg:w-3/5 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-14 flex flex-col justify-center">
                  <form onSubmit={handleContactSubmit} className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name*"
                    required
                    className="w-full px-0 py-2 sm:py-3 md:py-4 bg-transparent border-0 border-b-2 border-white/30 text-white text-sm sm:text-base md:text-lg placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email*"
                      required
                      className="w-full px-0 py-2 sm:py-3 md:py-4 bg-transparent border-0 border-b-2 border-white/30 text-white text-sm sm:text-base md:text-lg placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-300"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone"
                      className="w-full px-0 py-2 sm:py-3 md:py-4 bg-transparent border-0 border-b-2 border-white/30 text-white text-sm sm:text-base md:text-lg placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Message"
                    className="w-full px-0 py-2 sm:py-3 md:py-4 bg-transparent border-0 border-b-2 border-white/30 text-white text-sm sm:text-base md:text-lg placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-300 resize-none"
                  ></textarea>
                </div>

                {submitStatus === 'success' && (
                  <div className="text-green-400 text-xs sm:text-sm">
                    Thank you! We'll get back to you soon.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="text-red-400 text-xs sm:text-sm">
                    Sorry, something went wrong. Please try again.
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ background: 'linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(68, 117, 54, 1) 50%, rgba(119, 196, 55, 1) 100%)' }}
                    className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 text-white text-xs sm:text-sm md:text-base font-medium rounded-full hover:shadow-2xl hover:shadow-green-500/60 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span className="relative z-10">{isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}</span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(58, 107, 44, 1) 50%, rgba(109, 186, 45, 1) 100%)' }}></div>
                  </button>
                  <span className="text-gray-400 text-xs sm:text-sm">*Required fields</span>
                </div>
              </form>
                </div>
              </div>
            </GlassSurface>
          </div>
        </div>
      </section>

      {/* ChatBot Icon */}
      <ChatBot />
    </div>
  );
};

export default Home;
