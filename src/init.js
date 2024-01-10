import view from './scripts/view.js';
import strings from './utils/strings.js';
import controller from './scripts/controller.js';

export default (locales) => {
  const state = {
    formState: strings.formStates.init,
    feedList: [],
    checkedPosts: [],
    feedback: null,
    updaterCounter: 0,
  };

  const watchedState = view(state, locales);

  controller(state, watchedState);
};
