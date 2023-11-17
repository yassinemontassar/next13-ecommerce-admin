import React from 'react';

const Skeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-bounce rounded-full border-8 border-purple-600 border-opacity-40 h-40 w-40 flex items-center justify-center mb-4">
        <span className="text-xl font-bold text-purple-600">RoundaStore</span>
      </div>
      <p className="text-xl font-bold text-purple-600">Loading...</p>
    </div>
  );
};

export default Skeleton;
