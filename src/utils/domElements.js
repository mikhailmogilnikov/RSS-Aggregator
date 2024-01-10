export default {
  form: {
    input: document.getElementById('url-input'),
    submit: document.querySelector('button[type="submit"]'),
    feedback: document.getElementById('form-feedback'),
  },
  lists: {
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  },
  modal: {
    title: document.querySelector('.modal-title'),
    description: document.querySelector('.modal-body.text-break'),
    link: document.querySelector('.btn.btn-primary.full-article'),
  },
};
