import { ArweaveError } from '../types/ArweaveTypes';

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  error?: Error | ArweaveError;
  context?: Record<string, any>;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface ErrorLoggerConfig {
  maxLogs: number;
  enableConsoleLogging: boolean;
  enableRemoteLogging: boolean;
  remoteEndpoint?: string;
  apiKey?: string; // SAFE: Optional API key for remote logging service
  enableLocalStorage: boolean;
  logLevels: Array<'error' | 'warn' | 'info' | 'debug'>;
}

/**
 * Comprehensive error logging and debugging system
 */
export class ErrorLogger {
  private logs: ErrorLogEntry[] = [];
  private sessionId: string;
  private config: ErrorLoggerConfig;

  constructor(config: Partial<ErrorLoggerConfig> = {}) {
    this.config = {
      maxLogs: 1000,
      enableConsoleLogging: true,
      enableRemoteLogging: false,
      enableLocalStorage: true,
      logLevels: ['error', 'warn', 'info'],
      ...config
    };

    this.sessionId = this.generateSessionId();
    this.loadLogsFromStorage();
    this.setupGlobalErrorHandlers();
  }

  /**
   * Log an error with full context
   */
  error(message: string, error?: Error | ArweaveError, context?: Record<string, any>) {
    this.log('error', message, error, context);
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, undefined, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, any>) {
    this.log('info', message, undefined, context);
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, undefined, context);
  }

  /**
   * Log Arweave-specific errors with enhanced context
   */
  logArweaveError(
    error: ArweaveError,
    component: string,
    action: string,
    additionalContext?: Record<string, any>
  ) {
    const context = {
      component,
      action,
      errorType: error.type,
      recoverable: error.recoverable,
      suggestedAction: error.suggestedAction,
      ...additionalContext
    };

    this.log('error', error.message, error, context);
  }

  /**
   * Log upload progress and performance metrics
   */
  logUploadMetrics(metrics: {
    fileSize: number;
    uploadTime: number;
    transferRate: number;
    retryCount: number;
    finalStatus: string;
    transactionId?: string;
  }) {
    this.info('Upload completed', {
      category: 'performance',
      metrics
    });
  }

  /**
   * Log user actions for debugging
   */
  logUserAction(action: string, component: string, details?: Record<string, any>) {
    this.info(`User action: ${action}`, {
      category: 'user_action',
      component,
      ...details
    });
  }

  /**
   * Core logging method
   */
  private log(
    level: 'error' | 'warn' | 'info' | 'debug',
    message: string,
    error?: Error | ArweaveError,
    context?: Record<string, any>
  ) {
    if (!this.config.logLevels.includes(level)) {
      return;
    }

    const logEntry: ErrorLogEntry = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      level,
      message,
      error: error ? this.serializeError(error) : undefined,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.sessionId,
      component: context?.component,
      action: context?.action,
      metadata: {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        memory: this.getMemoryInfo(),
        connection: this.getConnectionInfo()
      }
    };

    // Add to logs array
    this.logs.push(logEntry);

    // Maintain max logs limit
    if (this.logs.length > this.config.maxLogs) {
      this.logs = this.logs.slice(-this.config.maxLogs);
    }

    // Console logging
    if (this.config.enableConsoleLogging) {
      this.logToConsole(logEntry);
    }

    // Local storage
    if (this.config.enableLocalStorage) {
      this.saveLogsToStorage();
    }

    // Remote logging
    if (this.config.enableRemoteLogging) {
      this.sendToRemote(logEntry);
    }
  }

  /**
   * Serialize error objects for logging
   */
  private serializeError(error: Error | ArweaveError): any {
    const serialized: any = {
      name: error.name,
      message: error.message,
      stack: error.stack
    };

    // Add ArweaveError specific properties
    if ('type' in error) {
      serialized.type = error.type;
      serialized.recoverable = error.recoverable;
      serialized.suggestedAction = error.suggestedAction;
      serialized.details = error.details;
    }

    return serialized;
  }

  /**
   * Log to browser console with formatting
   */
  private logToConsole(entry: ErrorLogEntry) {
    const style = this.getConsoleStyle(entry.level);
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    
    if (entry.level === 'error' && entry.error) {
      console.group(`%c${prefix} ${entry.message}`, style);
      console.error('Error:', entry.error);
      if (entry.context) {
        console.log('Context:', entry.context);
      }
      console.groupEnd();
    } else {
      console.log(`%c${prefix} ${entry.message}`, style, entry.context || '');
    }
  }

  /**
   * Get console styling for different log levels
   */
  private getConsoleStyle(level: string): string {
    const styles = {
      error: 'color: #dc2626; font-weight: bold;',
      warn: 'color: #d97706; font-weight: bold;',
      info: 'color: #2563eb;',
      debug: 'color: #6b7280;'
    };
    return styles[level as keyof typeof styles] || '';
  }

  /**
   * Send logs to remote endpoint
   */
  private async sendToRemote(entry: ErrorLogEntry) {
    if (!this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.warn('Failed to send log to remote endpoint:', error);
    }
  }

  /**
   * Save logs to localStorage
   */
  private saveLogsToStorage() {
    try {
      const recentLogs = this.logs.slice(-100); // Keep only recent 100 logs
      localStorage.setItem('arweave_uploader_logs', JSON.stringify(recentLogs));
    } catch (error) {
      console.warn('Failed to save logs to localStorage:', error);
    }
  }

  /**
   * Load logs from localStorage
   */
  private loadLogsFromStorage() {
    try {
      const stored = localStorage.getItem('arweave_uploader_logs');
      if (stored) {
        const logs = JSON.parse(stored);
        this.logs = Array.isArray(logs) ? logs : [];
      }
    } catch (error) {
      console.warn('Failed to load logs from localStorage:', error);
    }
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalErrorHandlers() {
    // Unhandled errors
    window.addEventListener('error', (event) => {
      this.error('Unhandled error', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled promise rejection', event.reason, {
        promise: event.promise
      });
    });
  }

  /**
   * Get memory information if available
   */
  private getMemoryInfo(): any {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  /**
   * Get connection information if available
   */
  private getConnectionInfo(): any {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique log ID
   */
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all logs
   */
  getLogs(level?: 'error' | 'warn' | 'info' | 'debug'): ErrorLogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  /**
   * Get logs for specific component
   */
  getLogsForComponent(component: string): ErrorLogEntry[] {
    return this.logs.filter(log => log.component === component);
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    totalErrors: number;
    errorsByType: Record<string, number>;
    errorsByComponent: Record<string, number>;
    recentErrors: ErrorLogEntry[];
  } {
    const errors = this.logs.filter(log => log.level === 'error');
    const errorsByType: Record<string, number> = {};
    const errorsByComponent: Record<string, number> = {};

    errors.forEach(error => {
      // Count by error type
      const errorType = error.error?.type || 'unknown';
      errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;

      // Count by component
      const component = error.component || 'unknown';
      errorsByComponent[component] = (errorsByComponent[component] || 0) + 1;
    });

    return {
      totalErrors: errors.length,
      errorsByType,
      errorsByComponent,
      recentErrors: errors.slice(-10) // Last 10 errors
    };
  }

  /**
   * Export logs for debugging
   */
  exportLogs(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      exportTime: new Date().toISOString(),
      logs: this.logs,
      stats: this.getErrorStats()
    }, null, 2);
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
    if (this.config.enableLocalStorage) {
      localStorage.removeItem('arweave_uploader_logs');
    }
  }
}

// Global logger instance
export const logger = new ErrorLogger({
  enableConsoleLogging: process.env.NODE_ENV === 'development',
  enableRemoteLogging: process.env.NODE_ENV === 'production',
  logLevels: process.env.NODE_ENV === 'development' 
    ? ['error', 'warn', 'info', 'debug'] 
    : ['error', 'warn']
});

// Convenience functions
export const logError = (message: string, error?: Error | ArweaveError, context?: Record<string, any>) => {
  logger.error(message, error, context);
};

export const logArweaveError = (
  error: ArweaveError,
  component: string,
  action: string,
  context?: Record<string, any>
) => {
  logger.logArweaveError(error, component, action, context);
};

export const logUserAction = (action: string, component: string, details?: Record<string, any>) => {
  logger.logUserAction(action, component, details);
};