import { useState } from 'react'
import { User, Bell, Shield, Smartphone, Globe, Save } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function SettingsView() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)

  // Mock states for settings UI
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    weeklyReport: true,
    criticalOnly: false
  })

  // Dummy save handler
  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Settings saved successfully.')
    }, 800)
  }

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'system', label: 'System Config', icon: Globe },
  ]

  return (
    <div className="h-screen flex flex-col pt-6 px-8 pb-8 overflow-y-auto scrollbar-thin animate-fade-in relative max-w-7xl mx-auto w-full">
      {/* Background Graphic */}
      <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] bg-sky-brand/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="mb-8 relative z-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2 tracking-tight">System Settings</h1>
          <p className="text-slate-brand text-sm">Manage your profile, preferences, and network configurations.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="shadow-sm">
          {isSaving ? (
            <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/> Saving...</span>
          ) : (
            <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>
          )}
        </Button>
      </header>

      {/* Content Layout */}
      <div className="flex flex-col md:flex-row gap-8 relative z-10 flex-1">
        
        {/* Navigation Tabs Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <GlassCard className="p-3 flex flex-col gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left
                  ${activeTab === tab.id 
                    ? 'bg-navy text-white shadow-md' 
                    : 'text-slate-brand hover:bg-slate-50 hover:text-navy'}`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'opacity-100' : 'opacity-70'}`} />
                {tab.label}
              </button>
            ))}
          </GlassCard>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 max-w-3xl">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-navy border-b border-slate-100 pb-4 mb-6">Personal Information</h3>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden ring-4 ring-white shadow-md">
                    <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3498DB&color=fff&size=128`} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy">{user?.name}</h4>
                    <p className="text-sm text-slate-brand mb-3">{user?.role}</p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-xs h-8">Change Photo</Button>
                      <Button variant="ghost" size="sm" className="text-xs h-8 text-critical hover:text-critical hover:bg-critical/10">Remove</Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-brand uppercase tracking-wider">Full Name</label>
                    <input type="text" defaultValue={user?.name} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-sky-brand/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-brand uppercase tracking-wider">Email Address</label>
                    <input type="email" defaultValue={user?.email} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-sky-brand/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-brand uppercase tracking-wider">Phone Number</label>
                    <input type="tel" defaultValue="+254 712 345 678" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-sky-brand/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-brand uppercase tracking-wider">Primary Region</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-sky-brand/50">
                      <option>Lake Victoria Basin</option>
                      <option>Rift Valley</option>
                      <option>Central Highlands</option>
                    </select>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fade-in">
              <GlassCard className="p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-navy">Alert Preferences</h3>
                  <p className="text-sm text-slate-brand mt-1">Control how you receive network anomaly alerts.</p>
                </div>
                
                <div className="divide-y divide-slate-100">
                  <div className="p-6 flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-sky-brand/10 flex items-center justify-center text-sky-brand shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-navy text-sm">SMS Alerts</h4>
                        <p className="text-xs text-slate-brand mt-1 leading-relaxed max-w-md">Receive instant text messages when a sensor goes offline or registers critical soil moisture levels.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer pt-2">
                      <input type="checkbox" className="sr-only peer" checked={notifications.smsAlerts} onChange={() => setNotifications(p => ({...p, smsAlerts: !p.smsAlerts}))} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-healthy shrink-0 pt-2"></div>
                    </label>
                  </div>

                  <div className="p-6 flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-sky-brand/10 flex items-center justify-center text-sky-brand shrink-0">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-navy text-sm">Push Notifications</h4>
                        <p className="text-xs text-slate-brand mt-1 leading-relaxed max-w-md">In-app toasts and browser notifications while the dashboard is open.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer pt-2">
                      <input type="checkbox" className="sr-only peer" checked={true} readOnly />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-healthy shrink-0 pt-2"></div>
                    </label>
                  </div>
                  
                  <div className="p-6 flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-critical/10 flex items-center justify-center text-critical shrink-0">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-navy text-sm">Critical Events Only</h4>
                        <p className="text-xs text-slate-brand mt-1 leading-relaxed max-w-md">Suppress regular status warnings; only alert when nodes fall completely offline.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer pt-2">
                      <input type="checkbox" className="sr-only peer" checked={notifications.criticalOnly} onChange={() => setNotifications(p => ({...p, criticalOnly: !p.criticalOnly}))} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-healthy shrink-0 pt-2"></div>
                    </label>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* SECURITY TAB (MOCK) */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <GlassCard className="p-6">
                 <h3 className="text-lg font-bold text-navy border-b border-slate-100 pb-4 mb-6">Change Password</h3>
                 <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-brand uppercase tracking-wider">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sky-brand/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-brand uppercase tracking-wider">New Password</label>
                      <input type="password" placeholder="New Password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sky-brand/50" />
                    </div>
                    <Button className="mt-2 text-sm">Update Password</Button>
                 </div>
              </GlassCard>
            </div>
          )}

          {/* SYSTEM TAB (MOCK) */}
          {activeTab === 'system' && (
            <div className="space-y-6 animate-fade-in">
              <GlassCard className="p-6">
                 <h3 className="text-lg font-bold text-navy border-b border-slate-100 pb-4 mb-6">IoT Network Config</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-brand uppercase tracking-wider">Data Polling Interval</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-sky-brand/50">
                      <option>Real-time (WebSocket)</option>
                      <option selected>30 Seconds (REST)</option>
                      <option>5 Minutes</option>
                      <option>1 Hour (Battery Save)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-brand uppercase tracking-wider">Default Map Layer</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-sky-brand/50">
                      <option>Hardware Network</option>
                      <option>NDVI Heatmap</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-brand uppercase tracking-wider">Base Tile Provider</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-sky-brand/50">
                      <option>Esri World Imagery</option>
                      <option>OpenStreetMap</option>
                    </select>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}
          
        </div>
      </div>
    </div>
  )
}
