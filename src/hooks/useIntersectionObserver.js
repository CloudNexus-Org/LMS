import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver(options = {}) {
    const elementRef = useRef(null);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const hasTriggered = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasTriggered.current) {
                hasTriggered.current = true;
                setIsIntersecting(true);
            }
        }, options);

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [options.threshold, options.root, options.rootMargin]);

    return { elementRef, isIntersecting };
}