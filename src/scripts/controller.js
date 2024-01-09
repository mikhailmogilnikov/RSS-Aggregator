/* eslint-disable no-param-reassign */

import * as yup from 'yup';
import axios from 'axios';
import domElements from '../utils/domElements.js';
import strings from '../utils/strings.js';
import { normalizeUrl, parseRss, parseXML } from './utilities.js';

const schema = yup.string().required('this is a required field').url();

const request = (watchedState, normalizedValue) => {
  axios
    .get(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
        normalizedValue,
      )}`,
    )
    .then((response) => {
      try {
        const rssDocument = parseXML(response);
        parseRss(rssDocument);

        watchedState.feedList.push(domElements.form.input?.value);
        watchedState.feedback = strings.feedback.loaded;
        watchedState.formState = strings.formStates.init;

        domElements.form.input.value = '';
        domElements.form.input?.focus();
      } catch {
        watchedState.formState = strings.formStates.invalid;
        watchedState.feedback = strings.feedback.invalidRss;
        domElements.form.input?.focus();
      }
    })
    .catch((error) => {
      console.log(error);
      watchedState.formState = strings.formStates.invalid;
      watchedState.feedback = strings.feedback.networkError;
      domElements.form.input?.focus();
    });
};

export default (state, watchedState) => {
  domElements.form.submit.addEventListener('click', (e) => {
    e.preventDefault();

    const normalizedValue = normalizeUrl(domElements.form.input.value);

    if (state.feedList.includes(normalizedValue)) {
      watchedState.formState = strings.formStates.invalid;
      watchedState.feedback = strings.feedback.exists;
    } else {
      schema
        .validate(normalizedValue)
        .then(() => {
          watchedState.formState = strings.formStates.sending;
          request(watchedState, normalizedValue);
        })
        .catch(() => {
          watchedState.formState = strings.formStates.invalid;
          watchedState.feedback = strings.feedback.invalidValidation;
          domElements.form.input?.focus();
        });
    }
  });
};
