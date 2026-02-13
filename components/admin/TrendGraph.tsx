'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TrendGraphProps {
    data: { date: string; value: number }[];
    title: string;
    total: number;
    color: string;
}

export default function TrendGraph({ data, title, total, color }: TrendGraphProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(300);
    const height = 100;
    const padding = 10;

    // Responsive width
    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                setWidth(entries[0].contentRect.width);
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Scales
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const getX = (i: number) => (i / (data.length - 1)) * (width - padding * 2) + padding;
    const getY = (v: number) => height - ((v / maxValue) * (height - padding * 2)) - padding;

    const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`);
    const linePath = `M ${points.join(' L ')}`;
    const areaPath = `${linePath} L ${width - padding},${height} L ${padding},${height} Z`;

    const activePoint = hoveredIndex !== null ? data[hoveredIndex] : null;

    return (
        <div ref={containerRef} className="p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl flex flex-col justify-between h-full relative overflow-hidden group hover:border-white/10 transition-colors">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 z-10 relative pointer-events-none">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{title}</h3>
                    <p className="text-3xl font-black text-white">{total}</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white/5 text-gray-400 border border-white/5">
                    Last 30 Days
                </div>
            </div>

            {/* Graph Area */}
            <div 
                className="relative w-full h-[100px] z-0"
                onMouseLeave={() => setHoveredIndex(null)}
            >
                <svg 
                    viewBox={`0 0 ${width} ${height}`} 
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                >
                    {/* Gradients */}
                    <defs>
                        <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Area */}
                    <path d={areaPath} fill={`url(#gradient-${title})`} />

                    {/* Line */}
                    <path 
                        d={linePath} 
                        fill="none" 
                        stroke={color} 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="drop-shadow-lg"
                    />

                    {/* Active State Elements */}
                    {hoveredIndex !== null && (
                        <>
                            {/* Vertical Guide Line */}
                            <line 
                                x1={getX(hoveredIndex)} 
                                y1={padding} 
                                x2={getX(hoveredIndex)} 
                                y2={height} 
                                stroke="white" 
                                strokeOpacity="0.1" 
                                strokeDasharray="4 4" 
                            />
                            
                            {/* Active Dot */}
                            <circle 
                                cx={getX(hoveredIndex)} 
                                cy={getY(data[hoveredIndex].value)} 
                                r="4" 
                                fill={color} 
                                stroke="#0A0A0A" 
                                strokeWidth="2" 
                            />
                        </>
                    )}
                </svg>

                {/* Interaction Overlay (Invisible Rects) */}
                <div className="absolute inset-0 flex items-stretch">
                   {data.map((_, i) => (
                       <div 
                           key={i}
                           className="flex-1 hover:bg-transparent"
                           onMouseEnter={() => setHoveredIndex(i)}
                       />
                   ))}
                </div>

                {/* Tooltip */}
                {activePoint && hoveredIndex !== null && (
                    <div 
                        className="absolute top-0 pointer-events-none transform -translate-x-1/2 flex flex-col items-center gap-1"
                        style={{ left: getX(hoveredIndex) }}
                    >
                         <div className="bg-[#151515] border border-white/10 px-3 py-2 rounded-xl shadow-2xl flex flex-col items-center min-w-[80px]">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                {new Date(activePoint.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-lg font-black text-white leading-none">
                                {activePoint.value}
                            </span>
                        </div>
                        {/* Triangle pointing down */}
                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#151515]" />
                    </div>
                )}
            </div>
        </div>
    );
}
