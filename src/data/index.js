import { Word, linkWords, oneLetterDifferent } from "../util/word";

import regular from "./regular-dictionary.txt";
import special from "./special-dictionary.txt";
import pars from "./pars.dat";

export const loadData = async () => {
  // fetch data
  let [regular, special, pars] = Promise.all([
    getRegularDictionary(),
    getSpecialDictionary(),
    getPars(),
  ]);

  regular = parseDictionary(regular, "regular");
  special = parseDictionary(special, "special");
  const dictionary = [...regular, ...special];
  linkDictionary(dictionary);
  pars = pars.map((par) => parsePar(par, regular));
  pars = [null, null, null, ...pars];
  return { dictionary, pars };
};

// fetch dictionary of regular words
const getRegularDictionary = async () => (await fetch(regular)).text();

// fetch dictionary of special words
const getSpecialDictionary = async () => (await fetch(special)).text();

// fetch matrix of pars
const getPars = async () => (await fetch(pars)).arrayBuffer();

const parseDictionary = (dictionary, type) =>
  dictionary
    .split("\n")
    .map((word) => word.trim())
    .filter((word) => word)
    .map((word, index) => new Word(word, index, type));

const linkDictionary = (dictionary) => {
  for (const wordA of dictionary) {
    for (const wordB of dictionary) {
      if (oneLetterDifferent(wordA, wordB)) linkWords(wordA, wordB);
    }
  }
  return dictionary;
};

const parsePar = (par, dictionary) => {
  const pairs = [];
  if (par) {
    window.localStorage.test = btoa(
      String.fromCharCode(...new Uint8Array(par))
    );
    const bytes = new Uint16Array(par);
    for (let index = 0; index < bytes.length; index += 2)
      pairs.push([dictionary[bytes[index]], dictionary[bytes[index + 1]]]);
  }
  return pairs;
};
