import { Link, useLocation } from "react-router-dom";
import { Shield, ScanSearch, Flag, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/", label: "Home", icon: Shield },
    { to: "/scan", label: "Scanner", icon: ScanSearch },
    { to: "/report", label: "Report", icon: Flag },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-kraven-500/10 border border-kraven-500/20 flex items-center justify-center group-hover:border-kraven-500/40 transition-colors">
                <Shield className="w-5 h-5 text-kraven-400" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-kraven-500 rounded-full animate-pulse-slow" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                KRAVEN
              </span>
              <span className="hidden sm:inline text-xs text-dark-400 ml-2 font-mono">
                v1.0
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? "bg-kraven-500/10 text-kraven-400 border border-kraven-500/20"
                    : "text-dark-300 hover:text-white hover:bg-dark-800/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-800/50 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-dark-800/50 bg-dark-950/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(to)
                      ? "bg-kraven-500/10 text-kraven-400 border border-kraven-500/20"
                      : "text-dark-300 hover:text-white hover:bg-dark-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
