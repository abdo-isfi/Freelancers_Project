import React from 'react';
import { AppInput } from './app-input';

export const LoginForm = ({ onSubmit, register, errors, loading, onRegisterClick }) => {
   const socialIcons = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"/></svg>,
      href: '#',
      gradient: 'bg-[var(--color-bg)]',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z"/></svg>,
      href: '#',
      bg: 'bg-[var(--color-bg)]',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396z"/></svg>,
      href: '#',
      bg: 'bg-[var(--color-bg)]',
    }
  ];

  return (
    <div className="form-container sign-in-container h-full z-10 w-full px-4 lg:px-16 flex flex-col justify-center">
      <form className='text-center py-10 md:py-20 grid gap-2 h-full' onSubmit={onSubmit}>
        <div className='grid gap-4 md:gap-6 mb-2'>
          <h1 className='text-3xl md:text-4xl font-extrabold text-[var(--color-heading)]' onClick={(e) => {e.preventDefault()}}>Sign in</h1>
          <div className="social-container">
            <div className="flex items-center justify-center">
              <ul className="flex gap-3 md:gap-4">
                {socialIcons.map((social, index) => {
                  return (
                    <li key={index} className="list-none">
                      <a
                        href={social.href}
                        className={`w-[2.5rem] md:w-[3rem] h-[2.5rem] md:h-[3rem] bg-[var(--color-bg-2)] rounded-full flex justify-center items-center relative z-[1] border-3 border-[var(--color-text-primary)] overflow-hidden group`}
                      >
                        <div
                          className={`absolute inset-0 w-full h-full ${
                            social.gradient || social.bg
                          } scale-y-0 origin-bottom transition-transform duration-500 ease-in-out group-hover:scale-y-100`}
                        />
                        <span className="text-[1.5rem] text-[hsl(203,92%,8%)] transition-all duration-500 ease-in-out z-[2] group-hover:text-[var(--color-text-primary)] group-hover:rotate-y-360">
                          {social.icon}
                        </span>
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        </div>
        <span className='text-sm text-[var(--color-text-secondary)]'>or use your account</span>
      
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
        <button 
            type="button"
            onClick={onRegisterClick}
            className="group/button relative inline-flex justify-center items-center overflow-hidden rounded-md bg-transparent border border-[var(--color-border)] px-4 py-1.5 text-xs font-normal text-[var(--color-text-primary)] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[var(--color-border)] hover:text-white hover:shadow-lg cursor-pointer"
          >
          <span className="text-sm px-2 py-1">Register</span>
        </button>
        </div>
      </form>
    </div>
  )
}
