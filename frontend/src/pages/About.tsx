// src/pages/About.tsx
import Header from "../components/Header";
import { ArrowRight, Activity, Zap, Shield } from "lucide-react";
import kaizenLogo from "../assets/kaizen-logo.png";

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header title="KAIZEN" />

      {/* ===================== PROFESSIONAL ATHLETIC HERO ===================== */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-neutral-900" />
        
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Athletic Performance Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 mb-8">
                <Activity size={16} className="text-red-500" />
                <span className="text-sm font-bold text-white/90 tracking-wide">PERFORMANCE WEAR</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight">
                ENGINEERED
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mt-4">
                  FOR ATHLETES
                </span>
              </h1>
              
              <p className="mt-8 text-lg text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                Premium athletic wear designed for those who demand more from their gear. 
                Built with purpose, crafted for performance.
              </p>

              <div className="mt-12">
                <a
                  href="/shop"
                  className="group inline-flex items-center justify-center gap-3 rounded-lg bg-red-600 hover:bg-red-700 text-white px-8 py-4 font-bold transition-all duration-300"
                >
                  EXPLORE COLLECTION
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Professional Logo Display */}
            <div className="relative">
              <div className="relative mx-auto w-full max-w-sm">
                <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900 to-black p-8">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-white/10">
                    <img
                      src={kaizenLogo}
                      alt="KAIZEN Athletics"
                      className="w-full h-full object-cover"
                      loading="eager"
                      draggable={false}
                    />
                  </div>

                  <div className="mt-6 text-center space-y-2">
                    <div className="text-xl font-black tracking-wide">KAIZEN ATHLETICS</div>
                    <div className="text-sm text-white/60 font-light">
                      Built for movement, designed for results
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================== ATHLETIC FEATURES ===================== */}
      <section className="py-20 border-t border-white/10 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-6">DESIGNED FOR PERFORMANCE</h2>
            <p className="text-white/70 max-w-xl mx-auto font-light">
              Quality athletic wear focused on what matters
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Performance Fit",
                description: "Engineered for optimal movement and comfort during activity"
              },
              {
                icon: Activity,
                title: "Quality Materials",
                description: "Premium fabrics selected for durability and performance"
              },
              {
                icon: Shield,
                title: "Athletic Design",
                description: "Thoughtful construction for serious training and competition"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 mb-6">
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-4">{feature.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== MINIMAL FOOTER ===================== */}
      <footer className="py-12 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-2xl font-black mb-4">KAIZEN</div>
          <p className="text-sm text-white/55 mb-4">
            Athletic Performance Wear
          </p>
          <a
            href="mailto:hello@kaizen.fit"
            className="text-sm text-white/75 hover:text-white transition-colors font-light"
          >
            kaizenfit.onrender.com
          </a>
        </div>
      </footer>

    </div>
  );
}