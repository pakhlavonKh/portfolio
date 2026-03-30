import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

function Header() {
  const [isFixed, setIsFixed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (!isHomePage) {
      // On non-home pages, always sticky
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const hero = document.querySelector(".hero");
      if (!hero) {
        setIsFixed(scrollY > 100);
        return;
      }
      const rect = hero.getBoundingClientRect();
      setIsFixed(rect.bottom <= 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); 
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  useEffect(() => {
    setIsOpen(false); 
  }, [location]);
  
  return (
    <header className={`header ${isHomePage ? (isFixed ? 'fixed' : '') : 'sticky'}`}>
      <Link to="/" className="name-wrapper">
        <span className="first">K</span>
        <span className="rest hamidov">hamidov</span>
        <span className="first letter-p">P</span>
        <span className="rest akhlavon">akhlavon</span>
      </Link>
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
      <div className="navigation">
        <ul className="navigation__list">
          <li><Link to="/" onClick={() => setIsOpen(false)}>{t("home")}</Link></li>
          <li><Link to="/about" onClick={() => setIsOpen(false)}>{t("expertise")}</Link></li>
          <li><Link to="/portfolio" onClick={() => setIsOpen(false)}>{t("work")}</Link></li>
          <li><Link to="/contact" onClick={() => setIsOpen(false)}>{t("contacts")}</Link></li>
        </ul>
        <LanguageSwitcher  className="navigationLang"/>
      </div>

      <ul className={`headerNav ${isHomePage && isFixed ? 'fixed' : ""}`}>
        <li><Link to="/" onClick={() => setIsOpen(false)}>{t("home")}</Link></li>
        <li><Link to="/about" onClick={() => setIsOpen(false)}>{t("expertise")}</Link></li>
        <li><Link to="/portfolio" onClick={() => setIsOpen(false)}>{t("work")}</Link></li>
        <li><Link to="/contact" onClick={() => setIsOpen(false)}>{t("contacts")}</Link></li>
      </ul>
      <LanguageSwitcher />
    </header>
  );
}


export default Header;