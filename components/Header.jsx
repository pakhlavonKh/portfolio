import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

function Header() {
  const [isFixed, setIsFixed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      console.log("Scroll event fired, scrollY:", scrollY);
      const hero = document.querySelector(".hero");
      if (!hero) {
        console.warn("Hero section not found. Using scroll position fallback.");
        setIsFixed(scrollY > 100);
        return;
      }
      const rect = hero.getBoundingClientRect();
      console.log("Hero - top:", rect.top, "bottom:", rect.bottom, "height:", rect.height);
      setIsFixed(rect.bottom <= 0);
    };

    console.log("Adding scroll event listener");
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); 
    return () => {
      console.log("Removing scroll event listener");
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false); 
  }, [location]);
  
  return (
    <header className="header">
      <div className="name-wrapper">
        <span className="first">K</span>
        <span className="rest hamidov">hamidov</span>
        <span className="first letter-p">P</span>
        <span className="rest akhlavon">akhlavon</span>
      </div>
      <input
        type="checkbox"
        id="nav-toggle"
        className="navigation__checkbox"
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      <label htmlFor="nav-toggle" className="navigation__button">
        <span className={`navigation__icon ${isOpen ? 'open' : ''}`}>&nbsp;</span>
      </label>
      <ul className={`headerNav ${isFixed ? 'fixed' : ""}`}>
        <li><a href="#hero" onClick={() => setIsOpen(false)}>{t("home")}</a></li>
        <li><a href="#expertise" onClick={() => setIsOpen(false)}>{t("expertise")}</a></li>
        <li><a href="#work" onClick={() => setIsOpen(false)}>{t("work")}</a></li>
        <li><a href="#contacts" onClick={() => setIsOpen(false)}>{t("contacts")}</a></li>
      </ul>
      <LanguageSwitcher />
    </header>
  );
}

export default Header;