import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Burada hata tracking servisi entegre edilebilir (Sentry, LogRocket, vb.)
    // Example: Sentry.captureException(error);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bir Hata Oluştu
            </h1>
            
            <p className="text-gray-600 mb-6">
              Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <p className="text-sm font-mono text-red-800 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Sayfayı Yenile
              </Button>
              <Button onClick={this.handleReset}>
                Ana Sayfaya Dön
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
