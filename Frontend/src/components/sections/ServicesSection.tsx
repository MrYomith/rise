import ScrollStack, { ScrollStackItem } from '../ScrollStack';

const ServicesSection: React.FC = () => {
  return (
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
          <a href="https://www.inriseconstruction.com/" target="_blank" rel="noopener noreferrer" className="w-full block cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-full h-[50vh] sm:h-[45vh] md:h-[40vh] lg:h-[50vh] flex items-center justify-center rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px] py-4 sm:py-6 md:py-10 lg:py-12 relative overflow-hidden" style={{ backgroundColor: '#191D23' }}>
              <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-6 lg:gap-8 px-3 sm:px-4 md:px-8">
                <div className="w-full max-w-full sm:max-w-full md:max-w-md lg:max-w-xl xl:max-w-2xl md:pl-4 lg:pl-8 xl:pl-12 order-1">
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
                    className="w-full max-w-[150px] sm:max-w-[180px] md:w-auto md:max-w-[250px] lg:max-w-[400px] xl:max-w-[600px] h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </a>
        </ScrollStackItem>

        {/* Rise Architecture Card */}
        <ScrollStackItem itemClassName="!bg-transparent !p-0 !h-auto !shadow-none">
          <div className="w-full">
            <div className="w-full h-[50vh] sm:h-[45vh] md:h-[40vh] lg:h-[50vh] flex items-center justify-center rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px] py-4 sm:py-6 md:py-10 lg:py-12 relative overflow-hidden" style={{ backgroundColor: '#57707A' }}>
              <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-6 lg:gap-8 px-3 sm:px-4 md:px-8">
                <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start md:-ml-8 lg:-ml-16 xl:-ml-32 md:order-1">
                  <img
                    src="/architecture-house.png"
                    alt="Architecture House"
                    className="w-full max-w-[130px] sm:max-w-[150px] md:w-auto md:max-w-[200px] lg:max-w-[320px] xl:max-w-[480px] h-auto object-contain"
                  />
                </div>
                <div className="w-full max-w-full sm:max-w-full md:max-w-md lg:max-w-xl xl:max-w-2xl md:pr-4 lg:pr-8 xl:pr-12 md:order-2">
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
            <div className="w-full h-[50vh] sm:h-[45vh] md:h-[40vh] lg:h-[50vh] flex items-center justify-center rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px] py-4 sm:py-6 md:py-10 lg:py-12 relative overflow-hidden" style={{ backgroundColor: '#7B919C' }}>
              <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-6 lg:gap-8 px-3 sm:px-4 md:px-8">
                <div className="w-full max-w-full sm:max-w-full md:max-w-md lg:max-w-xl xl:max-w-2xl md:pl-4 lg:pl-8 xl:pl-12 order-1">
                  <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl xl:text-6xl font-light text-white text-center md:text-left mb-2 sm:mb-3 md:mb-4 lg:mb-6 xl:mb-8 break-words" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Rise AI
                  </h2>
                  <p className="text-xs sm:text-sm md:text-sm lg:text-base xl:text-xl text-white text-center md:text-left leading-relaxed md:leading-snug lg:leading-relaxed xl:leading-loose break-words">
                    Cutting-edge artificial intelligence solutions transforming industries. Smart technology for a smarter future.
                  </p>
                </div>
                <div className="flex-shrink-0 order-2 w-full md:w-auto flex justify-center md:justify-center md:mr-0 lg:mr-0 xl:mr-0">
                  <img
                    src="/eaglelogo.png"
                    alt="Rise AI Eagle Logo"
                    className="w-full max-w-[120px] sm:max-w-[140px] md:w-auto md:max-w-[180px] lg:max-w-[280px] xl:max-w-[400px] h-auto object-contain"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollStackItem>

        {/* Rise Aluminium Card */}
        <ScrollStackItem itemClassName="!bg-transparent !p-0 !h-auto !shadow-none">
          <div className="w-full">
            <div className="w-full h-[50vh] sm:h-[45vh] md:h-[40vh] lg:h-[50vh] flex items-center justify-center rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px] py-4 sm:py-6 md:py-10 lg:py-12 relative overflow-hidden" style={{ backgroundColor: '#989DAA' }}>
              <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-6 lg:gap-8 px-3 sm:px-4 md:px-8">
                <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start md:-ml-8 lg:-ml-16 xl:-ml-32 md:order-1">
                  <img
                    src="/aluminium-tubes.png"
                    alt="Aluminium Tubes"
                    className="w-full max-w-[180px] sm:max-w-[200px] md:w-auto md:max-w-[280px] lg:max-w-[450px] xl:max-w-[700px] h-auto object-contain scale-x-[-1]"
                  />
                </div>
                <div className="w-full max-w-full sm:max-w-full md:max-w-md lg:max-w-xl xl:max-w-2xl md:pr-4 lg:pr-8 xl:pr-12 md:order-2">
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
  );
};

export default ServicesSection;
