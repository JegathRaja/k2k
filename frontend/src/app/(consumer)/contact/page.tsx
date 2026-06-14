'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <h1 className="text-4xl font-heading font-bold mb-4 text-center">Contact Us</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Have a question about your order, our fishermen, or our platform? We're here to help.
      </p>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Contact Info */}
        <div className="bg-slate-50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg">Customer Support</h3>
              <p className="text-muted-foreground">Mon-Sat: 8:00 AM - 8:00 PM</p>
              <p className="text-primary font-medium mt-1">+91 98765 43210</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">Email Us</h3>
              <p className="text-primary font-medium">support@kadal2kadaai.com</p>
              <p className="text-primary font-medium">sellers@kadal2kadaai.com</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">Headquarters</h3>
              <p className="text-muted-foreground">
                123 Coastal Road, Marina Beach Area<br />
                Chennai, Tamil Nadu 600001<br />
                India
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card border p-8 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
          
          {status === 'success' ? (
            <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center border border-green-200">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-lg font-bold mb-2">Message Sent!</h3>
              <p>Thank you for reaching out. Our support team will get back to you within 24 hours.</p>
              <Button className="mt-4" variant="outline" onClick={() => setStatus('idle')}>Send Another Message</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                  <Input id="firstName" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                  <Input id="lastName" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input id="email" type="email" required />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input id="subject" required />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea 
                  id="message" 
                  className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                  required 
                ></textarea>
              </div>
              
              <Button type="submit" className="w-full" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
