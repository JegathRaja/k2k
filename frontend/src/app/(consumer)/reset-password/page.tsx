'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api-client';

const schema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
});

import { Suspense } from 'react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: '', password_confirmation: '' },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/v1/auth/reset-password', {
        token: searchParams.get('token'),
        email: searchParams.get('email'),
        ...data,
      });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-card rounded-xl border shadow-lg p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Set New Password</h1>
        <p className="text-muted-foreground">Enter your new password below</p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {success ? (
        <div className="text-center">
          <div className="bg-green-100 text-green-800 text-sm p-4 rounded-md mb-6">
            Password reset successfully! Redirecting to login...
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">New Password</label>
            <Input type="password" {...register('password')} />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message as string}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input type="password" {...register('password_confirmation')} />
            {errors.password_confirmation && <p className="text-xs text-destructive mt-1">{errors.password_confirmation.message as string}</p>}
          </div>

          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>

          <div className="text-center mt-4">
            <Link href="/login" className="text-sm text-primary hover:underline">Back to Login</Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
