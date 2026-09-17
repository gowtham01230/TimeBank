import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface StarRatingProps {
  count?: number;
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  readOnly?: boolean;
}

const Star: React.FC<{ filled: boolean, onClick?: () => void, onMouseEnter?: () => void, onMouseLeave?: () => void, size: number, fillColor: string, strokeColor: string, emptyFill: string, emptyStroke: string}> = ({ filled, onClick, onMouseEnter, onMouseLeave, size, fillColor, strokeColor, emptyFill, emptyStroke }) => (
  <svg
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    height={`${size}px`}
    width={`${size}px`}
    viewBox="0 0 24 24"
    className={`cursor-${onClick ? 'pointer' : 'default'} transition-colors duration-200`}
    fill={filled ? fillColor : emptyFill}
    stroke={filled ? strokeColor : emptyStroke}
    strokeWidth="1"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const StarRating: React.FC<StarRatingProps> = ({
  count = 5,
  value,
  onChange,
  size = 24,
  readOnly = false,
}) => {
  const [hover, setHover] = useState<number | null>(null);
  const { theme } = useTheme();

  const themeColors = {
      light: {
          fill: '#FBBF24', // Amber 400 - still looks good and universal for ratings
          stroke: '#F59E0B', // Amber 500
          emptyFill: '#E5E7EB', // Gray 200
          emptyStroke: '#D1D5DB', // Gray 300
      },
      dark: {
          fill: '#E0B841', // nocturne-accent
          stroke: '#E0B841',
          emptyFill: 'rgba(255, 255, 255, 0.1)', // nocturne-border
          emptyStroke: 'rgba(255, 255, 255, 0.2)', // nocturne-text-subtle
      }
  }

  const colors = theme === 'dark' ? themeColors.dark : themeColors.light;

  const handleClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className="flex items-center">
      {[...Array(count)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <Star
            key={index}
            size={size}
            filled={ratingValue <= (hover || value)}
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => !readOnly && setHover(ratingValue)}
            onMouseLeave={() => !readOnly && setHover(null)}
            fillColor={colors.fill}
            strokeColor={colors.stroke}
            emptyFill={colors.emptyFill}
            emptyStroke={colors.emptyStroke}
          />
        );
      })}
    </div>
  );
};

export default StarRating;