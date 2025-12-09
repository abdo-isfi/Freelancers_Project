import React from 'react';
import { AppInput } from './app-input';

export const LoginForm = ({ onSubmit, register, errors, loading }) => {

  return (
    <div className="form-container sign-in-container h-full z-10 w-full px-4 lg:px-16 flex flex-col justify-center">
      <form className='text-center py-10 md:py-20 grid gap-2 h-full' onSubmit={onSubmit}>
        <div className='grid gap-4 md:gap-6 mb-2'>
          <h1 className='text-3xl md:text-4xl font-extrabold text-[var(--color-heading)]' onClick={(e) => {e.preventDefault()}}>Sign in</h1>
        </div>
      
      <div className='grid gap-4 items-center'>
          <div className="w-full">
            <AppInput 
              placeholder="Email" 
              type="email" 
              {...(register ? register('email') : {})}
            />
            {errors?.email && (
              <p className="text-red-500 text-xs text-left mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="w-full">
            <AppInput 
              placeholder="Password" 
              type="password" 
              {...(register ? register('password') : {})}
            />
            {errors?.password && (
              <p className="text-red-500 text-xs text-left mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>
        <a href="#" className='font-light text-sm md:text-md text-[var(--color-text-secondary)]'>Forgot your password?</a>
        <div className='flex gap-4 justify-center items-center'>
            <button 
            type="submit"
            disabled={loading}
            className="group/button relative inline-flex justify-center items-center overflow-hidden rounded-md bg-[var(--color-border)] px-4 py-1.5 text-xs font-normal text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[var(--color-text-primary)] cursor-pointer disabled:opacity-50"
          >
          <span className="text-sm px-2 py-1">{loading ? 'Signing in...' : 'Sign In'}</span>
          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
            <div className="relative h-full w-8 bg-white/20" />
          </div>
        </button>
        </div>
      </form>
    </div>
  )
}
