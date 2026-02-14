'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class DashboardErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-12 min-h-[400px] bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Something went wrong</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              We encountered an error while loading this section of your dashboard.
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-black/50 rounded-lg text-left overflow-auto max-w-full">
              <p className="text-[10px] font-mono text-red-400">{this.state.error?.message}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default DashboardErrorBoundary;
