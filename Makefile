develop:
	npx webpack serve

install:
	npm ci

build:
	NODE_ENV=production npx webpack

test:
	npm test

test-coverage:
	npx jest --coverage

lint:
	npx eslint .

.PHONY: test
