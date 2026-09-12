import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Github, Send, Phone, Instagram } from "lucide-react";

function MagneticIcon({ children, link }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - centerX) * 0.25,
      y: (e.clientY - centerY) * 0.25,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="social"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transform: isHovered
          ? `translate(${offset.x}px, ${offset.y}px) scale(1.25)`
          : "translate(0px, 0px) scale(1)",
        transition: isHovered
          ? "transform 0.1s ease-out"
          : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </a>
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
        <a href="mailto:info@pakhlavon.dev" target="_blank" rel="noreferrer">
          info@pakhlavon.dev
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