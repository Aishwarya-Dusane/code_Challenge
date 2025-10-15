import React from 'react';
import FruitBookPanel from './panels/FruitBookPanel';
import AboutPanel from './panels/AboutPanel';
import { FruitViewPanel } from './panels/FruitViewPanel';
import { MESSAGES } from "./components/constants/messages";

export const panelList = [
  { key: MESSAGES.FRUIT_BOOK, title: 'Fruit Book', content: <FruitBookPanel /> },
  { key: MESSAGES.FRUIT_VIEW, title: 'Fruit View', content: <FruitViewPanel /> },
  { key: MESSAGES.ABOUT, title: MESSAGES.ABOUT, content: <AboutPanel /> },
];
