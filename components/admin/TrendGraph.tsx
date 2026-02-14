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
    const height = 220; // Increased height for axes
    const paddingLeft = 45;
    const paddingRight = 10;
    const paddingTop = 20;
    const paddingBottom = 40;

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
    const maxValue = Math.ceil(Math.max(...data.map(d => d.value), 1) / 5) * 5;
    const getX = (i: number) => (i / (data.length - 1)) * (width - paddingLeft - paddingRight) + paddingLeft;
    const getY = (v: number) => height - ((v / maxValue) * (height - paddingTop - paddingBottom)) - paddingBottom;

    // Smooth Path Data Generation (Bezier)
    const renderPath = () => {
        if (data.length < 2) return "";
        
        type Point = { x: number, y: number };
        const points: Point[] = data.map((d, i) => ({ x: getX(i), y: getY(d.value) }));
        
        let pathLine = `M ${points[0].x},${points[0].y}`;
        
        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            
            // Simple smoothing: control points are 1/3 and 2/3 of the way
            // For better smoothing, we look at neighbors
            const prev = points[i - 1] || curr;
            const next2 = points[i + 2] || next;
            
            const tension = 0.2;
            
            const cp1x = curr.x + (next.x - prev.x) * tension;
            const cp1y = curr.y + (next.y - prev.y) * tension;
            
            const cp2x = next.x - (next2.x - curr.x) * tension;
            const cp2y = next.y - (next2.y - curr.y) * tension;
            
            pathLine += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
        }
        
        return pathLine;
    };

    const linePath = renderPath();
    const activePoint = hoveredIndex !== null ? data[hoveredIndex] : null;

    // Grid lines calculation
    const gridSteps = 5;
    const gridLines = Array.from({ length: gridSteps + 1 }, (_, i) => {
        const value = (maxValue / gridSteps) * i;
        return { value, y: getY(value) };
    });

    // Date labels for X axis (show 7 labels)
    const xLabels = data.filter((_, i) => i % Math.ceil(data.length / 7) === 0 || i === data.length - 1);

    return (
        <div ref={containerRef} className="p-8 bg-white border border-gray-100 rounded-[2rem] flex flex-col justify-between h-full relative overflow-hidden group hover:border-gray-200 transition-all duration-500 shadow-sm hover:shadow-md">
            {/* Header */}
            <div className="flex justify-between items-start mb-10 z-10 relative pointer-events-none">
                <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{title}</h3>
                    <p className="text-4xl font-black text-black tracking-tight">{total}</p>
                </div>
                <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-gray-50 text-gray-400 border border-gray-100">
                    Last 30 Days
                </div>
            </div>

            {/* Graph Area */}
            <div 
                className="relative w-full h-[220px] z-0"
                onMouseLeave={() => setHoveredIndex(null)}
            >
                <svg 
                    viewBox={`0 0 ${width} ${height}`} 
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                >
                    {/* Grid Lines & Y Labels */}
                    {gridLines.map((line, i) => (
                        <g key={i}>
                            <line 
                                x1={paddingLeft} 
                                y1={line.y} 
                                x2={width - paddingRight} 
                                y2={line.y} 
                                stroke="#F3F4F6" 
                                strokeWidth="1" 
                            />
                            <text 
                                x={paddingLeft - 12} 
                                y={line.y + 4} 
                                textAnchor="end" 
                                className="text-[10px] font-medium fill-gray-400"
                            >
                                {line.value}
                            </text>
                        </g>
                    ))}

                    {/* X Axis Labels */}
                    {xLabels.map((d, i) => (
                        <text 
                            key={i}
                            x={getX(data.indexOf(d))} 
                            y={height - 10} 
                            textAnchor="middle" 
                            className="text-[10px] font-medium fill-gray-400"
                        >
                            {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </text>
                    ))}

                    {/* Smooth Line */}
                    <path 
                        d={linePath} 
                        fill="none" 
                        stroke={color} 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                    />

                    {/* Active State Elements */}
                    {hoveredIndex !== null && (
                        <>
                            {/* Vertical Guide Line */}
                            <line 
                                x1={getX(hoveredIndex)} 
                                y1={paddingTop} 
                                x2={getX(hoveredIndex)} 
                                y2={height - paddingBottom} 
                                stroke="black" 
                                strokeOpacity="1"
                                strokeWidth="1.5"
                                strokeDasharray="4 4" 
                            />
                            
                            {/* Active Dot */}
                            <circle 
                                cx={getX(hoveredIndex)} 
                                cy={getY(data[hoveredIndex].value)} 
                                r="8" 
                                fill="black" 
                                stroke="white" 
                                strokeWidth="3" 
                                className="shadow-2xl"
                            />
                        </>
                    )}
                </svg>

                {/* Interaction Overlay */}
                <div className="absolute inset-0 flex items-stretch" style={{ left: paddingLeft, right: paddingRight, bottom: paddingBottom, top: paddingTop }}>
                   {data.map((_, i) => (
                       <div 
                           key={i}
                           className="flex-1 hover:bg-transparent cursor-crosshair"
                           onMouseEnter={() => setHoveredIndex(i)}
                       />
                   ))}
                </div>

                {/* Tooltip */}
                {activePoint && hoveredIndex !== null && (
                    <div 
                        className="absolute pointer-events-none transform -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-200"
                        style={{ 
                            left: getX(hoveredIndex), 
                            top: getY(data[hoveredIndex].value) - 75 
                        }}
                    >
                         <div className="bg-[#0A0A0A] px-4 py-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col items-center min-w-[100px] border border-white/5">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] leading-none mb-1.5">
                                {new Date(activePoint.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">{title}</span>
                                <span className="text-xl font-black text-white leading-none">
                                    {activePoint.value}
                                </span>
                            </div>
                        </div>
                        {/* Speech bubble triangle */}
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#0A0A0A]" />
                    </div>
                )}
            </div>
        </div>
    );
}
