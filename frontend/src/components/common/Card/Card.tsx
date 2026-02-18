import React from "react";
import { Link } from "react-router-dom";
import styles from "./Card.module.css";
import { CardProps, VistoInTv } from '@types'; // Importi tutto da una riga sola

const Card: React.FC<CardProps> = ({ title, image, date, description, subtitle, slug, type, basePath }) => {
  return (
    <div className={`${styles.card} ${styles[type]}`}>
      <div className={styles.imageWrapper}>
        {image ? <img src={image} alt={title} /> : <div className={styles.placeholder}>Immagine non disponibile</div>}
        {/* Badge dinamico che cambia in base al tipo */}
        <span className={styles.badge}>{type.replace("_", " ")}</span>
      </div>

      <div className={styles.content}>
        {date && <span className={styles.date}>{new Date(date).toLocaleDateString("it-IT")}</span>}
        <h3 className={styles.title}>{title}</h3>
        {/* Se c'è un sottotitolo (es. il Comune), lo mostriamo qui */}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <p className={styles.description}>{description?.substring(0, 90)}...</p>

        <Link to={`${basePath}/${slug}`} className={styles.link}>
          Leggi di più
        </Link>
      </div>
    </div>
  );
};

export default Card;
