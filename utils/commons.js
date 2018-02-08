const commons = module.exports;

commons.capitalizeFirstLetter = str => (
  str.charAt(0).toUpperCase() + str.slice(1)
);

commons.filterFalsies = arr => (
  arr.filter(Boolean)
);

commons.timing = hrend => (
  `${hrend[0]}s with ${(hrend[1] / 1000000).toFixed(3)}ms`
);

commons.linkTag = src => (
  `<link rel="stylesheet" type="text/css" href="${src}">`
);

commons.scriptTag = src => (
  `<script src="${src}" type="text/javascript" charset="utf-8" defer></script>`
);
