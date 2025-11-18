import Particles from '../Particles';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="w-full py-8 sm:py-12 md:py-20 lg:py-28 relative bg-black z-10">
      {/* Solid black background layer */}
      <div className="absolute inset-0 bg-black z-0"></div>

      {/* Particles layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
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

      {/* Content layer */}
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
  );
};

export default AboutSection;
