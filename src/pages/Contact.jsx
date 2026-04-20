import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Send, Instagram } from "lucide-react";

function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setTimeout(() => setStatus(""), 3000);
      return;
    }

    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbzatTdWnVw2DpPCj1K2TaBv113-JRsfvgoC0Ls32oZDLUoYtQvvB3iBdHicOl9SdrVH/exec", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status === "success") {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }

    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <main>
      <section className="contact">
        <div className="contact__header">
          <h1 className="contact__title">
            {t("contact.title")} <span>{t("contact.titleHighlight")}</span>
          </h1>
          <p className="contact__subtitle">{t("contact.subtitle")}</p>
        </div>

        <div className="contact__container">
          {/* Contact Form */}
          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="form__group floating">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label htmlFor="name">{t("contact.form.name")}</label>
            </div>

            <div className="form__group floating">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label htmlFor="email">{t("contact.form.email")}</label>
            </div>

            <div className="form__group floating">
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder=" "
              />
              <label htmlFor="subject">{t("contact.form.subject")}</label>
            </div>

            <div className="form__group floating">
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder=" "
                rows="5"
                required
              />
              <label htmlFor="message">{t("contact.form.message")}</label>
            </div>

            <button type="submit" className="form__button">
              {t("contact.form.send")} <Send size={20} />
            </button>

            {status === "success" && (
              <p className="form__message form__message--success">
                {t("contact.form.success")}
              </p>
            )}
            {status === "error" && (
              <p className="form__message form__message--error">
                {t("contact.form.error")}
              </p>
            )}
          </form>

          {/* Contact Info */}
          <div className="contact__info">
            <div className="contact__item">
              <Mail size={32} className="contact__icon" />
              <div>
                <h3>{t("contact.email")}</h3>
                <a href="mailto:info@pakhlavon.dev">info@pakhlavon.dev</a>
              </div>
            </div>

            <div className="contact__item">
              <Phone size={32} className="contact__icon" />
              <div>
                <h3>{t("contact.phone")}</h3>
                <a href="tel:+998949941763"> +998 (94) 994 17 63</a>
              </div>
            </div>

            <div className="contact__item">
              <Send size={32} className="contact__icon" />
              <div>
                <h3>Telegram</h3>
                <a href="https://t.me/pahlavon_kh">pakhlavon_kh</a>
              </div>
            </div>

            <div className="contact__item">
              <Instagram size={32} className="contact__icon" />
              <div>
                <h3>Instagram</h3>
                <a href="https://www.instagram.com/pakhlavon_kh/">
                  pakhlavon_kh
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
