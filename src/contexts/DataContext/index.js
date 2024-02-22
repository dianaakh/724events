import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  // Ajout de l'état pour stocker le dernier événement
  const [last, setLast] = useState(null); 

  const getData = useCallback(async () => {
    try {
      const eventData = await api.loadData();
      setData(eventData);

      if (Array.isArray(eventData.events) && eventData.events.length > 0) {
        // Tri des événements par date pour récupérer le dernier événement
        const sortedEvents = eventData.events.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLast(sortedEvents[0]);
      }
    } catch (err) {
      setError(err);
    }
  }, []);


  useEffect(() => {
    if (data) return;
    getData();
  }, [data, getData]);

  const contextValue = useMemo(() => ({ data, last, error }), [data, last, error]);

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={contextValue}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
