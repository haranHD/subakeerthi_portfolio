import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface PageLoaderProps {
  title?: string;
  message?: string;
  error?: string | null;
  onRetry?: () => void;
  fullScreen?: boolean;
  minHeight?: string | number;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  title = 'Loading...',
  message = 'Connecting to secure administrative server...',
  error = null,
  onRetry,
  fullScreen = false,
  minHeight = '55vh',
}) => {
  const [takingLonger, setTakingLonger] = useState(false);

  useEffect(() => {
    if (error) {
      setTakingLonger(false);
      return;
    }
    const timer = setTimeout(() => {
      setTakingLonger(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, [error]);

  const containerStyle: React.CSSProperties = fullScreen
    ? {
        position: 'fixed',
        inset: 0,
        backgroundColor: '#14221D',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '2rem',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        width: '100%',
        padding: '2rem',
      };

  if (error) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            maxWidth: 460,
            width: '100%',
            backgroundColor: fullScreen ? '#1E332B' : '#FFFFFF',
            border: fullScreen ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2D9C5',
            borderRadius: 12,
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              color: '#B91C1C',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <AlertCircle size={28} />
          </div>

          <h3
            style={{
              fontFamily: 'Cinzel, Georgia, serif',
              fontSize: '1.15rem',
              color: fullScreen ? '#FFFFFF' : '#145A43',
              marginBottom: '0.5rem',
              fontWeight: 700,
            }}
          >
            Unable to Load Data
          </h3>

          <p
            style={{
              fontSize: '0.86rem',
              color: fullScreen ? 'rgba(255,255,255,0.8)' : '#56665F',
              marginBottom: '1.5rem',
              lineHeight: 1.5,
            }}
          >
            {error}
          </p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.5rem',
                fontSize: '0.88rem',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={16} /> Retry Request
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 420,
        }}
      >
        {/* Brand Emblem with breathing animation */}
        <div
          style={{
            position: 'relative',
            width: 72,
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
          }}
        >
          {/* Animated Spinner Ring */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `3px solid ${fullScreen ? 'rgba(47,143,111,0.2)' : 'rgba(20,90,67,0.15)'}`,
              borderTopColor: fullScreen ? '#2F8F6F' : '#145A43',
              animation: 'spin 1s linear infinite',
            }}
          />
          {/* Monogram Badge */}
          <div
            style={{
              width: 44,
              height: 44,
              backgroundColor: '#145A43',
              color: '#FFFFFF',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Cinzel, Georgia, serif',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '0.05em',
              boxShadow: '0 4px 12px rgba(20,90,67,0.3)',
            }}
          >
            SK
          </div>
        </div>

        <h3
          style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: '1.1rem',
            color: fullScreen ? '#FFFFFF' : '#145A43',
            marginBottom: '0.35rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: '0.84rem',
            color: fullScreen ? 'rgba(255,255,255,0.7)' : '#56665F',
            lineHeight: 1.45,
          }}
        >
          {message}
        </p>

        {takingLonger && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.6rem 1rem',
              backgroundColor: fullScreen ? 'rgba(47,143,111,0.15)' : '#EBF5F1',
              borderRadius: 6,
              border: `1px solid ${fullScreen ? 'rgba(47,143,111,0.3)' : '#C2E0D4'}`,
              fontSize: '0.78rem',
              color: fullScreen ? '#A5D6A7' : '#145A43',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Loader2 size={14} className="animate-spin" />
            <span>Server is waking up from idle mode, please hold on...</span>
          </div>
        )}
      </div>
    </div>
  );
};
