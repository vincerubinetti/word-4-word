import { useState, useEffect } from "react";

const toNumber = (value) =>
  value !== null && !Number.isNaN(Number(value)) ? Number(value) : value;
const get = (key) => toNumber(JSON.parse(localStorage.getItem(key)));
const set = (key, state) => localStorage.setItem(key, JSON.stringify(state));

export const useStorage = (defaultValue, key = "") => {
  const [state, setState] = useState(defaultValue);

  useEffect(() => {
    setState(get(key) || defaultValue);
  }, [defaultValue, key]);

  useEffect(() => {
    set(key, state);
  }, [key, state]);

  return [state, setState];
};
