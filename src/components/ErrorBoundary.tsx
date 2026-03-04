import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg border border-rose-100 p-8">
            <h1 className="text-2xl font-bold text-rose-600 mb-4">Algo deu errado</h1>
            <p className="text-slate-600 mb-6">A aplicação encontrou um erro inesperado e não pôde ser renderizada.</p>
            
            {this.state.error && (
              <div className="bg-slate-900 rounded-lg p-4 overflow-auto mb-6">
                <p className="text-rose-400 font-mono text-sm font-bold mb-2">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="text-slate-400 font-mono text-xs whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
