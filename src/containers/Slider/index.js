import { useEffect, useState, useMemo } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  
  // Utilisation de useMemo pour calculer byDateAsc seulement lorsque data change
  const byDateAsc = useMemo(() => {
    return data?.focus?.sort((evtA, evtB) =>
      new Date(evtA.date) > new Date(evtB.date) ? 1 : -1
    ) || [];
  }, [data]);

  useEffect(() => {
    /* Utilisation de setInterval pour déclencher périodiquement 
    le changement de diapositive */
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % byDateAsc.length);
    }, 5000);

    // Nettoyage de l'intervalle lors du démontage du composant
    return () => clearInterval(interval);
  }, [byDateAsc]);

  // Fonction pour gérer les clics sur les points de pagination
  const handleBulletPointClick = (clickedIndex) => {
    setIndex(clickedIndex);
  };

  return (
    <div className="SlideCardList">
      {byDateAsc.map((event, idx) => (
        <div
          key={event.title}
          className={`SlideCard SlideCard--${index === idx ? "display" : "hide"
            }`}
        >
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateAsc.map((_, radioIdx) => (
            <input
            /* Utilisation d'une clé unique basée sur l'index */
              key={`radio-${radioIdx}`}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => { }}
              /* Gestion de l'événement onClick pour mettre à jour l'index */
              onClick={() => handleBulletPointClick(radioIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;

