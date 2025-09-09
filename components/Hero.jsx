import React from 'react';
import { useTranslation } from 'react-i18next';

function Hero() {
    const { t } = useTranslation();

    return (
        <section className="hero" id="hero">
            <div className="center">
                <h1 id="name">Khamidov Pakhlavon</h1>
                <h2 id="title">{t("hero__title")}</h2>
            </div>
            
            <a href="#expertise">
                <div className="mouse"></div>
            </a>
        </section>
    )

}

export default Hero;