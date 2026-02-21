import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Flag,
  Mail,
  Globe,
  ChevronDown,
  Loader2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../config";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const threatCategories = [
  { value: "", label: "Select threat category" },
  { value: "Phishing", label: "Phishing" },
  { value: "Typo Squating", label: "Typo Squatting" },
  { value: "Shopping", label: "Shopping" },
  { value: "Adult", label: "Adult" },
];

export default function ReportingForm() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState({
    email: "",
    url: searchParams.get("url") || "",
    threat_category: searchParams.get("threat_category") || "",
  });
  const navigate = useNavigate();

  const onChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!payload.email || !payload.url || !payload.threat_category) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    axios
      .post(`${API_URL}/reports`, payload)
      .then(() => {
        toast.success("Report submitted. Thank you for making the web safer!");
        setTimeout(() => {
          setPayload({ email: "", url: "", threat_category: "" });
        }, 500);
      })
      .catch(() => {
        toast.error("An error occurred. Please try again.");
      })
      .finally(() => {
        setTimeout(() => setIsLoading(false), 500);
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
              <Flag className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Report a Threat
            </h1>
            <p className="text-dark-400 text-sm max-w-sm mx-auto">
              Help protect the community by reporting malicious URLs. Your
              report feeds into our threat intelligence database.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={payload.email}
                onChange={onChange}
                className="input-field pl-11"
                required
              />
            </div>

            {/* URL */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="url"
                placeholder="https://suspicious-site.com"
                value={payload.url}
                onChange={onChange}
                className="input-field pl-11"
                required
              />
            </div>

            {/* Threat Category */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <select
                name="threat_category"
                value={payload.threat_category}
                onChange={onChange}
                className="input-field pl-11 pr-10 appearance-none cursor-pointer"
                required
              >
                {threatCategories.map(({ value, label }) => (
                  <option
                    key={value}
                    value={value}
                    className="bg-dark-900 text-gray-100"
                  >
                    {label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 pointer-events-none">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-danger w-full py-4 text-base border-red-500/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Flag className="w-5 h-5" />
                  Submit Report
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-dark-800/50">
            <div className="flex items-start gap-3 text-xs text-dark-500">
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Reports are reviewed and added to our threat database. Your
                email is used only to notify you about the status of your
                report.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/scan")}
            className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-kraven-400 transition-colors"
          >
            Want to scan a URL instead?
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
