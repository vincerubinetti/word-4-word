import dictionaryFile from "./dictionary.yaml";
import parsFile from "./pars.dat";
import { Word, wordsLinked } from "./word";

// pause for specified time to let browser re-paint view and keep smooth
const sleep = (ms = 0) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

// load dictionary and pars
export const loadData = async () => {
  // load dictionary, discarding obscure words
  const dictionary = await parseDictionary(dictionaryFile);

  // load pars matrix
  const pars = await parsePars(
    new Uint8Array(await (await fetch(parsFile)).arrayBuffer()),
    dictionary
  );

  return { dictionary, pars };
};

// transform data from dictionary file into more convenient structure
const parseDictionary = async (dictionary) => {
  // transform map to list of objects and discard obscure words
  dictionary = Object.entries(dictionary)
    .map(([text, type], index) => new Word(text, type, index))
    .filter(({ type }) => type < 3);

  // link dictionary words together
  for (let x = 0; x < dictionary.length; x++) {
    if (x % 50 === 0) await sleep(); // throttle
    for (let y = 0; y < dictionary.length; y++) {
      if (x < y) {
        if (wordsLinked(dictionary[x], dictionary[y])) {
          dictionary[x].links.push(dictionary[y]);
          dictionary[y].links.push(dictionary[x]);
        }
      }
    }
  }

  return dictionary;
};

// transform data from pars file into more convenient structure
export const parsePars = async (matrix, dictionary) => {
  // get dictionary of just regular words
  dictionary = dictionary.filter(({ type }) => type === 1);

  // group pairs of words into bins by par value
  const pars = {};
  let index = 0;
  for (let x = 0; x < dictionary.length; x++) {
    if (x % 50 === 0) await sleep(); // throttle
    for (let y = 0; y < dictionary.length; y++) {
      if (x < y) {
        const par = matrix[index];
        index++;
        if (!pars[par]) pars[par] = [];
        pars[par].push([dictionary[x], dictionary[y]]);
      }
    }
  }

  // change 0 par to the infinity it truly represents from c++ script
  pars["∞"] = pars["0"];
  delete pars["0"];

  return pars;
};
