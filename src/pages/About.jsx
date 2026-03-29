import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code, Globe, Server, Cpu, Layers } from "lucide-react";

function About() {
  const [dot, setDot] = useState({ x: 0, y: 0 });

  const blocks = [
    {
      icon: <Code size={40} />,
      title: "Software Engineering",
      highlight: "Core",
      text: `Strong foundation in algorithms, OOP and problem solving.
Experience with Java, Python, JavaScript and C++.`,
    },
    {
      icon: <Globe size={40} />,
      title: "Full Stack",
      highlight: "Development",
      text: `Building modern applications with React, Node.js and APIs.`,
    },
    {
      icon: <Server size={40} />,
      title: "Backend",
      highlight: "Architecture",
      text: `Designing scalable backend systems and integrations.`,
    },
    {
      icon: <Cpu size={40} />,
      title: "Systems",
      highlight: "Design",
      text: `Thinking in systems, structure and data flow.`,
    },
    {
      icon: <Layers size={40} />,
      title: "Applications",
      highlight: "Development",
      text: `Building full products from idea to production.`,
    },
  ];

  return (
    <main className="about">
      {/* HERO */}
      <section className="about__hero">
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          About Me
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}>
          I build complete systems — from interface to architecture —
          focusing on clarity and scalability.
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
        <h2>Approach</h2>
        <p>
          I approach development as system design — focusing on clarity,
          structure and long-term maintainability.
        </p>
      </section>
    </main>
  );
}

export default About;