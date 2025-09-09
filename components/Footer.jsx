import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTelegram, faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer" id="contacts">
      <div className="footer__text">
        <h2>{t("footer.title")}</h2>
        <p>{t("footer.description")}</p>
      </div>
      <div className="footer__links">
        <a href="mailto:76khwmidiv@gmail.com" target="_blank">76khwmidov@gmail.com</a>
        <div className="footer__links-icons">
          <a href="https://github.com/pakhlavonKh" target="_blank"><FontAwesomeIcon icon={faGithub} /></a>
          <a href="https://t.me/pahlavon_kh" target="_blank"><FontAwesomeIcon icon={faTelegram} /></a>
          <a href="https://wa.me/qr/F2S7GI6TDZ5NN1" target="_blank"><FontAwesomeIcon icon={faWhatsapp} /></a>
          <a href="https://www.instagram.com/pakhlavon_kh?igsh=YzBkcDJ6b3NiMTNw" target="_blank"><FontAwesomeIcon icon={faInstagram} /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
