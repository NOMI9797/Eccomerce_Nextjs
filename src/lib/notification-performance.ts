interface NotificationMetrics {
  totalNotifications: number;
  realtimeEvents: number;
  fallbackPolls: number;
  connectionErrors: number;
  lastConnectionTime: number;
  averageResponseTime: number;
  costSavings: {
    oldSystemCalls: number;
    newSystemCalls: number;
    percentageSaved: number;
  };
}

class NotificationPerformanceMonitor {
  private metrics: NotificationMetrics = {
    totalNotifications: 0,
    realtimeEvents: 0,
    fallbackPolls: 0,
    connectionErrors: 0,
    lastConnectionTime: Date.now(),
    averageResponseTime: 0,
    costSavings: {
      oldSystemCalls: 0,
      newSystemCalls: 0,
      percentageSaved: 0
    }
  };

  private startTime = Date.now();
  private responseTimes: number[] = [];

  // Track real-time event received
  trackRealtimeEvent(responseTime?: number) {
    this.metrics.realtimeEvents++;
    this.metrics.totalNotifications++;
    
    if (responseTime) {
      this.responseTimes.push(responseTime);
      this.updateAverageResponseTime();
    }

    this.updateCostSavings();
    this.logEvent('Real-time event received');
  }

  // Track fallback polling call
  trackFallbackPoll() {
    this.metrics.fallbackPolls++;
    this.updateCostSavings();
    this.logEvent('Fallback poll executed');
  }

  // Track connection error
  trackConnectionError() {
    this.metrics.connectionErrors++;
    this.logEvent('Connection error occurred');
  }

  // Track successful connection
  trackConnectionSuccess() {
    this.metrics.lastConnectionTime = Date.now();
    this.logEvent('Connection established');
  }

  // Update average response time
  private updateAverageResponseTime() {
    if (this.responseTimes.length > 0) {
      const sum = this.responseTimes.reduce((a, b) => a + b, 0);
      this.metrics.averageResponseTime = sum / this.responseTimes.length;
    }
  }

  // Calculate cost savings compared to old polling system
  private updateCostSavings() {
    const hoursElapsed = (Date.now() - this.startTime) / (1000 * 60 * 60);
    
    // Old system: 720 calls per hour (every 30 seconds)
    const oldSystemCalls = Math.floor(hoursElapsed * 720);
    
    // New system: real-time events + fallback polls
    const newSystemCalls = this.metrics.realtimeEvents + this.metrics.fallbackPolls;
    
    const percentageSaved = oldSystemCalls > 0 ? 
      Math.floor(((oldSystemCalls - newSystemCalls) / oldSystemCalls) * 100) : 0;

    this.metrics.costSavings = {
      oldSystemCalls,
      newSystemCalls,
      percentageSaved
    };
  }

  // Get current metrics
  getMetrics(): NotificationMetrics {
    this.updateCostSavings();
    return { ...this.metrics };
  }

  // Get performance summary
  getPerformanceSummary() {
    const metrics = this.getMetrics();
    const uptime = Date.now() - this.startTime;
    const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
    const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

    return {
      uptime: `${uptimeHours}h ${uptimeMinutes}m`,
      totalNotifications: metrics.totalNotifications,
      realtimeEvents: metrics.realtimeEvents,
      fallbackPolls: metrics.fallbackPolls,
      connectionErrors: metrics.connectionErrors,
      averageResponseTime: `${metrics.averageResponseTime.toFixed(2)}ms`,
      costSavings: `${metrics.costSavings.percentageSaved}%`,
      apiCallsAvoided: metrics.costSavings.oldSystemCalls - metrics.costSavings.newSystemCalls,
      reliability: `${((metrics.realtimeEvents / (metrics.realtimeEvents + metrics.fallbackPolls)) * 100).toFixed(1)}%`
    };
  }

  // Log performance event
  private logEvent(event: string) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[NotificationPerformance] ${event}`, this.getPerformanceSummary());
    }
  }

  // Reset metrics
  reset() {
    this.metrics = {
      totalNotifications: 0,
      realtimeEvents: 0,
      fallbackPolls: 0,
      connectionErrors: 0,
      lastConnectionTime: Date.now(),
      averageResponseTime: 0,
      costSavings: {
        oldSystemCalls: 0,
        newSystemCalls: 0,
        percentageSaved: 0
      }
    };
    this.startTime = Date.now();
    this.responseTimes = [];
  }

  // Check system health
  getSystemHealth() {
    const metrics = this.getMetrics();
    const timeSinceLastConnection = Date.now() - metrics.lastConnectionTime;
    const isHealthy = timeSinceLastConnection < 300000; // 5 minutes

    return {
      healthy: isHealthy,
      lastConnectionAge: timeSinceLastConnection,
      errorRate: metrics.connectionErrors / (metrics.realtimeEvents + metrics.fallbackPolls || 1),
      fallbackRate: metrics.fallbackPolls / (metrics.realtimeEvents + metrics.fallbackPolls || 1)
    };
  }
}

// Export singleton instance
export const notificationPerformanceMonitor = new NotificationPerformanceMonitor();

// Export hook for React components
export const useNotificationPerformance = () => {
  const getMetrics = () => notificationPerformanceMonitor.getMetrics();
  const getSummary = () => notificationPerformanceMonitor.getPerformanceSummary();
  const getHealth = () => notificationPerformanceMonitor.getSystemHealth();

  return {
    getMetrics,
    getSummary,
    getHealth,
    trackRealtimeEvent: (responseTime?: number) => notificationPerformanceMonitor.trackRealtimeEvent(responseTime),
    trackFallbackPoll: () => notificationPerformanceMonitor.trackFallbackPoll(),
    trackConnectionError: () => notificationPerformanceMonitor.trackConnectionError(),
    trackConnectionSuccess: () => notificationPerformanceMonitor.trackConnectionSuccess()
  };
}; 