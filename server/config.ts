/**
 * Centralized configuration management for Expert Recruitments
 * This file imports the configuration from the /config directory
 */

// Import the main configuration
import config, { ENV } from '../config';

// Re-export the configuration and ENV constants
export { ENV };
export default config;