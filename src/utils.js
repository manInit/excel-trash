const rgb2hex = (rgb) =>
  `${rgb
    .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    .slice(1)
    .map((n) => parseInt(n, 10).toString(16).toUpperCase().padStart(2, "0"))
    .join("")}`;

export {
  rgb2hex
}