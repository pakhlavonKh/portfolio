import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code, Globe, Server, Cpu, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";

function About() {
  const [dot, setDot] = useState({ x: 0, y: 0 });
  const { t } = useTranslation();

  const blocks = [
    {
      icon: <Code size={40} />,
      title: t("about.expertise.software.title"),
      highlight: t("about.expertise.software.title"),
      text: t("about.expertise.software.description"),
    },
    {
      icon: <Globe size={40} />,
      title: t("about.expertise.fullstack.title"),
      highlight: t("about.expertise.fullstack.title"),
      text: t("about.expertise.fullstack.description"),
    },
    {
      icon: <Server size={40} />,
      title: t("about.expertise.backend.title"),
      highlight: t("about.expertise.backend.title"),
      text: t("about.expertise.backend.description"),
    },
    {
      icon: <Cpu size={40} />,
      title: t("about.expertise.systems.title"),
      highlight: t("about.expertise.systems.title"),
      text: t("about.expertise.systems.description"),
    },
    {
      icon: <Layers size={40} />,
      title: t("about.expertise.applications.title"),
      highlight: t("about.expertise.applications.title"),
      text: t("about.expertise.applications.description"),
    },
  ];

  return (
    <main className="about">
      {/* HERO */}
      <section className="about__hero">
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          {t("about.hero.title")}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}>
          {t("about.hero.description")}
        </motion.p>
      </section>

      {/* FLOW */}
      <section
        className="about__flow"
        onMouseMove={(e) => setDot({ x: e.clientX, y: e.clientY })}
      >
        {/* ambient */}
        <div className="about__ambient" />

        {/* minimal cursor */}
        <div className="cursor-dot" style={{ left: dot.x, top: dot.y }} />

        {/* vertical line */}
        <div className="about__line" />

        {/* signals */}
        <div className="about__signals">
          <span />
          <span />
          <span />
        </div>

        {/* floating tags */}
        <div className="about__float float--1">API</div>
        <div className="about__float float--2">System</div>
        <div className="about__float float--3">Node</div>
        <div className="about__float float--4">UI</div>

        {/* panels */}
        {blocks.map((b, i) => (
          <motion.div
            key={i}
            className={`about__panel ${i % 2 === 0 ? "left" : "right"}`}
            initial={{
              opacity: 0,
              x: i % 2 === 0 ? -120 : 120,
              y: 60,
            }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="about__connector" />

            <div className="about__panel-content">
              <div className="about__panel-header">
                {b.icon}
                <h2>
                  {b.title} <span>{b.highlight}</span>
                </h2>
              </div>

              <p>{b.text}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* APPROACH */}
      <section className="about__approach">
        <h2>{t("about.process.title")}</h2>
        <p>{t("about.process.step1_desc")}</p>
      </section>
    </main>
  );
}

export default About;