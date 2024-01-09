// @ts-nocheck
import onChange from 'on-change';
import strings from '../utils/strings.js';
import domElements from '../utils/domElements.js';

const renderFormState = (value) => {
  if (value === strings.formStates.sending) {
    domElements.form.submit?.setAttribute('disabled', '');
    domElements.form.input?.setAttribute('disabled', '');
  } else {
    domElements.form.submit?.removeAttribute('disabled');
    domElements.form.input?.removeAttribute('disabled');
  }

  if (value === strings.formStates.invalid) {
    domElements.form.input?.classList.add('is-invalid');
  } else {
    domElements.form.input?.classList.remove('is-invalid');
  }
};

const renderFeedback = (value) => {
  switch (value) {
    case 'invalidValidation':
      domElements.form.feedback.textContent = 'Ссылка должна быть валидным URL';
      break;
    case 'invalidRss':
      domElements.form.feedback.textContent = 'Ресурс не содержит валидный RSS';
      break;
    case 'exists':
      domElements.form.feedback.textContent = 'RSS уже существует';
      break;
    case 'loaded':
      domElements.form.feedback.textContent = 'RSS успешно загружен';
      break;
    case null:
      domElements.form.feedback.textContent = '';
      break;
    default:
      throw new Error(value);
  }

  if (value === 'loaded') {
    domElements.form.feedback.classList.replace('text-danger', 'text-success');
  } else {
    domElements.form.feedback.classList.replace('text-success', 'text-danger');
  }
};

const renderFeedList = () => {};

const render = () => (path, value) => {
  switch (path) {
    case 'formState':
      renderFormState(value);
      break;
    case 'feedback':
      renderFeedback(value);
      break;
    case 'feedList':
      renderFeedList();
      break;
    default:
      throw new Error(`Error: unresolved path: ${path}`);
  }
};

export default (state) => onChange(state, render());
