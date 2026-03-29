import React from "react";
import { useTranslation } from "react-i18next";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Github, Send, Phone, Instagram } from "lucide-react";

function MagneticIcon({ children, link, index }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // magnetic strength
    x.set(deltaX * 0.25);
    y.set(deltaY * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="social"
      initial={{ opacity: 0, y: 60, scale: 0.5 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.12,
        type: "spring",
        stiffness: 260,
        damping: 18,
      }}
      style={{
        x: springX,
        y: springY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.35,
      }}
      whileTap={{
        scale: 0.85,
      }}
    >
      {children}
    </motion.a>
  );
}

function Footer() {
  const { t } = useTranslation();

  const icons = [
    { icon: <Github size={35} />, link: "https://github.com/pakhlavonKh" },
    { icon: <Send size={35} />, link: "https://t.me/pahlavon_kh" },
    { icon: <Phone size={35} />, link: "https://wa.me/qr/F2S7GI6TDZ5NN1" },
    { icon: <Instagram size={35} />, link: "https://www.instagram.com/pakhlavon_kh" },
  ];

  return (
    <footer className="footer" id="contacts">
      <div className="footer__text">
        <h2>{t("footer.title")}</h2>
        <p>{t("footer.description")}</p>
      </div>

      <div className="footer__links">
        <a href="mailto:76khwmidov@gmail.com" target="_blank" rel="noreferrer">
          76khwmidov@gmail.com
        </a>

        <div className="footer__links-icons">
          {icons.map((item, i) => (
            <MagneticIcon key={i} link={item.link} index={i}>
              {item.icon}
            </MagneticIcon>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;