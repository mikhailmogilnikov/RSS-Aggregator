import * as yup from 'yup';
import view from './scripts/view.js';
import strings from './utils/strings.js';
import { normalizeUrl } from './scripts/utilities.js';
import domElements from './utils/domElements.js';

const schema = yup.string().required('this is a required field').url();

export default (locales) => {
  const state = {
    formState: strings.formStates.init,
    feedList: [],
    feedback: null,
  };

  const watchedState = view(state, locales);

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

          watchedState.feedList.push(domElements.form.input?.value);
          watchedState.feedback = strings.feedback.loaded;
          watchedState.formState = strings.formStates.init;

          domElements.form.input.value = '';
          domElements.form.input?.focus();
        })
        .catch(() => {
          watchedState.formState = strings.formStates.invalid;
          watchedState.feedback = strings.feedback.invalidValidation;
        });
    }
  });
};
