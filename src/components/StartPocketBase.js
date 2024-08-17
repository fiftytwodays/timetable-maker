import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

let isPocketBaseStarted = false;

const StartPocketBase = () => {
  useEffect(() => {
    // Check if running in a browser environment and PocketBase has not started yet
    if (typeof window !== 'undefined' && !isPocketBaseStarted) {
      isPocketBaseStarted = true;
      invoke('start_pocketbase')
        .then(() => {
          console.log('PocketBase started successfully');
        })
        .catch((error) => {
          console.error('Failed to start PocketBase:', error);
        });
    }
  }, []);

  return null;
};

export default StartPocketBase;
