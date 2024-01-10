import onChange from 'on-change';
import strings from '../utils/strings.js';
import domElements from '../utils/domElements.js';
import parsedData from '../utils/parsedData.js';

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

const renderFeedback = (value, locales) => {
  switch (value) {
    case 'empty':
      domElements.form.feedback.textContent = locales.t('feedback.empty');
      break;
    case 'invalidValidation':
      domElements.form.feedback.textContent = locales.t(
        'feedback.invalidValidation',
      );
      break;
    case 'invalidRss':
      domElements.form.feedback.textContent = locales.t('feedback.invalidRss');
      break;
    case 'networkError':
      domElements.form.feedback.textContent = locales.t(
        'feedback.networkError',
      );
      break;
    case 'exists':
      domElements.form.feedback.textContent = locales.t('feedback.exists');
      break;
    case 'loaded':
      domElements.form.feedback.textContent = locales.t('feedback.loaded');
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

const renderFeed = (locales) => {
  const feedWrapper = document.createElement('div');
  feedWrapper.classList.add('card', 'border-0');

  const feedTitleWrapper = document.createElement('div');
  feedTitleWrapper.classList.add('card-body');

  const feedTitleH4 = document.createElement('h4');
  feedTitleH4.classList.add('card-title', 'h4');
  feedTitleH4.textContent = locales.t('feedsTitle');

  const feedUl = document.createElement('ul');
  feedUl.classList.add('list-group', 'border-0', 'rounded-0');

  feedTitleWrapper.append(feedTitleH4);

  parsedData.feeds.forEach((feed) => {
    const feedLi = document.createElement('li');
    feedLi.classList.add('list-group-item', 'border-0', 'border-end-0');

    const feedH3 = document.createElement('h3');
    feedH3.classList.add('h6', 'm-0');
    feedH3.textContent = feed.title;

    const feedP = document.createElement('p');
    feedP.classList.add('m-0', 'small', 'text-black-50');
    feedP.textContent = feed.description;

    feedLi.append(feedH3, feedP);
    feedUl.append(feedLi);
  });

  feedWrapper.append(feedTitleWrapper, feedUl);

  domElements.lists.feeds.textContent = '';
  domElements.lists.feeds.append(feedWrapper);
};

const renderPosts = (locales, state) => {
  const postsWrapper = document.createElement('div');
  postsWrapper.classList.add('card', 'border-0');

  const postsTitleWrapper = document.createElement('div');
  postsTitleWrapper.classList.add('card-body');

  const postsTitleH4 = document.createElement('h4');
  postsTitleH4.classList.add('card-title', 'h4');
  postsTitleH4.textContent = locales.t('postsTitle');

  const postsUl = document.createElement('ul');
  postsUl.classList.add('list-group', 'border-0', 'rounded-0');

  postsTitleWrapper.append(postsTitleH4);

  parsedData.posts.forEach((post) => {
    const postLi = document.createElement('div');
    postLi.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const postLink = document.createElement('a');
    postLink.setAttribute('href', post.link);
    if (state.checkedPosts.includes(post.id)) {
      postLink.classList.add('fw-normal', 'link-secondary');
    } else {
      postLink.classList.add('fw-bold');
    }
    postLink.setAttribute('data-id', post.id);
    postLink.setAttribute('target', '_blank');
    postLink.setAttribute('rel', 'noopener noreferrer');
    postLink.textContent = post.title;

    const postButton = document.createElement('button');
    postButton.setAttribute('type', 'button');
    postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    postButton.setAttribute('data-id', post.id);
    postButton.setAttribute('data-bs-toggle', 'modal');
    postButton.setAttribute('data-bs-target', '#modal');
    postButton.textContent = locales.t('posts.button');
    postButton.addEventListener('click', () => {
      postLink.classList.remove('fw-bold');
      postLink.classList.add('fw-normal', 'link-secondary');

      state.checkedPosts.push(post.id);

      domElements.modal.title.textContent = post.title;
      domElements.modal.description.textContent = post.description;
      domElements.modal.link.setAttribute('href', post.link);
    });

    postLi.append(postLink, postButton);
    postsUl.append(postLi);
  });

  postsWrapper.append(postsTitleWrapper, postsUl);

  domElements.lists.posts.textContent = '';
  domElements.lists.posts.append(postsWrapper);
};

const renderNewFeed = (locales, state) => {
  renderFeed(locales);
  renderPosts(locales, state);
};

const render = (locales, state) => (path, value) => {
  switch (path) {
    case 'formState':
      renderFormState(value);
      break;
    case 'feedback':
      renderFeedback(value, locales);
      break;
    case 'updaterCounter' || 'checkedPosts':
      renderPosts(locales, state);
      break;
    case 'feedList':
      renderNewFeed(locales, state);
      break;
    default:
      throw new Error(`Error: unresolved path: ${path}`);
  }
};

export default (state, locales) => onChange(state, render(locales, state));
