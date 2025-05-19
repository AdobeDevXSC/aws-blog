export default async function decorate(block) {
  console.log("featured-articles block: ", block);

  const links = block.querySelectorAll('a');

  for (const link of links) {
    const url = link.href;

    try {
      const metadata = await fetchMetadata(url);
      if (metadata) {
        const card = createCard(metadata, url);
        link.closest('.button-container').replaceWith(card);
      }
    } catch (err) {
      console.error(`Error fetching metadata for ${url}:`, err);
    }
  }
}

async function fetchMetadata(url) {
  const response = await fetch(url);

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const title = doc.querySelector('meta[property="og:title"]')?.content || doc.title;
  const description = doc.querySelector('meta[name="description"]')?.content ||
                      doc.querySelector('meta[property="og:description"]')?.content || '';
  const image = doc.querySelector('meta[property="og:image"]')?.content || '';

  return { title, description, image };
}

function createCard({ title, description, image }, url) {
  const card = document.createElement('div');
  card.className = 'featured-article-card';
  card.innerHTML = `
    <a href="${url}" class="card-link" target="_blank" rel="noopener noreferrer">
      <div class="card-image">${image ? `<img src="${image}" alt="${title}"/>` : ''}</div>
      <div class="card-content">
        <h3>${title}</h3>
        <p>${description}</p>
      </div>
    </a>
  `;
  return card;
}