'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api-client';
import { useAuth } from '@/providers/AuthProvider';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setToken } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/v1/auth/login', data);
      
      // Basic role check on login
      const user = response.data.user;
      const isAdmin = user?.roles?.some((r: any) => r.name === 'super_admin' || r.name === 'admin');
      
      if (!isAdmin) {
        setError('Unauthorized: Admin access required');
        setLoading(false);
        return;
      }

      setToken(response.data.token);
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] p-4 font-sans text-white">
      <div className="max-w-md w-full bg-[#1A2234] rounded-xl border border-primary-500/20 shadow-2xl p-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-primary-500/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-accent-500/10 blur-2xl"></div>
        
        <div className="mb-8 text-center relative z-10">
          <div className="mx-auto w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Operations Portal</h1>
          <p className="text-muted-foreground text-sm">Secure login for Kadal2Kadaai staff</p>
        </div>

        {error && (
          <div className="bg-destructive/20 border border-destructive/50 text-red-200 text-sm p-3 rounded-md mb-6 relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-1.5">Admin Email</label>
            <Input 
              type="email" 
              {...register('email')} 
              placeholder="admin@kadal2kadaai.com" 
              className="bg-[#0B1120] border-gray-700 text-white focus:border-primary-500"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message as string}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-300">Password</label>
            </div>
            <div className="relative">
              <Input 
                type={showPassword ? 'text' : 'password'} 
                {...register('password')} 
                className="bg-[#0B1120] border-gray-700 text-white focus:border-primary-500 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message as string}</p>}
          </div>

          <Button type="submit" className="w-full mt-8 bg-primary-600 hover:bg-primary-700 text-white py-6" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Operations'}
          </Button>
        </form>
      </div>
    </div>
  );
}
