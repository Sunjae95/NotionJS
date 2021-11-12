export const createElement = (tagName, className) => {
  const res = document.createElement(`${tagName}`);
  res.className = `${className}`;
  return res;
};
