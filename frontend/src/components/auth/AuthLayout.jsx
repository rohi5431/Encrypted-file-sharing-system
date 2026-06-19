import { motion } from "framer-motion";
import { Shield, Lock, Cpu, Eye } from "lucide-react";
import ParticleField from "./ParticleField";

const FEATURES = [
  { icon: Lock, label: "AES-256 Encryption" },
  { icon: Eye, label: "AI Security Scanner" },
  { icon: Cpu, label: "Zero Trust Security" },
  { icon: Shield, label: "DLP Protection" },
];

export default function AuthLayout({ children, mode = "login" }) {
  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #020817 0%, #0F172A 50%, #020817 100%)" }}
    >
      {/* Global particles */}
      <ParticleField />

      {/* Floating background orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          top: "-200px",
          left: "-200px",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
          bottom: "-150px",
          right: "30%",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
          top: "40%",
          left: "40%",
          filter: "blur(30px)",
        }}
      />

      {/* ── Left Panel: Form ── */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12 relative z-10 order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                boxShadow: "0 0 20px rgba(59,130,246,0.5)",
              }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              SecureShare
            </span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full ml-1"
              style={{
                background: "rgba(59,130,246,0.2)",
                border: "1px solid rgba(59,130,246,0.3)",
                color: "#60A5FA",
              }}
            >
              AI
            </span>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(59,130,246,0.05)",
            }}
          >
            {children}
          </div>
        </motion.div>
      </div>

      {/* ── Right Panel: Hero Image ── */}
      <div className="relative lg:w-[55%] overflow-hidden order-1 lg:order-2 min-h-[280px] lg:min-h-0">
        {/* Deep dark base */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #020817 0%, #050E1F 100%)" }}
        />

        {/* Glow rings behind image */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "70%",
            height: "70%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 65%)",
            top: "15%",
            left: "15%",
            filter: "blur(30px)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: "50%",
            height: "50%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%)",
            bottom: "10%",
            right: "5%",
            filter: "blur(20px)",
          }}
        />

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center p-6 lg:p-10"
        >
          <img
            src="/images/image.png"
            alt="AI Secure File Sharing System"
            className="w-full h-full object-contain"
            style={{ filter: "drop-shadow(0 0 40px rgba(59,130,246,0.3))" }}
          />
        </motion.div>

        {/* Subtle overlay gradient (edges only) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(2,8,23,0.6) 100%)",
          }}
        />

        {/* Feature badges — bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 p-4 lg:p-6"
          style={{
            background:
              "linear-gradient(to top, rgba(2,8,23,0.95) 0%, transparent 100%)",
          }}
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94A3B8",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Icon className="w-3 h-3 text-blue-400" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
