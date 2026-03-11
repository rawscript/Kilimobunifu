import { createContext, useContext, useState, useCallback } from 'react'

const MapContext = createContext(null)

export function MapProvider({ children }) {
  const [viewport, setViewport] = useState({
    longitude: 34.75,
    latitude: 0.3,
    zoom: 8,
  })
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/satellite-streets-v12')
  const [activeLayer, setActiveLayer] = useState('sensors') // 'sensors' | 'ndvi' | 'ndre'
  const [hoveredSensorId, setHoveredSensorId] = useState(null)
  const [inspectorOpen, setInspectorOpen] = useState(false)

  const flyTo = useCallback((longitude, latitude, zoom = 14) => {
    setViewport({ longitude, latitude, zoom })
  }, [])

  const openInspector = useCallback(() => setInspectorOpen(true), [])
  const closeInspector = useCallback(() => setInspectorOpen(false), [])

  return (
    <MapContext.Provider
      value={{
        viewport,
        setViewport,
        mapStyle,
        setMapStyle,
        activeLayer,
        setActiveLayer,
        hoveredSensorId,
        setHoveredSensorId,
        inspectorOpen,
        openInspector,
        closeInspector,
        flyTo,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export const useMap = () => {
  const ctx = useContext(MapContext)
  if (!ctx) throw new Error('useMap must be used within MapProvider')
  return ctx
}
