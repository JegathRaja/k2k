import React from 'react';
import { AlertTriangle, WifiOff, ServerCrash, ShieldAlert, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  type: '404' | '403' | '500' | 'offline' | 'api';
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorState({ type, title, description, action, className }: ErrorStateProps) {
  const config = {
    '404': { icon: FileQuestion, defaultTitle: 'Page Not Found', defaultDesc: 'The page or resource you are looking for does not exist or has been moved.' },
    '403': { icon: ShieldAlert, defaultTitle: 'Access Denied', defaultDesc: 'You do not have permission to view this page or perform this action.' },
    '500': { icon: ServerCrash, defaultTitle: 'Internal Server Error', defaultDesc: 'Our systems encountered an unexpected problem. Please try again later.' },
    'offline': { icon: WifiOff, defaultTitle: 'No Internet Connection', defaultDesc: 'You appear to be offline. Check your network and try again.' },
    'api': { icon: AlertTriangle, defaultTitle: 'Service Unavailable', defaultDesc: 'We could not fetch the required data. Please refresh the page.' },
  };

  const { icon: Icon, defaultTitle, defaultDesc } = config[type];

  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center rounded-xl bg-error-50/50 border border-error-100", className)}>
      <div className="h-16 w-16 rounded-full bg-error-100 flex items-center justify-center mb-6">
        <Icon className="h-8 w-8 text-error-600" />
      </div>
      <h3 className="font-heading text-h5 font-bold text-error-900 mb-2">{title || defaultTitle}</h3>
      <p className="text-bodyMedium text-error-700 max-w-md mx-auto mb-8">
        {description || defaultDesc}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
