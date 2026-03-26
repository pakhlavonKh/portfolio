import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    // Simulate form submission
    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <main>
      <section className="contact">
        <div className="contact__header">
          <h1 className="contact__title">{t('contact.title')}</h1>
          <p className="contact__subtitle">{t('contact.subtitle')}</p>
        </div>

        <div className="contact__container">
          {/* Contact Info */}
          <div className="contact__info">
            <div className="contact__item">
              <Mail size={32} className="contact__icon" />
              <div>
                <h3>{t('contact.email')}</h3>
                <a href="mailto:pakhlavon.khamidov@gmail.com">
                  pakhlavon.khamidov@gmail.com
                </a>
              </div>
            </div>

            <div className="contact__item">
              <Phone size={32} className="contact__icon" />
              <div>
                <h3>{t('contact.phone')}</h3>
                <a href="tel:+998901234567">+998 (90) 123-45-67</a>
              </div>
            </div>

            <div className="contact__item">
              <MapPin size={32} className="contact__icon" />
              <div>
                <h3>{t('contact.location')}</h3>
                <p>Tashkent, Uzbekistan</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="form__group">
              <label htmlFor="name">{t('contact.form.name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('contact.form.namePlaceholder')}
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="email">{t('contact.form.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('contact.form.emailPlaceholder')}
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="subject">{t('contact.form.subject')}</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder={t('contact.form.subjectPlaceholder')}
              />
            </div>

            <div className="form__group">
              <label htmlFor="message">{t('contact.form.message')}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('contact.form.messagePlaceholder')}
                rows="6"
                required
              />
            </div>

            <button type="submit" className="form__button">
              {t('contact.form.send')} <Send size={20} />
            </button>

            {status === 'success' && (
              <p className="form__message form__message--success">
                {t('contact.form.success')}
              </p>
            )}
            {status === 'error' && (
              <p className="form__message form__message--error">
                {t('contact.form.error')}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}

export default Contact;
