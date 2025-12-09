import React, { useState } from 'react';

export const HeroImage = ({ isLoginView, onToggle }) => {
  return (
    <div
      className='w-full h-full relative overflow-hidden'
    >
      <img
        src='https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop'
        alt="Freelance workspace" 
        className="w-full h-full object-cover transition-transform duration-300 opacity-30"
      />
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-30 bg-black/20">
        <h2 className="text-3xl font-bold text-white mb-4">
          {isLoginView ? "New Here?" : "One of us?"}
        </h2>
        <p className="text-white/90 mb-8 max-w-xs">
          {isLoginView 
            ? "Sign up and discover a great amount of new opportunities!" 
            : "If you already have an account, just sign in. We've missed you!"}
        </p>
        <button
          onClick={onToggle}
          className="px-8 py-2 rounded-full border-2 border-white text-white font-semibold transition-all duration-300 hover:bg-white hover:text-[var(--color-bg)] hover:scale-105"
        >
          {isLoginView ? "Sign Up" : "Sign In"}
        </button>
      </div>
    </div>
  );
};
