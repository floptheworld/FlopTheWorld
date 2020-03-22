export const postJSONData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getJSONData = async (url = "") => {
  const response = await fetch(url);
  return response.json();
};
