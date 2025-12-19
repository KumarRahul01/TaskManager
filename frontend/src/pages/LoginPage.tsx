import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser } from '../api/auth.api';
import { useState } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      navigate('/dashboard');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="gap-2 flex items-center justify-center">
        <span className="p-2 rounded-lg bg-blue-500 text-white text-lg md:text-xl font-semibold">
          TM
        </span>
        <p className="text-black text-xl md:text-2xl font-semibold">
          TaskManager
        </p>
      </div>
      <p className="text-sm md:text-lg my-3">Collaborative Task Management</p>

      <form
        onSubmit={handleSubmit}
        className="form mt-3 w-10/12 md:w-1/3 bg-white p-4 border border-gray-200 rounded-lg shadow"
      >
        <div className="my-2">
          <label htmlFor="email" className="text-base font-medium">
            Email:
          </label>
          <div>
            <input
              type="text"
              id="email"
              className="w-full border bg-white border-gray-200 px-4 py-2 my-1 rounded-lg focus:border-blue-500 focus:ring-0 focus:ring-blue-600 outline-none"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="my-2">
          <label htmlFor="password" className="text-base  font-medium">
            Password:
          </label>
          <div>
            <input
              type="password"
              id="password"
              className="w-full my-2 border bg-white border-gray-200 px-4 py-2 rounded-lg focus:border-blue-600 focus:ring-0 focus:ring-blue-600
            outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button className="bg-blue-500 text-white font-medium w-full text-base py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all duration-300">
          Sign In
        </button>
        <p className="text-center mt-4">
          Don't have an account{' '}
          <span className="text-blue-500 font-medium hover:underline underline-offset-2 cursor-pointer">
            <Link to={'/register'}>Sign Up</Link>
          </span>{' '}
          here
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
