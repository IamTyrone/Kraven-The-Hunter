import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  ScanSearch,
  Flag,
  ExternalLink,
  Info,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

function getSeverityConfig(category) {
  if (category === "Benign") {
    return {
      severity: "Safe",
      severityBadge: "badge-safe",
      icon: ShieldCheck,
      iconColor: "text-kraven-400",
      iconBg: "bg-kraven-500/10 border-kraven-500/20",
      headerGradient: "from-kraven-500/10",
      title: "URL Appears Safe",
      description:
        "Our ML model did not detect any malicious patterns in this URL. However, always exercise caution.",
      accentBorder: "border-kraven-500/30",
    };
  }

  if (category === "Shopping") {
    return {
      severity: "Low",
      severityBadge: "badge-warning",
      icon: ShieldAlert,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      headerGradient: "from-amber-500/10",
      title: "Shopping Site Detected",
      description:
        "This URL has been identified as a shopping website. Shopping sites are flagged for additional scrutiny.",
      accentBorder: "border-amber-500/30",
    };
  }

  return {
    severity: "High",
    severityBadge: "badge-danger",
    icon: ShieldX,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10 border-red-500/20",
    headerGradient: "from-red-500/10",
    title: "Threat Detected",
    description:
      "This URL has been flagged as potentially dangerous. We strongly recommend you do not visit this website.",
    accentBorder: "border-red-500/30",
  };
}

function formatSource(source) {
  const map = {
    ml_model: "ML Model",
    community_report: "Community Report",
    shopping_list: "Shopping List",
    validation: "Validation",
  };
  return map[source] || source;
}

export default function Warning() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category") || "Unknown";
  const scannedUrl = searchParams.get("url");
  const confidence = parseFloat(searchParams.get("confidence")) || 0;
  const source = searchParams.get("source") || "ml_model";
  const config = getSeverityConfig(category);
  const Icon = config.icon;

  const confidencePercent = `${Math.round(confidence * 100)}%`;
  const confidenceBadge =
    confidence >= 0.85
      ? "badge-danger"
      : confidence >= 0.5
        ? "badge-warning"
        : "badge-info";

  const metrics = [
    {
      label: "Category",
      value: category?.toUpperCase(),
      icon: Info,
    },
    {
      label: "Severity",
      value: config.severity,
      badgeClass: config.severityBadge,
    },
    {
      label: "Confidence",
      value: confidencePercent,
      badgeClass: confidenceBadge,
    },
    {
      label: "Source",
      value: formatSource(source),
      badgeClass: "badge-info",
    },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-xl"
      >
        <div className={`glass-card overflow-hidden ${config.accentBorder}`}>
          {/* Header gradient strip */}
          <div
            className={`h-1 bg-gradient-to-r ${config.headerGradient} to-transparent`}
          />

          <div className="p-8 sm:p-10">
            {/* Icon + Title */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="text-center mb-8"
            >
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${config.iconBg} border mb-5 animate-glow`}
              >
                <Icon className={`w-10 h-10 ${config.iconColor}`} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                {config.title}
              </h1>
              <p className="text-dark-400 text-sm max-w-md mx-auto">
                {config.description}
              </p>
            </motion.div>

            {/* Scanned URL */}
            {scannedUrl && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="mb-6"
              >
                <div className="glass-card p-4 flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-dark-500 flex-shrink-0" />
                  <span className="text-sm font-mono text-dark-300 truncate">
                    {decodeURIComponent(scannedUrl)}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Metrics */}
            <div className="space-y-3">
              {metrics.map(
                ({ label, value, badgeClass, icon: MetricIcon }, i) => (
                  <motion.div
                    key={label}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={i + 2}
                    className="glass-card p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {MetricIcon && (
                        <MetricIcon className="w-4 h-4 text-dark-500" />
                      )}
                      <span className="text-sm font-medium text-dark-300 uppercase tracking-wider">
                        {label}
                      </span>
                    </div>
                    {badgeClass ? (
                      <span className={badgeClass}>{value}</span>
                    ) : (
                      <span className="text-sm font-semibold text-white">
                        {value}
                      </span>
                    )}
                  </motion.div>
                ),
              )}
            </div>

            {/* Actions */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={5}
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <button onClick={() => navigate("/scan")} className="btn-primary">
                <ScanSearch className="w-4 h-4" />
                Scan Another URL
              </button>
              <button
                onClick={() =>
                  navigate(
                    `/report?url=${encodeURIComponent(scannedUrl || "")}&threat_category=${encodeURIComponent(category)}`,
                  )
                }
                className="btn-danger"
              >
                <Flag className="w-4 h-4" />
                Report This URL
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
