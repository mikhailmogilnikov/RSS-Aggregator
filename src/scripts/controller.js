/* eslint-disable no-param-reassign */

import * as yup from 'yup';
import axios from 'axios';
import domElements from '../utils/domElements.js';
import strings from '../utils/strings.js';
import {
  allOriginsUrl,
  checkPostsChanges,
  normalizeUrl,
  parseRss,
  parseXML,
} from './utilities.js';
import parsedData from '../utils/parsedData.js';

const schema = yup.string().required('this is a required field').url();

const feedsWatcher = (watchedState) => {
  const requests = parsedData.feeds.map((feed) => axios
    .get(allOriginsUrl(feed.url))
    .then((response) => {
      const rssDocument = parseXML(response);
      const changes = checkPostsChanges(rssDocument, feed.id);
      console.log(changes);
      if (changes.length > 0) {
        console.log('change posts');
        parsedData.posts = [...changes, ...parsedData.posts];
        watchedState.updaterCounter += 1;
      }
    })
    .catch(() => {}));

  Promise.all(requests).then(() => {
    setTimeout(() => {
      feedsWatcher(watchedState);
    }, 5000);
  });
};

const request = (watchedState, normalizedValue) => {
  axios
    .get(allOriginsUrl(normalizedValue))
    .then((response) => {
      try {
        const rssDocument = parseXML(response);
        parseRss(rssDocument, normalizedValue);

        if (watchedState.feedList.length === 0) {
          setTimeout(() => {
            feedsWatcher(watchedState);
          }, 5000);
        }

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
