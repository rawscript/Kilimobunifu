import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { LayoutGrid, Cpu, Activity, AlertTriangle, ArrowRight, TrendingUp, TrendingDown, Thermometer, Droplets } from 'lucide-react'
import { useSensor } from '@/contexts/SensorContext'
import { useAuth } from '@/contexts/AuthContext'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { format } from 'date-fns'

export default function OverviewView() {
  const { user } = useAuth()
  const { sensors, loading, getSensorHistory } = useSensor()

  // High-level aggregates
  const stats = useMemo(() => {
    if (!sensors.length) return { total: 0, online: 0, warning: 0, critical: 0, avgBattery: 0 }
    
    let total = sensors.length
    let online = 0
    let warning = 0
    let critical = 0
    let batterySum = 0

    sensors.forEach(s => {
      if (s.status === 'healthy') online++
      if (s.status === 'warning') warning++
      if (s.status === 'critical') critical++
      batterySum += s.battery
    })

    return {
      total,
      online,
      warning,
      critical,
      avgBattery: Math.round(batterySum / total)
    }
  }, [sensors])

  // Network-wide 24h trend data (mocked using the first sensor as a baseline)
  const networkTrendData = useMemo(() => {
    if (!sensors.length) return []
    
    // We use the first sensor's history as a baseline for the general network trend pattern
    const moistureHistory = getSensorHistory(sensors[0].id, 'moisture').slice(-24)
    const tempHistory = getSensorHistory(sensors[0].id, 'temperature').slice(-24)
    
    return moistureHistory.map((pt, i) => ({
      timestamp: pt.timestamp,
      moisture: pt.value,
      temperature: tempHistory[i]?.value || 25
    }))
  }, [sensors, getSensorHistory])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-slate-300 border-t-sky-brand animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col pt-6 px-4 md:px-8 pb-8 overflow-y-auto scrollbar-thin animate-fade-in relative max-w-7xl mx-auto w-full">
      {/* Background Graphic */}
      <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] bg-healthy/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="mb-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2 tracking-tight">Overview</h1>
          <p className="text-slate-brand text-sm">Welcome back, {user?.name}. Here's your network at a glance.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/map">
            <GlassCard className="px-4 py-2 flex items-center gap-2 hover:bg-slate-50 transition-colors text-sm font-bold text-navy shadow-sm cursor-pointer">
              Go to Map <ArrowRight className="w-4 h-4 text-sky-brand" />
            </GlassCard>
          </Link>
        </div>
      </header>

      {/* Content Layout */}
      <div className="space-y-6 relative z-10">
        
        {/* Top Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <GlassCard className="p-5 border-t-4 border-t-sky-brand">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-brand/10 flex items-center justify-center text-sky-brand">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-navy">{stats.total}</div>
            <div className="text-xs font-bold text-slate-brand uppercase tracking-wider mt-1">Total Nodes</div>
          </GlassCard>

          <GlassCard className="p-5 border-t-4 border-t-healthy">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-healthy/10 flex items-center justify-center text-healthy">
                <Activity className="w-5 h-5" />
              </div>
              <Badge status="healthy" showDot={false} />
            </div>
            <div className="text-3xl font-black text-navy">{stats.online}</div>
            <div className="text-xs font-bold text-slate-brand uppercase tracking-wider mt-1">Active/Healthy</div>
          </GlassCard>

          <GlassCard className="p-5 border-t-4 border-t-warning">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <Badge status="warning" showDot={false} />
            </div>
            <div className="text-3xl font-black text-navy">{stats.warning}</div>
            <div className="text-xs font-bold text-slate-brand uppercase tracking-wider mt-1">Warnings</div>
          </GlassCard>

          <GlassCard className="p-5 border-t-4 border-t-critical">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-critical/10 flex items-center justify-center text-critical">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <Badge status="critical" showDot={false} />
            </div>
            <div className="text-3xl font-black text-navy">{stats.critical}</div>
            <div className="text-xs font-bold text-slate-brand uppercase tracking-wider mt-1">Critical / Offline</div>
          </GlassCard>
        </div>

        {/* Middle Section: Urgent Sensor List & Regional Chart */}
        <div className="grid md:grid-cols-[1fr_400px] gap-6">
          
          {/* Urgent Nodes List */}
          <GlassCard className="p-6 flex flex-col h-[400px]">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              Requires Attention
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin">
              {sensors.filter(s => s.status === 'warning' || s.status === 'critical').map(sensor => (
                <div key={sensor.id} className="p-4 rounded-xl border border-slate-100 bg-white/50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Badge status={sensor.status} showDot />
                    <div>
                      <h4 className="font-bold text-navy text-sm leading-tight">{sensor.name}</h4>
                      <p className="text-xs text-slate-brand">{sensor.farmName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-brand text-right">
                    <div>
                      <span className="text-critical">{sensor.readings.moisture}%</span> <Droplets className="inline w-3 h-3 text-sky-brand ml-0.5" />
                    </div>
                    <div>
                      <span className="text-warning">{sensor.readings.temperature}°C</span> <Thermometer className="inline w-3 h-3 text-critical ml-0.5" />
                    </div>
                  </div>
                </div>
              ))}
              {stats.warning === 0 && stats.critical === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-brand">
                  <div className="w-12 h-12 rounded-full bg-healthy/10 flex items-center justify-center text-healthy mb-3">
                    <Activity className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-sm">All sensors are operating normally.</p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Network Average Trend */}
          <GlassCard className="p-6 flex flex-col h-[400px]">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-brand uppercase tracking-wider">24h Network Trend</h3>
                <div className="flex gap-4 text-[10px] font-bold uppercase text-slate-brand">
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-sky-brand"></div> Avg Moisture</span>
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-critical"></div> Avg Temp</span>
                </div>
             </div>
             
             <div className="flex-1 w-full -ml-4">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={networkTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3498DB" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#3498DB" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#E74C3C" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#E74C3C" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(136, 146, 176, 0.1)" />
                   <XAxis 
                     dataKey="timestamp" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fontSize: 10, fill: '#8892B0', fontWeight: 600 }}
                     tickFormatter={(val) => {
                       const d = new Date(val);
                       return !isNaN(d.getTime()) ? format(d, 'HH:mm') : '';
                     }}
                     minTickGap={30}
                   />
                   <YAxis 
                     yAxisId="left"
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fontSize: 10, fill: '#8892B0', fontWeight: 600 }}
                     domain={['dataMin - 5', 'dataMax + 5']}
                   />
                   <YAxis 
                     yAxisId="right"
                     orientation="right"
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fontSize: 10, fill: '#8892B0', fontWeight: 600 }}
                     domain={['dataMin - 2', 'dataMax + 2']}
                   />
                   <Tooltip 
                     cursor={{ stroke: '#8892B0', strokeWidth: 1, strokeDasharray: '3 3' }}
                     content={({ active, payload, label }) => {
                       if (active && payload && payload.length) {
                         return (
                           <div className="bg-navy text-white text-xs p-3 rounded-lg shadow-xl border border-white/10">
                             <div className="font-bold mb-2 pb-2 border-b border-white/10">{label && !isNaN(new Date(label).getTime()) ? format(new Date(label), 'MMM dd, HH:mm') : ''}</div>
                             <div className="flex items-center justify-between gap-4 mb-1">
                               <span className="text-slate-300">Avg Moisture</span>
                               <span className="text-sky-brand font-bold">{payload[0].value.toFixed(1)}%</span>
                             </div>
                             <div className="flex items-center justify-between gap-4">
                               <span className="text-slate-300">Avg Temp</span>
                               <span className="text-critical font-bold">{payload[1]?.value?.toFixed(1)}°C</span>
                             </div>
                           </div>
                         )
                       }
                       return null
                     }}
                   />
                   <Area yAxisId="left" type="monotone" dataKey="moisture" stroke="#3498DB" strokeWidth={3} fillOpacity={1} fill="url(#colorMoisture)" activeDot={{ r: 6, fill: '#3498DB', stroke: '#fff', strokeWidth: 2 }} />
                   <Area yAxisId="right" type="monotone" dataKey="temperature" stroke="#E74C3C" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" activeDot={{ r: 6, fill: '#E74C3C', stroke: '#fff', strokeWidth: 2 }} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </GlassCard>

        </div>
      </div>
    </div>
  )
}
