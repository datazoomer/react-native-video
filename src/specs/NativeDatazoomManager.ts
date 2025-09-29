import {NativeModules} from 'react-native';
import type {
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';

/**
 * Interface for Datazoom Analytics functionality
 * Separate from VideoManager to maintain clean architecture
 */
export interface DatazoomManagerType {
  /**
   * Initialize Datazoom analytics system
   * @param reactTag - React tag for the video component
   */
  initDatazoom: (reactTag: Int32) => Promise<void>;
  
  /**
   * Start Datazoom data collection
   * @param reactTag - React tag for the video component
   */
  startDatazoom: (reactTag: Int32) => Promise<void>;
  
  /**
   * Stop Datazoom data collection
   * @param reactTag - React tag for the video component
   */
  stopDatazoom: (reactTag: Int32) => Promise<void>;
  
  /**
   * Set custom Datazoom configuration
   * @param reactTag - React tag for the video component
   * @param config - Configuration object for Datazoom
   */
  setDatazoomConfig: (reactTag: Int32, config: Record<string, any>) => Promise<void>;
  
  /**
   * Get current Datazoom status
   * @param reactTag - React tag for the video component
   * @returns Promise resolving to status object
   */
  getDatazoomStatus: (reactTag: Int32) => Promise<{isActive: boolean; sessionId?: string}>;
}

export default NativeModules.DatazoomManager as DatazoomManagerType;
