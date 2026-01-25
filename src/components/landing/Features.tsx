"use client";

import { Zap, Shield, Layout, Code, Smartphone, Globe } from "lucide-react";
import { motion } from "framer-motion";

import { useLanguage } from '@/contexts/LanguageContext'

export function Features() {
  const { t } = useLanguage()
  const featureList = [
    {
      title: t.features.items[0].title,
      description: t.features.items[0].description,
      icon: Zap,
      className: "md:col-span-2",
      gradient: "from-amber-500/10 to-orange-500/10",
      iconColor: "text-amber-600"
    },
    {
      title: t.features.items[1].title,
      description: t.features.items[1].description,
      icon: Code,
      className: "md:col-span-1",
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-600"
    },
    {
      title: t.features.items[2].title,
      description: t.features.items[2].description,
      icon: Smartphone,
      className: "md:col-span-1",
      gradient: "from-emerald-500/10 to-green-500/10",
      iconColor: "text-emerald-600"
    },
    {
      title: t.features.items[3].title,
      description: t.features.items[3].description,
      icon: Globe,
      className: "md:col-span-2",
      gradient: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <section id="features" className="py-24 bg-zinc-50/50 border-t border-zinc-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600 shadow-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Why foundrr?
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-zinc-900 mb-6">
            {t.features.title} <span className="text-zinc-400 font-light">|</span> <span className="text-primary">{t.features.titleBr}</span>
          </h2>
          <p className="text-zinc-600 text-lg text-balance leading-relaxed">
            {t.features.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureList.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 hover:border-zinc-300 transition-all duration-300 shadow-sm hover:shadow-xl ${feature.className}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 ${feature.iconColor} group-hover:scale-110 transition-all duration-300 shadow-sm border border-zinc-100`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-zinc-900">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-medium">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
