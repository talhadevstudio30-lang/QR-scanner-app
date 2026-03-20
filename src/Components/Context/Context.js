import { createContext } from 'react';

export const counterContext = createContext({
  history: [],
  setHistory: () => {},
  deleteHistoryItem: () => {},
  History_Info_Button: () => {},
  selectedHistoryItem: null,
});
