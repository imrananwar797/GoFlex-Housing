import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-obsidian flex items-center justify-center p-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morphism p-12 rounded-[40px] max-w-lg border-red-500/20"
          >
            <div className="w-20 h-20 bg-red-500/10 rounded-[30px] flex items-center justify-center mx-auto mb-8 border border-red-500/20">
              <AlertTriangle className="text-red-500" size={40} />
            </div>
            <h1 className="text-3xl font-black text-white mb-4 tracking-tighter">Something went wrong</h1>
            <p className="text-slate-400 mb-10 leading-relaxed">
              We've encountered an unexpected error. Our team has been notified.
              <br />
              <span className="text-xs text-red-500/50 mt-2 block font-mono">
                {this.state.error?.message}
              </span>
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-10 py-5 bg-white text-obsidian font-black rounded-2xl flex items-center gap-3 mx-auto uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95"
            >
              <RotateCcw size={18} /> Reload Application
            </button>
          </motion.div>
        </div>
      );
    }

    return this.children;
  }
}

export default ErrorBoundary;
