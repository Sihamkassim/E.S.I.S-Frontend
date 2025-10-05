// components/AnimatedComponents.tsx
import React, { useRef, useState, useEffect } from 'react';

// Custom hook for scroll animations
type ScrollAnimationOptions = {
    threshold?: number;
    rootMargin?: string;
};

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: options.threshold || 0.1,
                rootMargin: options.rootMargin || '0px 0px -100px 0px'
            }
        );

        observer.observe(element);
        return () => observer.unobserve(element);
    }, [options.threshold, options.rootMargin]);

    return { ref: elementRef, isVisible };
};

// Animation wrapper component
type AnimationType = 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'rotateIn';

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    animationType?: AnimationType;
    delay?: number;
    duration?: number;
    threshold?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
    children,
    className = '',
    animationType = 'fadeInUp',
    delay = 0,
    duration = 0.8,
    threshold = 0.1
}) => {
    const { ref, isVisible } = useScrollAnimation({ threshold });

    const animations: Record<AnimationType, { initial: React.CSSProperties; animate: React.CSSProperties }> = {
        fadeInUp: {
            initial: { opacity: 0, transform: 'translateY(60px)' },
            animate: { opacity: 1, transform: 'translateY(0px)' }
        },
        fadeInLeft: {
            initial: { opacity: 0, transform: 'translateX(-60px)' },
            animate: { opacity: 1, transform: 'translateX(0px)' }
        },
        fadeInRight: {
            initial: { opacity: 0, transform: 'translateX(60px)' },
            animate: { opacity: 1, transform: 'translateX(0px)' }
        },
        scaleIn: {
            initial: { opacity: 0, transform: 'scale(0.8)' },
            animate: { opacity: 1, transform: 'scale(1)' }
        },
        rotateIn: {
            initial: { opacity: 0, transform: 'rotate(-10deg) scale(0.9)' },
            animate: { opacity: 1, transform: 'rotate(0deg) scale(1)' }
        }
    };

    const animation = animations[animationType as AnimationType] || animations.fadeInUp;

    return (
        <div
            ref={ref}
            className={className}
            style={{
                ...animation.initial,
                ...(isVisible ? animation.animate : {}),
                transition: `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
                willChange: 'transform, opacity'
            }}
        >
            {children}
        </div>
    );
};

// Staggered animation container
interface StaggeredContainerProps {
    children: React.ReactElement[] | React.ReactElement;
    className?: string;
    staggerDelay?: number;
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({ children, className = '', staggerDelay = 0.1 }) => {
    return (
        <div className={className}>
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, {
                        delay: index * staggerDelay
                    });
                }
                return child;
            })}
        </div>
    );
};