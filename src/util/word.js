export class Word {
  constructor(word, index, type) {
    this.index = index;
    this.type = type;
    this.text = word;
    this.links = [];
  }
}

export const oneLetterDifferent = (wordA, wordB) => {
  if (wordA?.text)
    wordA = wordA.text;
  if (wordB?.text)
    wordB = wordB.text;

  if (!wordA || !wordB)
    return false;

  let diff = 0;
  for (let index = 0; index < 4; index++) {
    if (wordA[index] !== wordB[index])
      diff++;
  }

  return diff === 1;
};

export const linkWords = (wordA, wordB) => wordA.links.push(wordB);

export const findPath = (wordA, wordB, regular = true) => {
  const explored = {};
  const previous = {};

  const list = [wordA];
  explored[wordA.index] = true;

  while (list.length > 0) {
    let word = list.shift();
    let links = word.links;
    if (regular)
      links = links.filter((link) => link.type === 'regular');
    for (const link of links) {
      if (link === wordB) {
        const path = [link];
        while (word) {
          path.push(word);
          word = previous[word.index];
        }
        path.reverse();
        return path;
      } else if (!explored[link.index]) {
        list.push(link);
        explored[link.index] = true;
        previous[link.index] = word;
      }
    }
  }

  return [];
};
