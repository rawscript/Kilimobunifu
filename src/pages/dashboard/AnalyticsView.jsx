import { useState, useMemo } from 'react'
import { Download, Filter, Droplets, Thermometer, FlaskConical, Activity, Cpu } from 'lucide-react'
import { useSensor } from '@/contexts/SensorContext'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PARAM_META } from '@/data/mockData'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend, LineChart, Line
} from 'recharts'

export default function AnalyticsView() {
  const { sensors, selectedSensor, selectSensor, getSensorHistory, getSensorStats } = useSensor()
  const [activeParam, setActiveParam] = useState('moisture')
  const [timeRange, setTimeRange] = useState('7d') // '24h', '7d', '30d'

  // If no sensor is selected globally, default to the first available for analytics
  const activeNode = selectedSensor || sensors[0]

  // Fetch raw history from context
  const rawData = useMemo(() => {
    if (!activeNode) return []
    return getSensorHistory(activeNode.id, activeParam)
  }, [activeNode, activeParam, getSensorHistory])

  // Filter data by selected time range
  const chartData = useMemo(() => {
    if (!rawData.length) return []
    const now = new Date()
    const msMap = { '24h': 86400000, '7d': 604800000, '30d': 2592000000 }
    const cutoff = new Date(now.getTime() - msMap[timeRange])
    return rawData.filter(d => new Date(d.timestamp) >= cutoff)
  }, [rawData, timeRange])

  const stats = useMemo(() => {
    if (!activeNode) return null
    return getSensorStats(activeNode.id, activeParam)
  }, [activeNode, activeParam, getSensorStats])

  const meta = PARAM_META[activeParam]

  const handleExport = () => {
    if (!chartData.length) return toast.error('No data to export')
    
    // Simple CSV generator
    const headers = ['Timestamp', meta.label, 'Unit']
    const rows = chartData.map(d => [d.timestamp, d.value, meta.unit].join(','))
    const csvContent = [headers.join(','), ...rows].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `kb_export_${activeNode.id}_${activeParam}_${timeRange}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Data exported successfully')
  }

  if (!sensors.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-4 border-slate-300 border-t-sky-brand animate-spin" />
          <p className="text-slate-brand font-medium">Loading network data…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col pt-6 px-8 pb-8 overflow-y-auto scrollbar-thin animate-fade-in relative">
      {/* Background Graphic */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-sky-brand/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header & Controls Ribbon */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 w-full max-w-7xl mx-auto relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2 tracking-tight">Time-Series Analytics</h1>
          <p className="text-slate-brand text-sm">Deep inspection of historical telemetric logs</p>
        </div>

        <GlassCard className="flex flex-wrap items-center gap-4 p-3 pr-4 rounded-2xl w-full lg:w-auto shadow-sm">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
             <Filter className="w-4 h-4 text-slate-brand" />
             <select 
               className="bg-transparent text-sm font-bold text-navy outline-none cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
               value={activeNode?.id || ''}
               onChange={(e) => selectSensor(e.target.value)}
             >
               {sensors.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
             </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
             {['24h', '7d', '30d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${timeRange === range ? 'bg-white text-navy shadow-sm' : 'text-slate-brand hover:text-navy'}`}
                >
                  {range}
                </button>
             ))}
          </div>
          
          <Button variant="ghost" size="sm" className="ml-auto lg:ml-2 h-9" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1.5" /> Export CSV
          </Button>
        </GlassCard>
      </header>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 w-full max-w-7xl mx-auto flex-1 z-10">
        
        {/* Chart Column */}
        <div className="flex flex-col gap-6">
          <GlassCard className="flex-1 p-6 flex flex-col min-h-[500px] shadow-sm border border-slate-200/60 bg-white/60">
             
             {/* Param Tabs */}
             <div className="flex border-b border-slate-200 mb-6 font-medium text-sm gap-8 px-2">
                {[
                  { id: 'moisture', label: 'Soil Moisture', icon: Droplets, color: 'text-sky-brand', border: 'border-sky-brand' },
                  { id: 'temperature', label: 'Temperature', icon: Thermometer, color: 'text-critical', border: 'border-critical' },
                  { id: 'ph', label: 'Soil pH', icon: FlaskConical, color: 'text-warning', border: 'border-warning' },
                  { id: 'ec', label: 'Conductivity', icon: Activity, color: 'text-healthy', border: 'border-healthy' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveParam(p.id)}
                    className={`pb-4 flex items-center gap-2 border-b-2 transition-all ${activeParam === p.id ? `${p.border} ${p.color} font-bold` : 'border-transparent text-slate-brand hover:text-navy hover:border-slate-300'}`}
                  >
                    <p.icon className="w-4 h-4" /> {p.label}
                  </button>
                ))}
             </div>

             {/* Chart Body */}
             <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={meta.color} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={meta.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(136, 146, 176, 0.2)" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(tick) => {
                        const d = new Date(tick);
                        return !isNaN(d.getTime()) ? format(d, timeRange === '24h' ? 'HH:mm' : 'MMM dd') : '';
                      }}
                      stroke="#8892B0" 
                      fontSize={11}
                      tickMargin={12}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      stroke="#8892B0" 
                      fontSize={11}
                      tickMargin={12}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `${val}${meta.unit === '%' ? '' : ''}`}
                    />
                    <RechartsTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <GlassCard variant="heavy" className="p-3 shadow-xl border-slate-200">
                              <p className="text-[10px] font-bold text-slate-brand mb-1 uppercase tracking-wider">
                                {label && !isNaN(new Date(label).getTime()) ? format(new Date(label), timeRange === '24h' ? 'MMM dd, HH:mm' : 'MMM dd, yyyy HH:mm') : ''}
                              </p>
                              <p className="text-xl font-black text-navy flex items-baseline gap-1">
                                {payload[0].value} <span className="text-xs font-bold text-slate-brand">{meta.unit}</span>
                              </p>
                            </GlassCard>
                          )
                        }
                        return null
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={meta.color} 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorMain)" 
                      activeDot={{ r: 6, strokeWidth: 0, fill: meta.color }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </GlassCard>
        </div>

        {/* Stats Sidebar */}
        <div className="flex flex-col gap-4">
          
          {/* Active Node Card */}
          <GlassCard className="p-6 bg-white border border-slate-200/60">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-sky-brand/10 w-12 h-12 rounded-xl flex items-center justify-center text-sky-brand">
                 <Cpu className="w-6 h-6" />
              </div>
              <Badge status={activeNode?.status} showDot />
            </div>
            <h3 className="text-lg font-bold text-navy truncate">{activeNode?.name}</h3>
            <p className="text-sm text-slate-brand truncate">{activeNode?.farmName}</p>
            
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-brand font-medium">Node ID</span>
                <span className="text-navy font-bold">{activeNode?.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-brand font-medium">Install Date</span>
                <span className="text-navy font-bold">{format(new Date(activeNode?.installDate || new Date()), 'MMM yyyy')}</span>
              </div>
            </div>
          </GlassCard>

          {/* Aggregated Highlights */}
          <GlassCard className="p-6 bg-white border border-slate-200/60 flex-1">
             <h3 className="text-sm font-bold text-navy mb-5 uppercase tracking-wider flex items-center gap-2">
               <Activity className="w-4 h-4 text-sky-brand" /> Period Summary
             </h3>
             
             <div className="space-y-6">
               <div>
                  <div className="text-xs text-slate-brand font-bold uppercase mb-1">Average</div>
                  <div className="text-3xl font-black text-navy flex items-baseline gap-1">
                    {stats?.avg || 0} <span className="text-sm font-bold text-slate-brand">{meta.unit}</span>
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                 <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-brand font-bold uppercase mb-1">Max High</div>
                    <div className="text-base font-bold text-navy">{stats?.max || 0}{meta.unit}</div>
                 </div>
                 <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-brand font-bold uppercase mb-1">Min Low</div>
                    <div className="text-base font-bold text-navy">{stats?.min || 0}{meta.unit}</div>
                 </div>
               </div>

               <div className="pt-4 border-t border-slate-100">
                 <div className="text-xs text-slate-brand font-bold uppercase mb-2">Primary Trend (Last 5 checks)</div>
                 <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${stats?.trend === 'rising' ? 'bg-critical' : stats?.trend === 'falling' ? 'bg-healthy' : 'bg-warning'}`} />
                    <span className="text-sm font-bold capitalize text-navy">{stats?.trend}</span>
                 </div>
               </div>
             </div>
          </GlassCard>
        </div>

      </div>
    </div>
  )
}
