/**
 * Debug Utilities
 * 
 * This file contains utilities for debugging the application.
 */

// Enable or disable debug mode
const DEBUG_MODE = false;

/**
 * Logs a debug message to the console
 */
export const debugLog = (message: string, data?: any): void => {
  if (!DEBUG_MODE) return;
  
  console.log(`[DEBUG] ${message}`, data || '');
};

/**
 * Logs an error message to the console
 */
export const debugError = (message: string, error: any): void => {
  if (!DEBUG_MODE) return;
  
  console.error(`[ERROR] ${message}`, error);
  
  // If the error has a response property (like an Axios error), log it
  if (error && error.response) {
    console.error('[ERROR RESPONSE]', error.response);
  }
};

/**
 * Creates a debug overlay on the page
 */
export const createDebugOverlay = (): void => {
  if (!DEBUG_MODE) return;
  
  // Check if the overlay already exists
  if (document.getElementById('debug-overlay')) return;
  
  // Create the overlay
  const overlay = document.createElement('div');
  overlay.id = 'debug-overlay';
  overlay.style.position = 'fixed';
  overlay.style.bottom = '10px';
  overlay.style.right = '10px';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  overlay.style.color = 'white';
  overlay.style.padding = '10px';
  overlay.style.borderRadius = '5px';
  overlay.style.fontFamily = 'monospace';
  overlay.style.fontSize = '12px';
  overlay.style.maxWidth = '400px';
  overlay.style.maxHeight = '200px';
  overlay.style.overflow = 'auto';
  overlay.style.zIndex = '9999';
  
  // Add a title
  const title = document.createElement('div');
  title.textContent = 'Debug Info';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '5px';
  overlay.appendChild(title);
  
  // Add a log container
  const logContainer = document.createElement('div');
  logContainer.id = 'debug-log';
  overlay.appendChild(logContainer);
  
  // Add to the document
  document.body.appendChild(overlay);
};

/**
 * Adds a message to the debug overlay
 */
export const addToDebugOverlay = (message: string): void => {
  if (!DEBUG_MODE) return;
  
  // Create the overlay if it doesn't exist
  createDebugOverlay();
  
  // Get the log container
  const logContainer = document.getElementById('debug-log');
  if (!logContainer) return;
  
  // Add the message
  const messageElement = document.createElement('div');
  messageElement.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
  messageElement.style.marginBottom = '3px';
  logContainer.appendChild(messageElement);
  
  // Scroll to the bottom
  logContainer.scrollTop = logContainer.scrollHeight;
};
