import React, { useEffect, useRef, useState } from "react";
import { Laptop, Network, Database } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

function Expertise() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();  
        }
      },
      { threshold: 0.2 } 
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`expertise ${isVisible ? "in-view" : ""}`}
      id="expertise"
    >
      
      <h2 className="expertise__title">
        <Trans i18nKey="title">
          My <span>Expertise</span>
        </Trans>
      </h2>

      <div className="expertise__cards">
        <div className="expertise__card expertise__card--1">
          <div className="expertise__headline">
            <Laptop className="expertise__icon" title="Laptop / Coding" strokeWidth={1.2} />
            <h3>
              <Trans i18nKey="cards.software.title">
                Software <span>Development</span>
              </Trans>
            </h3>
          </div>
          <div className="expertise__text">
            <p>
              {t("cards.software.text")}
            </p>
          </div>
        </div>

        <div className="expertise__card expertise__card--2">
          <div className="expertise__headline">
            <Network className="expertise__icon" title="Network" strokeWidth={1.2} />
              
            <h3>
              <Trans i18nKey="cards.fullstack.title">
                Full Stack <span>Development</span>
              </Trans>
            </h3>
          </div>
          <div className="expertise__text">
            <p>{t("cards.fullstack.text")}</p>
          </div>
        </div>

        <div className="expertise__card expertise__card--3">
          <div className="expertise__headline">
            <Database className="expertise__icon" title="Database" strokeWidth={1.2} />
            <h3>
              <Trans i18nKey="cards.database.title">
                Database <span>Systems</span>
              </Trans>
            </h3>
          </div>
          <div className="expertise__text">
            <p>
              {t("cards.database.text")}
            </p>
          </div>
        </div>
      </div>

      <div className="expertise__image-container">
        <img src="/src/assets/binary.png" alt="binary code" className="expertise__image" />
      </div>
    </section>
  );
}

export default Expertise;
