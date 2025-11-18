import React, { useEffect, useRef, useState, useCallback } from 'react';
import './LogoLoop.css';

interface LogoItem {
  key: string;
  element: React.ReactNode;
}

interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  pauseOnHover?: boolean;
  fadeOut?: boolean; // Kept for API compatibility
  scaleOnHover?: number;
}

interface Position {
  x: number;
  y: number;
}

const LogoLoop: React.FC<LogoLoopProps> = ({
  logos,
  speed = 50,
  direction = 'left',
  pauseOnHover = true,
  scaleOnHover = 1.1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [logoPositions, setLogoPositions] = useState<Position[]>([]);
  const [logoSizes, setLogoSizes] = useState<{ width: number; height: number }[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const velocityRef = useRef(speed);
  const animationRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const logoRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isHorizontal = direction === 'left' || direction === 'right';
  const isReverse = direction === 'right' || direction === 'down';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      setContainerSize({
        width: container.offsetWidth,
        height: container.offsetHeight
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    updateSize();
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const sizes = logoRefs.current.map(ref => {
      if (!ref) return { width: 0, height: 0 };
      return {
        width: ref.offsetWidth,
        height: ref.offsetHeight
      };
    });
    setLogoSizes(sizes);
  }, [logos, containerSize]);

  const initializePositions = useCallback(() => {
    if (logoSizes.length === 0 || containerSize.width === 0) return;

    const gap = 72; // Match the original carousel gap
    const positions: Position[] = [];
    let currentPos = 0;

    // Create multiple sets of logos for infinite loop
    const numSets = 3;
    for (let set = 0; set < numSets; set++) {
      for (let i = 0; i < logos.length; i++) {
        const size = isHorizontal ? logoSizes[i].width : logoSizes[i].height;
        positions.push(
          isHorizontal
            ? { x: currentPos, y: containerSize.height / 2 }
            : { x: containerSize.width / 2, y: currentPos }
        );
        currentPos += size + gap;
      }
    }

    setLogoPositions(positions);
  }, [logoSizes, containerSize, logos.length, isHorizontal]);

  useEffect(() => {
    initializePositions();
  }, [initializePositions]);

  const animate = useCallback(
    (currentTime: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      const targetVelocity = isHovered && pauseOnHover ? 0 : speed;
      const smoothing = 0.1;
      velocityRef.current += (targetVelocity - velocityRef.current) * smoothing;

      const distance = velocityRef.current * deltaTime * (isReverse ? -1 : 1);

      setLogoPositions(prevPositions => {
        if (prevPositions.length === 0) return prevPositions;

        // Calculate the width of one set of logos
        const oneSetSize = logos.length;
        const gap = 72;
        let oneSetWidth = 0;
        for (let i = 0; i < oneSetSize; i++) {
          const sizeVal = isHorizontal ? logoSizes[i].width : logoSizes[i].height;
          oneSetWidth += sizeVal + gap;
        }

        return prevPositions.map((pos, i) => {
          const newPos = { ...pos };
          const logoIndex = i % oneSetSize;
          const size = isHorizontal ? logoSizes[logoIndex].width : logoSizes[logoIndex].height;

          if (isHorizontal) {
            newPos.x += distance;

            // Wrap around when logo goes off screen
            if (isReverse) {
              if (newPos.x + size < -200) {
                newPos.x += oneSetWidth * 3;
              }
            } else {
              if (newPos.x > containerSize.width + 200) {
                newPos.x -= oneSetWidth * 3;
              }
            }
          } else {
            newPos.y += distance;

            if (isReverse) {
              if (newPos.y + size < -200) {
                newPos.y += oneSetWidth * 3;
              }
            } else {
              if (newPos.y > containerSize.height + 200) {
                newPos.y -= oneSetWidth * 3;
              }
            }
          }

          return newPos;
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    },
    [
      isHovered,
      pauseOnHover,
      speed,
      isReverse,
      isHorizontal,
      logoSizes,
      containerSize.width,
      containerSize.height,
      logos.length
    ]
  );

  useEffect(() => {
    if (logoPositions.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, logoPositions.length]);

  const calculateOpacity = () => {
    // Always return full opacity since we're using CSS gradients for fade
    return 1;
  };

  return (
    <div
      ref={containerRef}
      className={`logo-loop-container ${isHorizontal ? 'horizontal' : 'vertical'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredIndex(null);
      }}
    >
      {logoPositions.map((position, index) => {
        const logoIndex = index % logos.length;
        const logo = logos[logoIndex];
        const opacity = calculateOpacity();
        const scale = hoveredIndex === index ? scaleOnHover : 1;

        return (
          <div
            key={`${logo.key}-${index}`}
            ref={el => {
              if (index < logos.length) {
                logoRefs.current[index] = el;
              }
            }}
            className="logo-item"
            style={{
              position: 'absolute',
              left: isHorizontal ? `${position.x}px` : '50%',
              top: isHorizontal ? '50%' : `${position.y}px`,
              transform: `translate(0, -50%) scale(${scale})`,
              opacity,
              transition: 'transform 0.3s ease, opacity 0.1s linear',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {logo.element}
          </div>
        );
      })}
    </div>
  );
};

export default LogoLoop;
