import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
            <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong.</h1>
                <p className="text-gray-300 mb-6">
                    The application encountered an unexpected error. Please try refreshing the page.
                </p>
                
                <details className="bg-black/30 p-4 rounded-md overflow-auto max-h-96 whitespace-pre-wrap text-sm font-mono text-red-300">
                    <summary className="cursor-pointer text-gray-400 hover:text-white mb-2">Error Details</summary>
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                </details>

                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                    >
                        Refresh Page
                    </button>
                    <button 
                        onClick={() => window.location.href = '/dashboard'}
                        className="ml-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
