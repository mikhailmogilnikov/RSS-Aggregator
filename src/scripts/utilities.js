import _ from 'lodash';
import parsedData from '../utils/parsedData.js';

const normalizeUrl = (url) => url.trim().toLowerCase();

const allOriginsUrl = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
  url,
)}`;

const parseXML = (response) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(response.data.contents, 'text/xml');

  const isRSS = xmlDoc.querySelector('rss') !== null;

  if (!isRSS) {
    throw new Error('not a RSS document');
  }

  return xmlDoc;
};

const parseRss = (rssDocument, url) => {
  const items = rssDocument.querySelectorAll('item');

  const feedId = _.uniqueId('feed_');

  items.forEach((item) => {
    const title = item.querySelector('title');
    const description = item.querySelector('description');
    const link = item.querySelector('link');

    parsedData.posts.push({
      // id: _.uniqueId('item_'),
      feedId,
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
    });
  });

  const feedTitle = rssDocument.querySelector('title');
  const feedDesc = rssDocument.querySelector('description');

  parsedData.feeds.push({
    id: feedId,
    url,
    title: feedTitle.textContent,
    description: feedDesc.textContent,
  });
};

const checkPostsChanges = (rssDocument, feedId) => {
  const items = rssDocument.querySelectorAll('item');
  const feedPosts = parsedData.posts.filter((post) => post.feedId === feedId);

  return Array.from(items).reduce((acc, item) => {
    const title = item.querySelector('title');
    const description = item.querySelector('description');
    const link = item.querySelector('link');

    const isPostExist = feedPosts.find(
      (findPost) => findPost.title === title.textContent,
    );

    if (isPostExist === undefined) {
      return [
        ...acc,
        {
          feedId,
          title: title.textContent,
          description: description.textContent,
          link: link.textContent,
        },
      ];
    }

    return acc;
  }, []);
};

export {
  normalizeUrl, parseXML, parseRss, allOriginsUrl, checkPostsChanges,
};
