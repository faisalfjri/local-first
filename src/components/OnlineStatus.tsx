'use client';
import { useStatusStore } from '@/stores/statusState';
import { CheckIcon, CloudAlertIcon, LoaderIcon } from 'lucide-react';
import { CloudOffIcon } from 'lucide-react';
import { useEffect } from 'react';

const OnlineStatus = () => {
  const { isOnline, setOnline, isSyncing, hasChanges } = useStatusStore();

  useEffect(() => {
    setOnline(navigator.onLine);

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Ensure the component doesn't render until `isOnline` has been set on the client side.
  if (isOnline === null) return null;
  // Determine the icon and message
  let icon = null;
  let message = '';
  let color = '';

  if (!isOnline) {
    icon = <CloudOffIcon className="animate-pulse text-red-700" />;
    message = 'Offline';
    color = 'bg-red-100 text-red-700';
  } else if (isSyncing) {
    icon = <LoaderIcon className="animate-spin text-blue-700" />;
    message = 'Syncing...';
    color = 'bg-blue-100 text-blue-700';
  } else if (hasChanges) {
    icon = <CloudAlertIcon className="text-yellow-700" />;
    message = 'Not synced yet';
    color = 'bg-yellow-100 text-yellow-700';
  } else {
    icon = <CheckIcon className="text-green-700" />;
    message = 'Up-to-date';
    color = 'bg-green-100 text-green-700';
  }

  return (
    <div className="flex gap-2">
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${color}`}
      >
        {icon}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default OnlineStatus;
