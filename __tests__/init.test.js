test('form exists', () => {
  const form = document.querySelector('form');
  console.log(form);
  expect(form).not.toBeUndefined();
});
