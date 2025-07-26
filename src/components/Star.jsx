import { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ totalStars = 5, value = 0, onChange, readOnly = false }) => {
  const [hovered, setHovered] = useState(null);

  const handleClick = (index) => {
    if (!readOnly && onChange) {
      onChange(index + 1);
    }
  };

  const handleMouseEnter = (index) => {
    if (!readOnly) setHovered(index);
  };

  const handleMouseLeave = () => {
    if (!readOnly) setHovered(null);
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: totalStars }, (_, index) => {
        const filled = hovered !== null ? index <= hovered : index < value;

        return (
          <button
            type="button"
            key={index}
            className="focus:outline-none"
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
