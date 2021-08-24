// word object
export class Word {
  constructor(text, type, index) {
    // actual text string of the word
    this.text = text;

    // how common the word is
    this.type = type;

    // index where word is located in ordered dictionary
    this.index = index;

    // links to words that are one letter different to this word
    this.links = [];
  }
}

// check if two word objects are exactly one letter different
export const wordsLinked = (wordA, wordB) =>
  oneLetterDifferent(wordA.text, wordB.text);

// check if two word strings are exactly one letter different
export const oneLetterDifferent = (stringA, stringB) => {
  let diff = 0;
  for (let char = 0; char < 4; char++) {
    if (stringA[char] !== stringB[char]) diff++;
    if (diff > 2) return false;
  }

  return diff === 1;
};

// find shortest path between two words using breadth-first search
export const findPath = (wordA, wordB) => {
  // store of explored and previous nodes
  const explored = {};
  const previous = {};

  // start at first word
  const list = [wordA];
  explored[wordA.index] = true;

  // run search
  while (list.length > 0) {
    // get next nodes to explore
    let word = list.shift();
    let links = word.links;

    // only use nodes that are from regular dictionary
    links = links.filter((link) => link.type === 1);

    // explore nodes
    for (const link of links) {
      // if we found end word, reverse-assemble path and return
      if (link === wordB) {
        const path = [link];
        while (word) {
          path.push(word);
          word = previous[word.index];
        }
        path.reverse();
        return path;
      }
      // otherwise mark explored and move on
      else if (!explored[link.index]) {
        list.push(link);
        explored[link.index] = true;
        previous[link.index] = word;
      }
    }
  }

  return [];
};
