/**
 * Log levels for Datazoom analytics
 */
export enum LogLevel {
  VERBOSE = 'verbose',
  OFF = 'off',
  DEBUG = 'debug',
  WARNING = 'warning',
  INFO = 'info'
}

/**
 * Configuration settings for Datazoom initialization
 */
export interface DzSettings {
  /**
   * Configuration ID for Datazoom
   */
  configId: string;
  
  /**
   * Log level for Datazoom analytics
   */
  logLevel: LogLevel;
  
  /**
   * Whether this is a production environment
   */
  isProduction: boolean;
}
