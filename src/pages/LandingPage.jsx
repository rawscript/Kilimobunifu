import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Shield, Cpu, Activity, LayoutDashboard, Map, Linkedin, Twitter } from 'lucide-react'
import { TEAM_MEMBERS } from '@/data/mockData'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth()

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed w-[calc(100%-2rem)] max-w-7xl mx-auto top-4 left-1/2 -translate-x-1/2 z-50 glass-heavy rounded-full px-6 py-3 flex items-center justify-between border-opacity-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center p-0.5 overflow-hidden ring-2 ring-sky-brand/20">
            <img src="/favicon.svg" alt="Kilimo Bunifu Logo" className="w-full h-full object-cover rounded-full drop-shadow-[0_0_8px_rgba(46,204,113,0.5)]" />
          </div>
          <span className="font-extrabold text-xl text-navy tracking-tight hidden sm:block">Kilimo Bunifu</span>
        </div>
        <div className="flex items-center gap-4">
          {!loading && isAuthenticated ? (
            <Link to="/dashboard/map">
              <Button variant="primary">
                Go to Dashboard <LayoutDashboard className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-brand hover:text-navy transition-colors">
                Sign In
              </Link>
              <Link to="/signup">
                <Button variant="primary">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[90vh]">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-healthy/20 rounded-full blur-[100px]" />
          <div className="absolute top-40 -left-20 w-80 h-80 bg-sky-brand/20 rounded-full blur-[90px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] max-w-4xl bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] rounded-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto animate-slide-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle border-sky-brand/30 text-sky-brand font-medium text-sm mb-8 shadow-sm">
            <span className="pulse-dot" /> Live push-pull monitoring network
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-navy tracking-tight leading-[1.1] mb-8">
            Transforming Agriculture with <span className="text-gradient">Smart Data</span>.
          </h1>

          <p className="text-lg md:text-xl text-slate-brand mb-10 max-w-2xl mx-auto leading-relaxed">
            Kilimo Bunifu provides agronomists in East Africa with real-time IoT soil intelligence and satellite NDVI heatmaps, optimized for sustainable push-pull farming systems.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full shadow-[0_8px_30px_rgba(52,152,219,0.3)] hover:-translate-y-1">
                Start Monitoring <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" className="w-full">
                Explore Features
              </Button>
            </a>
          </div>
        </div>

        {/* Floating Stats / Visual Anchor */}
        <div className="relative z-10 mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto w-full px-4 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          {[
            { label: 'Active Sensors', value: '1,204', suffix: 'Nodes' },
            { label: 'Farms Monitored', value: '450', suffix: 'Hectares' },
            { label: 'Data Points', value: '2.4M', suffix: '/ Day' },
            { label: 'System Uptime', value: '99.9', suffix: '%' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 text-center border-t-2 border-t-sky-brand/50">
              <div className="text-3xl font-black text-navy mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-slate-brand uppercase tracking-wider">{stat.label}</div>
              <div className="text-[10px] text-sky-brand mt-1">{stat.suffix}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="page-section bg-white relative z-10">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="section-title">Actionable Agronomy Intelligence</h2>
            <p className="section-subtitle mx-auto">
              A comprehensive toolset bridging the gap between hardware sensors installed in the field and remote satellite intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-subtle p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-sky-brand/10 flex items-center justify-center text-sky-brand mb-6">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">IoT Node Networks</h3>
              <p className="text-slate-brand text-sm leading-relaxed">
                Deploy rugged, solar-powered multi-parameter sensors directly into maize and desmodium fields. Stream EC, pH, Moisture and Temp reliably over LoRaWAN.
              </p>
            </div>

            <div className="glass-subtle p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-healthy/10 flex items-center justify-center text-healthy mb-6">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Time-Series Analytics</h3>
              <p className="text-slate-brand text-sm leading-relaxed">
                Visualize massive datasets with interactive, lag-free charts. Spot micro-climate trends and soil degradation before it impacts crop yield.
              </p>
            </div>

            <div className="glass-subtle p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center text-warning mb-6">
                <Map className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Geospatial Awareness</h3>
              <p className="text-slate-brand text-sm leading-relaxed">
                High-performance Mapbox GL integration overlaid with synthetic Google Earth Engine inputs (NDVI/NDRE), pinpointing stressed zones at the hectare level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="page-section bg-off-white relative z-10">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="section-title">Meet the Team</h2>
            <p className="section-subtitle mx-auto">
              Built by agronomists, engineers, and researchers dedicated to East African food security.
            </p>
          </div>

          <div className="flex flex-col gap-16">
            {TEAM_MEMBERS.reduce((acc, member) => {
              let team = acc.find(t => t.name === member.team)
              if (!team) {
                team = { name: member.team, members: [] }
                acc.push(team)
              }
              team.members.push(member)
              return acc
            }, []).map((team) => (
              <div key={team.name} className="flex flex-col items-center">
                <h3 className="text-xl font-bold text-sky-brand mb-8 bg-sky-brand/10 px-6 py-2 rounded-full inline-block border border-sky-brand/20 shadow-sm">{team.name}</h3>
                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                  {team.members.map((member) => (
                    <div key={member.id} className="flex flex-col items-center group w-32 md:w-36">
                      <div className="relative w-28 h-28 md:w-32 md:h-32 mb-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-brand to-healthy opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-lg pointer-events-none" />
                        ) : (
                          <div className="relative w-full h-full rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-3xl">
                            {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-navy text-center leading-tight mb-1 text-sm md:text-base">{member.name}</h4>
                      <p className="text-xs text-slate-500 text-center font-medium mb-3 h-8">{member.title}</p>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-brand hover:text-[#0A66C2] shadow-sm transition-colors"><Linkedin className="w-4 h-4" /></a>
                        <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-brand hover:text-black shadow-sm transition-colors"><Twitter className="w-4 h-4" /></a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
