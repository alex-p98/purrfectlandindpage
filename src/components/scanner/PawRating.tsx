import React from 'react';

interface PawRatingProps {
  score: number;
  maxScore?: number;
}

export const PawRating = ({ score, maxScore = 5 }: PawRatingProps) => {
  return (
    <div className="flex gap-1">
      {[...Array(maxScore)].map((_, index) => (
        <div 
          key={index} 
          className={`w-20 h-20 transition-opacity duration-200 ${
            index < score ? 'opacity-100' : 'opacity-30'
          }`}
        >
          <img 
            src="/lovable-uploads/341008d0-d65a-4536-a5fa-6a7a643eded7.png" 
            alt={`Paw ${index + 1}`}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  );
};