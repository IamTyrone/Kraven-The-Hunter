import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ScanSearch,
  Loader2,
  Shield,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../config";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Scanner() {
  const [payload, setPayload] = useState({ url: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const url = searchParams.get("url");

  const onChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (url) {
      setPayload({ url });
    }
  }, [url]);

  const onScan = (e) => {
    e.preventDefault();
    if (!payload.url) {
      toast.error("Please enter a URL to scan.");
      return;
    }
    setLoading(true);
    axios
      .post(`${API_URL}/prediction`, payload)
      .then((res) => {
        if (res.data.category === "invalid") {
          toast.error(
            "Invalid URL. Please enter a valid URL with http:// or https://",
          );
        } else {
          const { category, confidence, source } = res.data;
          navigate(
            `/warning?category=${category}&url=${encodeURIComponent(payload.url)}&confidence=${confidence}&source=${source}`,
          );
        }
      })
      .catch(() => {
        toast.error("An error occurred. Please try again.");
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 500);
      });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-xl"
      >
        <div className="glass-card p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-kraven-500/10 border border-kraven-500/20 mb-5">
              <ScanSearch className="w-8 h-8 text-kraven-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              URL Scanner
            </h1>
            <p className="text-dark-400 text-sm max-w-sm mx-auto">
              Paste any URL below to analyze it for phishing, malware, and other
              threats using our ML engine.
            </p>
          </div>

          <form onSubmit={onScan} className="space-y-5">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500">
                <Shield className="w-4 h-4" />
              </div>
              {url ? (
                <input
                  type="text"
                  name="url"
                  value={url}
                  disabled
                  className="input-field pl-11 opacity-70 cursor-not-allowed"
                />
              ) : (
                <input
                  type="text"
                  name="url"
                  placeholder="https://example.com"
                  value={payload.url}
                  onChange={onChange}
                  className="input-field pl-11"
                  autoFocus
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ScanSearch className="w-5 h-5" />
                  Scan URL
                </>
              )}
            </button>
          </form>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              <div className="glass-card p-4 border-kraven-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-kraven-500 animate-pulse" />
                  <span className="text-sm text-dark-300 font-mono">
                    Running ML classification model...
                  </span>
                </div>
                <div className="mt-3 h-1 bg-dark-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-kraven-500 to-kraven-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div className="mt-8 pt-6 border-t border-dark-800/50">
            <div className="flex items-start gap-3 text-xs text-dark-500">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Kraven analyzes URL structure, character patterns, and known
                threat databases. Results are probabilistic — always exercise
                caution with unfamiliar links.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/report")}
            className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-kraven-400 transition-colors"
          >
            Know a malicious site? Report it
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
