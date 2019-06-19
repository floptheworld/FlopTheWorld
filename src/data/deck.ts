export const fetchDeck = async (): Promise<string[]> => {
  return new Promise(resolve => {
    fetch("../deck")
      .then(response => response.json())
      .then(body => {
        resolve(body);
      });
  });
};
