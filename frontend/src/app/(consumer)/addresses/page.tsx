'use client';

import React, { useState } from 'react';
import { useAddresses, useCreateAddress, useDeleteAddress } from '@/shared/api/hooks/useAddresses';
import { Container } from '@/components/layout/shared/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Plus, Trash2, Loader2, Home } from 'lucide-react';

export default function AddressesPage() {
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const deleteAddress = useDeleteAddress();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAddress.mutate({ ...formData, is_default: false }, {
      onSuccess: () => {
        setShowForm(false);
        setFormData({ label: '', street: '', city: '', state: '', pincode: '', landmark: '' });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="py-12 bg-muted/30 min-h-screen">
      <Container>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading font-bold">My Addresses</h1>
          <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
            {showForm ? 'Cancel' : <><Plus className="h-4 w-4 mr-2" /> Add Address</>}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {showForm && (
              <div className="bg-card border rounded-xl p-6 shadow-sm mb-6">
                <h3 className="font-bold text-lg mb-4">Add New Address</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Label (e.g., Home, Office)</label>
                      <Input required value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} placeholder="Home" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Pincode</label>
                      <Input required value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} placeholder="600001" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Street Address</label>
                    <Input required value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} placeholder="123 Main St" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">City</label>
                      <Input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Chennai" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">State</label>
                      <Input required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} placeholder="Tamil Nadu" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Landmark (Optional)</label>
                    <Input value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})} placeholder="Near Appolo Hospital" />
                  </div>
                  <Button type="submit" disabled={createAddress.isPending}>
                    {createAddress.isPending ? 'Saving...' : 'Save Address'}
                  </Button>
                </form>
              </div>
            )}

            {addresses && addresses.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div key={address.id} className="bg-card border rounded-xl p-6 shadow-sm flex flex-col relative">
                    {address.is_default && (
                      <span className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">Default</span>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <Home className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-bold">{address.label}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm flex-1">
                      {address.street}<br/>
                      {address.landmark && <>{address.landmark}<br/></>}
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => deleteAddress.mutate(address.id)}
                        disabled={deleteAddress.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !showForm && (
                <div className="text-center py-12 bg-card border rounded-xl border-dashed">
                  <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">No addresses found</h3>
                  <p className="text-muted-foreground mb-4">Add your first delivery address to continue.</p>
                  <Button onClick={() => setShowForm(true)}>Add Address</Button>
                </div>
              )
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
