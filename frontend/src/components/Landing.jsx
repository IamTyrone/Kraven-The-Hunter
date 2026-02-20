import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  ScanSearch,
  Flag,
  Zap,
  Brain,
  Globe,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Activity,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: Brain,
    title: "ML-Powered Detection",
    description:
      "TensorFlow classification model trained on labelled phishing and malware datasets for accurate threat identification.",
  },
  {
    icon: Zap,
    title: "Real-Time Analysis",
    description:
      "Instant URL scanning via our FastAPI engine. Get threat assessments in milliseconds, not minutes.",
  },
  {
    icon: Globe,
    title: "Chrome Extension",
    description:
      "Seamless browser integration that automatically parses active tab URLs and alerts you to threats.",
  },
];

const stats = [
  { label: "Threat Categories", value: "4+", icon: ShieldAlert },
  { label: "Response Time", value: "<100ms", icon: Activity },
  { label: "ML Accuracy", value: "High", icon: ShieldCheck },
];

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-kraven-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kraven-500/10 border border-kraven-500/20 mb-8"
          >
            <Shield className="w-4 h-4 text-kraven-400" />
            <span className="text-sm font-medium text-kraven-300">
              AI-Powered Threat Intelligence
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6"
          >
            <span className="text-white">Hunt Down</span>
            <br />
            <span className="bg-gradient-to-r from-kraven-400 to-kraven-600 bg-clip-text text-transparent">
              Malicious URLs
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Kraven uses machine learning to detect phishing, malware, and
            suspicious URLs in real time. Protect yourself and your community
            from online threats.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/scan" className="btn-primary text-base px-8 py-4">
              <ScanSearch className="w-5 h-5" />
              Scan a URL
            </Link>
            <Link to="/report" className="btn-secondary text-base px-8 py-4">
              <Flag className="w-5 h-5" />
              Report a Threat
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map(({ label, value, icon: Icon }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-kraven-500/10 border border-kraven-500/20 mb-4">
                  <Icon className="w-6 h-6 text-kraven-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {value}
                </div>
                <div className="text-sm text-dark-400">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How Kraven Protects You
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              A multi-layered approach to URL threat detection, combining
              machine learning with community intelligence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass-card-hover p-8 group"
              >
                <div className="w-12 h-12 rounded-xl bg-kraven-500/10 border border-kraven-500/20 flex items-center justify-center mb-5 group-hover:bg-kraven-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-kraven-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {title}
                </h3>
                <p className="text-sm text-dark-400 leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-kraven-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-kraven-500/10 border border-kraven-500/20 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-kraven-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Install the Chrome Extension
              </h2>
              <p className="text-dark-400 mb-8 max-w-lg mx-auto">
                Get real-time protection as you browse. Kraven automatically
                scans every URL and warns you before you land on a malicious
                page.
              </p>
              <Link
                to="/scan"
                className="btn-primary text-base px-8 py-4 inline-flex"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-dark-800/50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-kraven-500" />
            <span className="text-sm font-semibold text-dark-400">
              KRAVEN
            </span>
          </div>
          <p className="text-xs text-dark-500">
            AI-powered threat detection. Open source security tooling.
          </p>
        </div>
      </footer>
    </div>
  );
}
