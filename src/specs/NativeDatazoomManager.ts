import {NativeModules} from 'react-native';

/**
 * Interface for Datazoom Analytics functionality
 * Separate from VideoManager to maintain clean architecture
 */
export interface DatazoomManagerType {
  /**
   * Initialize Datazoom analytics system
   */
  initDatazoom: () => Promise<void>;
  
  /**
   * Start Datazoom data collection
   */
  startDatazoom: () => Promise<void>;
  
  /**
   * Stop Datazoom data collection
   */
  stopDatazoom: () => Promise<void>;
  
  /**
   * Set custom Datazoom configuration
   * @param config - Configuration object for Datazoom
   */
  setDatazoomConfig: (config: Record<string, any>) => Promise<void>;
  
  /**
   * Get current Datazoom status
   * @returns Promise resolving to status object
   */
  getDatazoomStatus: () => Promise<{isActive: boolean; sessionId?: string}>;
}

export default NativeModules.DatazoomManager as DatazoomManagerType;
