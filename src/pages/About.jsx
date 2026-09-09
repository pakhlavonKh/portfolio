import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code, Globe, Server, Cpu, Layers, Compass, Layout, Terminal, Sparkles } from "lucide-react";
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

  const steps = [
    {
      num: "01",
      icon: <Compass size={26} />,
      title: t("about.process.step1"),
      text: t("about.process.step1_desc"),
    },
    {
      num: "02",
      icon: <Layout size={26} />,
      title: t("about.process.step2"),
      text: t("about.process.step2_desc"),
    },
    {
      num: "03",
      icon: <Terminal size={26} />,
      title: t("about.process.step3"),
      text: t("about.process.step3_desc"),
    },
    {
      num: "04",
      icon: <Sparkles size={26} />,
      title: t("about.process.step4"),
      text: t("about.process.step4_desc"),
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

      {/* APPROACH / PROCESS */}
      <section className="about__approach">
        <motion.div
          className="about__approach-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2>{t("about.process.title")}</h2>
          <span className="about__approach-accent-bar" />
        </motion.div>

        <div className="about__steps-grid">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="about__step-card"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: idx * 0.1 }}
            >
              <div className="about__step-top">
                <span className="about__step-num">{step.num}</span>
                <div className="about__step-icon-wrap">{step.icon}</div>
              </div>
              <h3 className="about__step-title">{step.title}</h3>
              <p className="about__step-text">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default About;