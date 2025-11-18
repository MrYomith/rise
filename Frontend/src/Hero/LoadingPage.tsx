import React from 'react';

const LoadingPage: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-white z-50">
      <div className="animate-zoom-out">
        <img
          src="/rise-logo.png"
          alt="The Rise AI Logo"
          className="max-w-[40vw] max-h-[40vh] sm:max-w-[30vw] sm:max-h-[30vh] md:max-w-[20vw] md:max-h-[20vh] lg:max-w-[10vw] lg:max-h-[10vh] object-contain"
        />
      </div>
    </div>
  );
};

export default LoadingPage;
