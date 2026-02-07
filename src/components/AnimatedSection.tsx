'use client';

import { useEffect, useState } from 'react';

type Props = {
    children: React.ReactNode;
    delay?: number;
};

export function AnimatedSection({ children, delay = 0 }: Props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={`transition-all duration-700 ease-out ${visible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
                }`}
        >
            {children}
        </div>
    );
}
