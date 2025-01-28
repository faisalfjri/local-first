'use client';
import { syncTodos } from '@/lib/todoLocal';
import { useStatusStore } from '@/stores/statusState';
import {
  Check,
  CloudAlertIcon,
  CloudOff,
  CloudUploadIcon,
  Loader
} from 'lucide-react';
import { CloudOffIcon } from 'lucide-react';
import { useEffect } from 'react';

const OnlineStatus = () => {
  const { isOnline, setOnline, isSyncing, setSyncing, hasChanges, setChanges } =
    useStatusStore();

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

  const handleSyncTodos = async () => {
    try {
      setSyncing(true);
      await syncTodos();
    } catch (error) {
      console.log(error);
    } finally {
      setSyncing(false);
      setChanges(false);
    }
  };

  // Ensure the component doesn't render until `isOnline` has been set on the client side.
  if (isOnline === null) return null;
  // Determine the icon and message
  let icon = null;
  let message = '';
  let color = '';

  if (!isOnline) {
    icon = <CloudOff className="animate-pulse text-red-700" />;
    message = 'Offline';
    color = 'bg-red-100 text-red-700';
  } else if (isSyncing) {
    icon = <Loader className="animate-spin text-blue-700" />;
    message = 'Syncing...';
    color = 'bg-blue-100 text-blue-700';
  } else if (hasChanges) {
    icon = <CloudAlertIcon className="text-yellow-700" />;
    message = 'Not synced yet';
    color = 'bg-yellow-100 text-yellow-700';
  } else {
    icon = <Check className="text-green-700" />;
    message = 'Up-to-date';
    color = 'bg-green-100 text-green-700';
  }

  return (
    <>
      <div
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}
      >
        {isOnline ? 'Online' : 'Offline'}
      </div>
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${color}`}
      >
        {icon}
        <span>{message}</span>
      </div>
      {isOnline ? (
        <button
          onClick={handleSyncTodos}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <CloudUploadIcon className="w-4 h-4 me-2" />
          Sync
        </button>
      ) : (
        <button
          disabled
          className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          <CloudOffIcon className="w-4 h-4 me-2" />
          Sync
        </button>
      )}
    </>
  );
};

export default OnlineStatus;
