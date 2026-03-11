import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { SensorProvider } from '@/contexts/SensorContext'
import { MapProvider } from '@/contexts/MapContext'
import AppRouter from '@/routes/AppRouter'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SensorProvider>
          <MapProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'glass-card',
                style: {
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#0A192F',
                  fontFamily: 'Inter, sans-serif',
                },
              }}
            />
            <AppRouter />
          </MapProvider>
        </SensorProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

