import { Github, Twitter, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full glass-heavy border-t border-glass-border-subtle py-8 mt-auto z-10 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center p-0.5 ring-1 ring-sky-brand/20 bg-white">
              <img src="/favicon.svg" alt="Kilimo Bunifu Logo" className="w-full h-full object-cover rounded-full" />
            </span>
            <span className="font-bold text-navy text-xl">Kilimo Bunifu</span>
          </div>
          <p className="text-sm text-slate-brand text-center md:text-left">
            Transforming Push-Pull agriculture in East Africa.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium text-slate-brand">
          <a href="#" className="hover:text-sky-brand transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-sky-brand transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-sky-brand transition-colors">Support</a>
          <a href="#" className="hover:text-sky-brand transition-colors">Data Ethics</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://x.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass-subtle flex items-center justify-center text-navy hover:text-sky-brand hover:-translate-y-1 transition-all">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass-subtle flex items-center justify-center text-navy hover:text-sky-brand hover:-translate-y-1 transition-all">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass-subtle flex items-center justify-center text-navy hover:text-sky-brand hover:-translate-y-1 transition-all">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass-subtle flex items-center justify-center text-navy hover:text-sky-brand hover:-translate-y-1 transition-all">
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
      <div className="w-full text-center mt-8 pt-4 border-t border-glass-border-subtle">
        <p className="text-xs text-slate-brand">© {new Date().getFullYear()} Kilimo Bunifu. All rights reserved.</p>
      </div>
    </footer>
  )
}
