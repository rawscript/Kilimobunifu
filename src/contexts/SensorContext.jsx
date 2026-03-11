import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { MOCK_SENSORS } from '@/data/mockData'
import toast from 'react-hot-toast'

const SensorContext = createContext(null)

// Helper to generate fake historical data
const generateMockHistory = (sensorId, param, days = 7) => {
  const data = []
  const now = new Date()
  // Generate a data point every 30 minutes
  const points = days * 24 * 2
  
  // Base values depending on param
  let baseValue = 50
  let variance = 5
  if (param === 'temperature') { baseValue = 25; variance = 5 }
  if (param === 'ph') { baseValue = 6.5; variance = 0.5 }
  if (param === 'ec') { baseValue = 1.2; variance = 0.4 }

  let currentVal = baseValue
  
  for (let i = points; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 30 * 60 * 1000)).toISOString()
    // Add some random walk noise
    currentVal = currentVal + (Math.random() - 0.5) * variance * 0.2
    
    // diurnal cycle for temperature/moisture
    if (param === 'temperature') {
      const hour = new Date(timestamp).getHours()
      const dayPhase = Math.sin((hour - 6) * Math.PI / 12) // Peak at 12-2pm
      currentVal = baseValue + (dayPhase * 8) + (Math.random() - 0.5) * 2
    }

    data.push({ timestamp, value: +(currentVal.toFixed(2)) })
  }
  return data
}

export function SensorProvider({ children }) {
  const [sensors, setSensors] = useState([])
  const [selectedSensor, setSelectedSensor] = useState(null)
  const [sensorHistory, setSensorHistory] = useState({})
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Fetch all sensors (Mock API call)
  const fetchSensors = useCallback(async () => {
    try {
      setLoading(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600))
      setSensors(MOCK_SENSORS)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to fetch sensors:', err)
      toast.error('Failed to load sensor data')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchSensors()
  }, [fetchSensors])

  const selectSensor = useCallback(async (sensorId) => {
    const sensor = sensors.find(s => s.id === sensorId) || null
    setSelectedSensor(sensor)

    // Generate mock history for the selected sensor if not already cached
    if (sensor && !sensorHistory[sensorId]) {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 300))
            const historyData = {
              moisture: generateMockHistory(sensorId, 'moisture'),
              temperature: generateMockHistory(sensorId, 'temperature'),
              ph: generateMockHistory(sensorId, 'ph'),
              ec: generateMockHistory(sensorId, 'ec')
            }
            
            setSensorHistory(prev => ({
                ...prev,
                [sensorId]: historyData
            }))
        } catch (err) {
            console.error(`Failed to fetch history for sensor ${sensorId}:`, err)
        }
    }
  }, [sensors, sensorHistory])

  const clearSelection = useCallback(() => setSelectedSensor(null), [])

  const getSensorHistory = useCallback((sensorId, param = 'moisture') => {
    return sensorHistory[sensorId]?.[param] || []
  }, [sensorHistory])

  // Returns aggregated stats for a sensor+param based on fetched history
  const getSensorStats = useCallback((sensorId, param = 'moisture') => {
    const data = sensorHistory[sensorId]?.[param] || []
    if (data.length === 0) return { min: 0, max: 0, avg: 0, trend: 'stable' }
    
    const values = data.map(d => typeof d === 'object' ? d.value : d)
    if (values.length === 0) return { min: 0, max: 0, avg: 0, trend: 'stable' }

    const min = Math.min(...values)
    const max = Math.max(...values)
    const avg = +(values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
    const last5 = values.slice(-5)
    
    let trend = 'stable'
    if (last5.length > 1) {
         trend = last5[last5.length - 1] > last5[0] ? 'rising' : last5[last5.length - 1] < last5[0] ? 'falling' : 'stable'
    }
   
    return { min, max, avg, trend }
  }, [sensorHistory])

  return (
    <SensorContext.Provider
      value={{
        sensors,
        selectedSensor,
        loading,
        lastUpdated,
        selectSensor,
        clearSelection,
        getSensorHistory,
        getSensorStats,
        refreshData: fetchSensors
      }}
    >
      {children}
    </SensorContext.Provider>
  )
}

export const useSensor = () => {
  const ctx = useContext(SensorContext)
  if (!ctx) throw new Error('useSensor must be used within SensorProvider')
  return ctx
}
