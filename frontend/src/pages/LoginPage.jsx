import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../store/authSlice';
import Login1 from '../components/ui/login-1';

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    dispatch(clearError());
    const result = await dispatch(login(data));
    
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 z-50 rounded-md bg-red-50 p-4 shadow-lg">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}
      <Login1 
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        loading={loading}
      />
    </>
  );
}

export default LoginPage;
