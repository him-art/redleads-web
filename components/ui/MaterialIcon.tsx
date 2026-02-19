'use client';

import React from 'react';

interface MaterialIconProps {
  name: string;
  size?: number | string;
  fill?: boolean;
  weight?: number;
  grade?: number;
  opticalSize?: number;
  className?: string;
}

/**
 * Reusable component for Material Symbols (Google Fonts Icons)
 * @param name The ligature name of the icon (e.g., 'search', 'settings')
 * @param size Icon size in pixels (default 24)
 * @param fill Whether the icon should be filled (default false)
 * @param weight Font weight (100-700, default 400)
 * @param grade Font grade (-25 to 200, default 0)
 * @param opticalSize Optical size (20, 24, 40, 48, default 24)
 * @param className Additional Tailwind or CSS classes
 */
export default function MaterialIcon({
  name,
  size = 24,
  fill = false,
  weight = 400,
  grade = 0,
  opticalSize = 24,
  className = '',
}: MaterialIconProps) {
  // Mapping some Lucide names to Material Symbols if they differ significantly
  const iconMap: Record<string, string> = {
    'zap': 'bolt',
    'trending_up': 'trending_up',
    'external_link': 'open_in_new',
    'check_circle': 'check_circle',
    'check_circle2': 'check_circle',
    'copy': 'content_copy',
    'close': 'close',
    'x': 'close',
    'menu': 'menu',
    'globe': 'public',
    'search': 'search',
    'navigation': 'navigation',
    'archive': 'archive',
    'sliders': 'tune',
    'shield': 'shield',
    'shield_check': 'verified_user',
    'lock': 'lock',
    'graduation_cap': 'school',
    'sparkles': 'auto_awesome',
    'clock': 'schedule',
    'alert_triangle': 'warning',
    'loader2': 'sync',
    'inbox': 'inbox',
    'mail': 'mail',
    'activity': 'monitoring',
    'folder': 'folder',
    'chevron_right': 'chevron_right',
    'chevron_down': 'expand_more',
    'calendar': 'calendar_today',
    'target': 'target',
    'message_square': 'chat_bubble',
    'message_circle': 'chat',
  };

  const materialName = iconMap[name.toLowerCase()] || name.toLowerCase();

  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: typeof size === 'number' ? `${size}px` : size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
        ...((typeof size === 'string' && size.includes('rem')) ? { fontSize: size } : {}),
      }}
    >
      {materialName}
    </span>
  );
}
