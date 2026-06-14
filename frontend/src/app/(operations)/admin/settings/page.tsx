'use client';

import React, { useEffect } from 'react';
import { useAdminSettings, useUpdateAdminSettings } from '@/shared/api/hooks/useSettings';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useAdminSettings();
  const updateSettingsMutation = useUpdateAdminSettings();

  const [formData, setFormData] = React.useState({
    footer_about: '',
    footer_address: '',
    footer_phone: '',
    footer_email: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        footer_about: settings.footer_about || '',
        footer_address: settings.footer_address || '',
        footer_phone: settings.footer_phone || '',
        footer_email: settings.footer_email || '',
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateSettingsMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Settings updated successfully');
      },
      onError: (err: any) => {
        toast.error(err.message || 'Failed to update settings');
      }
    });
  };

  if (isLoading) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight">Site Settings</h1>
        <p className="text-muted-foreground mt-1">Manage public information and site configuration.</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6 space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Footer Configuration</h2>
          
          <div className="grid gap-6 pt-2">
            <div className="space-y-2">
              <Label htmlFor="footer_about">Brand Description (About)</Label>
              <Textarea 
                id="footer_about" 
                name="footer_about"
                value={formData.footer_about}
                onChange={handleChange}
                placeholder="The premium South Indian marine commerce platform..."
                className="h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="footer_address">Address</Label>
              <Input 
                id="footer_address" 
                name="footer_address"
                value={formData.footer_address}
                onChange={handleChange}
                placeholder="123 Coastal Highway, Chennai Harbor..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="footer_phone">Phone Number</Label>
                <Input 
                  id="footer_phone" 
                  name="footer_phone"
                  value={formData.footer_phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer_email">Support Email</Label>
                <Input 
                  id="footer_email" 
                  name="footer_email"
                  type="email"
                  value={formData.footer_email}
                  onChange={handleChange}
                  placeholder="support@kadal2kadaai.com"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={handleSave} 
            disabled={updateSettingsMutation.isPending}
            size="lg"
          >
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
