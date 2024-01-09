// @ts-check

import 'bootstrap';
import i18next from 'i18next';
import init from './init.js';
import './style.scss';
import resources from './utils/locales/index.js';

const i18nextInstance = i18next.createInstance();
i18nextInstance.init(
  {
    lng: 'ru',
    resources,
  },
  () => {
    init(i18nextInstance);
  },
);
