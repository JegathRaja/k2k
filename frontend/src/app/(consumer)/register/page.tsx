'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api-client';

const step1Schema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters').max(50),
  last_name: z.string().max(50).optional(),
  email: z.string().email('Invalid email address'),
  contact_number: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  pincode: z.string().optional(),
});

const step2Schema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const form1 = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: { first_name: '', last_name: '', email: '', contact_number: '', state: '', district: '', pincode: '' }
  });

  const form2 = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: { password: '', password_confirmation: '' }
  });

  const onStep1Submit = (data: any) => {
    setFormData(data);
    setError('');
    setStep(2);
  };

  const onStep2Submit = async (data: any) => {
    const finalData = { ...formData, ...data };
    setLoading(true);
    setError('');
    try {
      await api.post('/v1/auth/register', finalData);
      router.push('/login?registered=true');
    } catch (err: any) {
      console.error('Registration failed', err);
      let errMsg = 'Registration failed. Please check your inputs and try again.';
      if (err && typeof err === 'object') {
        if (err.message) {
          errMsg = err.message;
        } else if (err.response?.data?.message) {
          errMsg = err.response.data.message;
        }
        const validationErrors = err.errors || err.response?.data?.errors;
        if (validationErrors && typeof validationErrors === 'object') {
          const details = Object.values(validationErrors).flat().join(' ');
          if (details) {
            errMsg = `${errMsg} (${details})`;
          }
        }
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="max-w-md w-full bg-card rounded-xl border shadow-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">Join Kadal2Kadaai</h1>
          <p className="text-muted-foreground">Step {step} of 2</p>
          <div className="w-full bg-muted h-2 mt-4 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all" style={{ width: step === 1 ? '50%' : '100%' }} />
          </div>
        </div>
        
        {error && (
          <div className="bg-destructive/15 border border-destructive/30 text-destructive text-sm p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name *</label>
                <Input {...form1.register('first_name')} placeholder="John" />
                {form1.formState.errors.first_name && <p className="text-xs text-destructive mt-1">{form1.formState.errors.first_name.message as string}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Last Name (Optional)</label>
                <Input {...form1.register('last_name')} placeholder="Doe" />
                {form1.formState.errors.last_name && <p className="text-xs text-destructive mt-1">{form1.formState.errors.last_name.message as string}</p>}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Email Address *</label>
              <Input type="email" {...form1.register('email')} placeholder="john@example.com" />
              {form1.formState.errors.email && <p className="text-xs text-destructive mt-1">{form1.formState.errors.email.message as string}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Contact Number *</label>
              <Input {...form1.register('contact_number')} placeholder="9876543210" />
              {form1.formState.errors.contact_number && <p className="text-xs text-destructive mt-1">{form1.formState.errors.contact_number.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">State *</label>
                <Input {...form1.register('state')} placeholder="Tamil Nadu" />
                {form1.formState.errors.state && <p className="text-xs text-destructive mt-1">{form1.formState.errors.state.message as string}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">District *</label>
                <Input {...form1.register('district')} placeholder="Chennai" />
                {form1.formState.errors.district && <p className="text-xs text-destructive mt-1">{form1.formState.errors.district.message as string}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full mt-6">Next Step</Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Password *</label>
              <Input type="password" {...form2.register('password')} />
              {form2.formState.errors.password && <p className="text-xs text-destructive mt-1">{form2.formState.errors.password.message as string}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Confirm Password *</label>
              <Input type="password" {...form2.register('password_confirmation')} />
              {form2.formState.errors.password_confirmation && <p className="text-xs text-destructive mt-1">{form2.formState.errors.password_confirmation.message as string}</p>}
            </div>

            <div className="flex gap-4 mt-6">
              <Button type="button" variant="outline" className="w-1/3" onClick={() => setStep(1)} disabled={loading}>Back</Button>
              <Button type="submit" className="w-2/3" disabled={loading}>
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
