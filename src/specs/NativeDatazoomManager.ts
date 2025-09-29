import {NativeModules} from 'react-native';
import type {
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
import type {DzSettings} from '../types/datazoom-settings';

/**
 * Interface for Datazoom Analytics functionality
 * Separate from VideoManager to maintain clean architecture
 */
export interface DatazoomManagerType {
  /**
   * Initialize Datazoom analytics system with settings
   * @param settings - Configuration settings for Datazoom
   */
  initDatazoom: (settings: DzSettings) => Promise<void>;
  
  /**
   * Start Datazoom data collection for a specific video
   * @param reactTag - React tag for the video component
   */
  startDatazoom: (reactTag: Int32) => Promise<void>;
  
  /**
   * Stop Datazoom data collection for a specific video
   * @param reactTag - React tag for the video component
   */
  stopDatazoom: (reactTag: Int32) => Promise<void>;
}

export default NativeModules.DatazoomManager as DatazoomManagerType;
