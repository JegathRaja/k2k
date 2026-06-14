'use client';

import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Shield, User, Mail, Phone, MapPin, Calendar, Clock, Activity, Settings, Key } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminProfilePage() {
  const { user, isLoading, isInitialized } = useAuth();

  if (!isInitialized || isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  const getInitials = (first?: string, last?: string) => {
    if (first && last) return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    if (first) return first.charAt(0).toUpperCase();
    return 'A';
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPpp');
    } catch {
      return dateString;
    }
  };

  const roles = user?.roles || [];
  const mainRole = roles[0]?.name?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Staff';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">View and manage your operations account details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-full -mr-10 -mt-10"></div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="h-24 w-24 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-600 font-heading font-bold text-3xl mb-4 border-4 border-background shadow-md">
                {getInitials(user?.first_name, user?.last_name)}
              </div>
              <h2 className="text-xl font-bold text-foreground">{user?.first_name} {user?.last_name}</h2>
              <p className="text-muted-foreground mb-4">{user?.email}</p>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium dark:bg-primary-900/30 dark:text-primary-300">
                <Shield className="h-4 w-4" />
                {mainRole}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Status</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="font-medium text-foreground capitalize">{user?.status || 'Active'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Joined</p>
                  <p className="font-medium text-foreground truncate">{formatDate(user?.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              Account Settings
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors flex items-center justify-between group">
                <span className="flex items-center gap-2"><Key className="h-4 w-4 text-muted-foreground" /> Change Password</span>
                <span className="text-muted-foreground group-hover:text-foreground">→</span>
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors flex items-center justify-between group">
                <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> Notification Preferences</span>
                <span className="text-muted-foreground group-hover:text-foreground">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2 border-b border-border pb-4">
              <User className="h-5 w-5 text-primary-500" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">First Name</p>
                <p className="font-medium text-foreground bg-muted/50 p-2.5 rounded-md border border-border/50">{user?.first_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Name</p>
                <p className="font-medium text-foreground bg-muted/50 p-2.5 rounded-md border border-border/50">{user?.last_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                <p className="font-medium text-foreground bg-muted/50 p-2.5 rounded-md border border-border/50">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Contact Number</p>
                <p className="font-medium text-foreground bg-muted/50 p-2.5 rounded-md border border-border/50">{user?.contact_number || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2 border-b border-border pb-4">
              <Shield className="h-5 w-5 text-accent-500" />
              Security & Access
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Assigned Roles</p>
                <div className="flex flex-wrap gap-2">
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <span key={role.id} className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wider dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                        {role.name.replace('_', ' ')}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No roles assigned</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-3">Session Information</p>
                <div className="bg-muted/30 rounded-lg border border-border p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-medium">Last Login</p>
                    <p className="text-xs text-muted-foreground">{formatDate(user?.last_login_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
