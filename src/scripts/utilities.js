import _ from 'lodash';
import parsedData from '../utils/parsedData.js';

const normalizeUrl = (url) => url.trim().toLowerCase();

const parseXML = (response) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(response.data.contents, 'text/xml');

  const isRSS = xmlDoc.querySelector('rss') !== null;

  if (!isRSS) {
    throw new Error('not a RSS document');
  }

  return parser.parseFromString(response.data.contents, 'text/xml');
};

const parseRss = (rssDocument) => {
  const items = rssDocument.querySelectorAll('item');
  items.forEach((item) => {
    const title = item.querySelector('title');
    const description = item.querySelector('description');
    const link = item.querySelector('link');

    parsedData.posts.push({
      id: _.uniqueId('item_'),
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
    });
  });

  const feedTitle = rssDocument.querySelector('title');
  const feedDesc = rssDocument.querySelector('description');

  parsedData.feed.push({
    id: _.uniqueId('feed_'),
    title: feedTitle.textContent,
    description: feedDesc.textContent,
  });
};

export { normalizeUrl, parseXML, parseRss };
