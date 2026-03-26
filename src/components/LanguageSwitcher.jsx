import React, { useEffect, useState, useRef } from "react";
import i18next from "i18next";

const LANGS = [
  { code: "uz", label: "UZ", native: "UZ", dir: "ltr" },
  { code: "ru", label: "Ru", native: "RU", dir: "ltr" },
  { code: "en", label: "EN", native: "EN", dir: "ltr" },
  { code: "tr", label: "TR", native: "TR", dir: "ltr" },
];

function getInitialLang() {
  if (typeof window === "undefined") return "en";
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  if (urlLang && LANGS.some((l) => l.code === urlLang)) return urlLang;
  const stored = localStorage.getItem("app.lang");
  if (stored && LANGS.some((l) => l.code === stored)) return stored;
  const nav = navigator.language.split("-")[0];
  if (LANGS.some((l) => l.code === nav)) return nav;
  return "en";
}

export default function LanguageSwitcher({ className="" }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState(getInitialLang);
  const switcherRef = useRef(null);

  useEffect(() => {
    i18next.changeLanguage(lang);
    localStorage.setItem("app.lang", lang);
    const meta = LANGS.find((l) => l.code === lang);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", meta?.dir || "ltr");
  }, [lang]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.altKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.altKey && /^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (LANGS[idx]) setLang(LANGS[idx].code);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  return (
    <div className={`lang-switcher ${className}`} ref={switcherRef}>
      <button className="lang-button" onClick={() => setOpen((o) => !o)}>
        {LANGS.find((l) => l.code === lang)?.flag}{" "}
        {LANGS.find((l) => l.code === lang)?.native}
      </button>
      {open && (
        <ul className="lang-menu">
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                className={`lang-option ${lang === l.code ? "active" : ""}`}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
              >
                {l.flag || l.native}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
