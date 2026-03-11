import { useMemo, useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap as useLeafletMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Info, Battery, Signal, Droplets, MapPin, X, BarChart3, TrendingUp, Thermometer, Layers } from 'lucide-react'
import { useMap } from '@/contexts/MapContext'
import { useSensor } from '@/contexts/SensorContext'
import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

// Helper component to hook into Leaflet's map instance for programmatic flying
function MapController({ center, zoom }) {
  const map = useLeafletMap()
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 })
  }, [center, zoom, map])
  return null
}

// Generate a custom Leaflet divIcon that renders our glowing HTML marker
const createSensorIcon = (sensor, isSelected) => {
  const pulseColor = sensor.status === 'healthy' ? 'var(--color-healthy)' : sensor.status === 'warning' ? 'var(--color-warning)' : sensor.status === 'critical' ? 'var(--color-critical)' : 'var(--color-slate)'
  const dropColor = sensor.status === 'healthy' ? '#2ECC71' : sensor.status === 'warning' ? '#F39C12' : sensor.status === 'critical' ? '#E74C3C' : '#8892B0'
  
  const html = `
    <div class="relative group cursor-pointer transition-transform ${isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'}">
      <svg width="36" height="42" viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 0C8.06 0 0 8.06 0 18C0 23.3 3.65 31.06 18 42C32.35 31.06 36 23.3 36 18C36 8.06 27.94 0 18 0Z" 
              fill="${isSelected ? '#0A192F' : 'rgba(255,255,255,0.9)'}" />
        <path d="M18 2C9.16 2 2 9.16 2 18C2 22.84 5.38 30.13 18 40.23C30.62 30.13 34 22.84 34 18C34 9.16 26.84 2 18 2Z" 
              fill="${dropColor}" />
        <circle cx="18" cy="18" r="9" fill="${isSelected ? '#fff' : '#0A192F'}" />
      </svg>
      ${isSelected ? `<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full animate-ping" style="background: ${pulseColor}"></div>` : ''}
    </div>
  `
  
  return L.divIcon({
    html,
    className: 'bg-transparent border-none',
    iconSize: [36, 42],
    iconAnchor: [18, 42], // bottom center
    popupAnchor: [0, -45] // above marker
  })
}

export default function MapView() {
  const { viewport, setViewport, activeLayer, setActiveLayer, flyTo } = useMap()
  const { sensors, selectedSensor, selectSensor, clearSelection, getSensorHistory, getSensorStats } = useSensor()
  const [hoverInfo, setHoverInfo] = useState(null)
  
  // Custom mock data generated from context for the history chart preview
  const previewData = selectedSensor ? getSensorHistory(selectedSensor.id, 'moisture').slice(-24) : []
  const currentStats = selectedSensor ? getSensorStats(selectedSensor.id, 'moisture') : null

  // Leaflet map center derived from MapContext viewport
  const center = [viewport.latitude, viewport.longitude]

  return (
    <div className="relative w-full h-full">
      {/* Primary React Leaflet Map component */}
      <MapContainer
        center={center}
        zoom={viewport.zoom}
        style={{ width: '100%', height: '100%', zIndex: 0 }}
        zoomControl={true}
        className="font-sans"
      >
        <MapController center={center} zoom={viewport.zoom} />
        
        {/* Esri World Imagery (Free Satellite tiles replacing Mapbox) */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        />

        {/* Dynamic heatmap layer for NDVI/NDRE stress visualization (Using Circles) */}
        {activeLayer === 'ndvi' && sensors.map(sensor => {
          if (sensor.status === 'healthy') return null
          
          const stressColor = sensor.status === 'critical' ? '#E74C3C' : '#F39C12'
          const stressRadius = sensor.status === 'critical' ? 800 : 400 // meters

          return (
            <Circle
              key={`heat-${sensor.id}`}
              center={[sensor.location.latitude, sensor.location.longitude]}
              pathOptions={{
                color: stressColor,
                fillColor: stressColor,
                fillOpacity: 0.4,
                weight: 0
              }}
              radius={stressRadius}
            />
          )
        })}

        {/* Custom Leaflet Markers for Sensors */}
        {sensors.map((sensor) => {
          const isSelected = selectedSensor?.id === sensor.id
          
          return (
            <Marker
              key={sensor.id}
              position={[sensor.location.latitude, sensor.location.longitude]}
              icon={createSensorIcon(sensor, isSelected)}
              eventHandlers={{
                click: () => {
                  selectSensor(sensor.id)
                  flyTo(sensor.location.longitude, sensor.location.latitude, 14)
                },
                mouseover: () => setHoverInfo(sensor),
                mouseout: () => setHoverInfo(null)
              }}
            >
              <Popup
                className="custom-leaflet-popup"
                closeButton={false}
              >
                <div className="font-sans p-1 min-w-[140px]">
                  <div className="font-bold text-navy text-sm mb-1">{sensor.name}</div>
                  <p className="text-xs text-slate-brand mb-2">{sensor.farmName}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-semibold">
                    <span className="text-sky-brand flex items-center gap-1"><Droplets className="w-3 h-3" /> {sensor.readings.moisture}%</span>
                    <span className="text-critical flex items-center gap-1"><Thermometer className="w-3 h-3" /> {sensor.readings.temperature}°C</span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-brand font-medium">Click to inspect node</div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Floating Control Ribbon (Top Right) */}
      <GlassCard variant="heavy" className="absolute top-6 right-6 p-2 flex items-center gap-2 z-20">
        <button 
          onClick={() => setActiveLayer('sensors')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeLayer === 'sensors' ? 'bg-navy text-white shadow-md' : 'text-slate-brand hover:bg-slate-brand/10'}`}
        >
          <MapPin className="w-4 h-4" /> Hardware Overlay
        </button>
        <button 
          onClick={() => setActiveLayer('ndvi')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeLayer === 'ndvi' ? 'bg-healthy text-white shadow-md' : 'text-slate-brand hover:bg-slate-brand/10'}`}
        >
          <Layers className="w-4 h-4" /> NDVI Heatmap
        </button>
      </GlassCard>

      {/* Slide-out Inspector Drawer (Right) */}
      {selectedSensor && (
        <div className="absolute top-0 right-0 h-full w-96 glass- भारी bg-white/95 backdrop-blur-3xl shadow-[-10px_0_30px_rgba(10,25,47,0.1)] border-l border-glass-border-subtle z-30 flex flex-col animate-slide-in-right">
          
          {/* Drawer Header */}
          <div className="p-6 pb-4 border-b border-navy/5 flex items-start justify-between">
            <div>
               <div className="flex items-center gap-2 mb-2">
                 <Badge status={selectedSensor.status} showDot />
                 <span className="text-xs font-bold text-slate-brand uppercase tracking-wider">{selectedSensor.id}</span>
               </div>
               <h2 className="text-2xl font-bold text-navy leading-tight">{selectedSensor.name}</h2>
               <p className="text-sm font-medium text-slate-brand flex items-center mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1" /> {selectedSensor.farmName}
               </p>
            </div>
            <button 
              onClick={clearSelection}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-brand hover:bg-critical/10 hover:text-critical transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
            
            {/* System Status Grid */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <div className="text-xs font-bold text-slate-brand uppercase flex items-center gap-1.5 mb-2">
                    <Battery className="w-4 h-4 text-healthy" /> Battery Level
                 </div>
                 <div className="text-xl font-bold text-navy">{selectedSensor.battery}%</div>
                 <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                   <div className="bg-healthy h-1.5 rounded-full" style={{ width: `${selectedSensor.battery}%` }}></div>
                 </div>
               </div>
               
               <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <div className="text-xs font-bold text-slate-brand uppercase flex items-center gap-1.5 mb-2">
                    <Signal className="w-4 h-4 text-sky-brand" /> Signal Strength
                 </div>
                 <div className="text-xl font-bold text-navy">{Math.max(0, -113 + selectedSensor.signal)} dBm</div>
                 <div className="text-xs font-medium text-slate-brand mt-1">LoRaWAN SF9</div>
               </div>
            </div>

            {/* Current Readings */}
            <div>
               <h3 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
                 <Info className="w-4 h-4" /> Live Parameters
               </h3>
               <div className="grid grid-cols-2 gap-3">
                 {[
                   { label: 'Moisture', val: selectedSensor.readings.moisture, unit: '%', color: 'text-sky-brand' },
                   { label: 'Temperature', val: selectedSensor.readings.temperature, unit: '°C', color: 'text-critical' },
                   { label: 'Soil pH', val: selectedSensor.readings.ph, unit: 'pH', color: 'text-warning' },
                   { label: 'Cond. (EC)', val: selectedSensor.readings.ec, unit: 'dS/m', color: 'text-healthy' },
                 ].map((p, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-dashed border-slate-200 pb-2">
                      <span className="text-sm font-medium text-slate-brand">{p.label}</span>
                      <span className={`text-base font-bold ${p.color}`}>{p.val}<span className="text-xs font-medium text-slate-brand ml-0.5">{p.unit}</span></span>
                    </div>
                 ))}
               </div>
            </div>

            {/* Sparkline Preview */}
            <div className="bg-navy/5 p-4 rounded-2xl border border-navy/10 relative overflow-hidden">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-sm font-bold text-navy flex items-center gap-1.5">
                   <TrendingUp className="w-4 h-4 text-sky-brand" /> Moisture Trend 
                 </h3>
                 <span className="text-[10px] uppercase font-bold text-slate-brand bg-white px-2 py-0.5 rounded-full">Last 24h</span>
               </div>
               
               <div className="h-28 w-full -ml-3">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={previewData}>
                     <defs>
                       <linearGradient id="colorMoist" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#3498DB" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#3498DB" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <Tooltip 
                       content={({ active, payload }) => {
                         if (active && payload && payload.length) {
                           return (
                             <div className="bg-navy text-white text-xs px-2 py-1 rounded shadow-lg">
                               {payload[0].value}% at {format(new Date(payload[0].payload.timestamp), 'HH:mm')}
                             </div>
                           )
                         }
                         return null
                       }}
                       cursor={{ stroke: '#8892B0', strokeWidth: 1, strokeDasharray: '3 3' }}
                     />
                     <Area type="monotone" dataKey="value" stroke="#3498DB" strokeWidth={2} fillOpacity={1} fill="url(#colorMoist)" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>

               <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-navy/10">
                 <div>
                   <div className="text-[10px] font-bold text-slate-brand uppercase mb-0.5">24h Avg</div>
                   <div className="text-sm font-bold text-navy">{currentStats?.avg || 0}%</div>
                 </div>
                 <div>
                   <div className="text-[10px] font-bold text-slate-brand uppercase mb-0.5">Trend</div>
                   <div className="text-sm font-bold text-sky-brand capitalize">{currentStats?.trend || 'Stable'}</div>
                 </div>
               </div>
            </div>

            <Button className="w-full" variant="ghost" onClick={() => {
                // Future expansion: programmatic route jump to Analytics
                alert(`Navigating to deep analytics for ${selectedSensor.id}`)
            }}>
              <BarChart3 className="w-4 h-4 mr-2" /> View Full Analytics
            </Button>
            
          </div>
        </div>
      )}
    </div>
  )
}
