
let emojisList = require('emojis-list');

const regExpChromeIncompatible = '([©️🦼🧮🟢☹️*⃣0⃣1⃣2⃣3⃣4⃣5⃣6⃣7⃣8⃣9⃣])';
const regExpZWJ = '([\u200B-\u200D\uFEFF])';
const regExpFlags = '([\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF])';
const regExpLetters = '([\uD83C][\uDDE6-\uDDFF])';

const emojisIdentList = [];
const indentList = {};

emojisList = emojisList.filter(emoji => (
  !emoji.match(new RegExp(`${regExpZWJ}|${regExpFlags}|${regExpLetters}|${regExpChromeIncompatible}`, 'g'))
));

function randomEmojiIdent(length, emojisList) {
  let result = '';

  for (let i = 0; i < length; i++) {
    result += emojisList[Math.floor(Math.random() * emojisList.length)];
  }

  return result;
}

function emojiIdent(path, localName, selectorLength = 3) {
  if(indentList[`${path}_${localName}`]) {
    return indentList[`${path}_${localName}`]
  };

  let currentEmojiIdent = randomEmojiIdent(selectorLength, emojisList);

  while (emojisIdentList.includes(currentEmojiIdent)) {
    currentEmojiIdent = randomEmojiIdent(selectorLength, emojisList);
  }

  emojisIdentList.push(currentEmojiIdent);
  indentList[`${path}_${localName}`] = currentEmojiIdent;

  return `${currentEmojiIdent}`;
}

console.log(exports.onCreateWebpackConfig);

exports.onCreateWebpackConfig = (
  { actions, getConfig, stage },
  { enableOnDevelopment = true, selectorLength }
) => {
  if (!enableOnDevelopment && stage.startsWith(`develop`)) {
    return;
  }
  if(selectorLength < 3 || selectorLength > emojisList.length) {
    throw new Error(`Plugin 'gatsby-plugin-css-modules-emoji' Incorrect settings: selectorLength should be in range 3-${emojisList.length} emojis`);
  }

  const config = getConfig();

  const rules = config.module.rules.filter(({ oneOf }) =>
    oneOf &&
    Array.isArray(oneOf) &&
    oneOf.every(({ test }) =>
      '.css'.search(test) 
      || '.scss'.search(test) 
      || '.sass'.search(test) 
      || '.less'.search(test)
    )
  )

  const getLocalIdent = (context, _, localName) => {
    const path = context.resourcePath;

    return emojiIdent(path, localName, selectorLength);
  }

  for (let { oneOf } of rules) {
    for (let { use } of oneOf) {
      if (!use) continue;

      for (let { options } of use) {
        // css-loader <= v2.0.0
        if(!!options?.localIdentName) {
          options.getLocalIdent = getLocalIdent;
        }

        // css-loader >= v3.0.0
        if (!!options?.modules?.localIdentName) {
          options.modules.getLocalIdent = getLocalIdent;
        };
      };
    };
  };

  actions.replaceWebpackConfig(config);
}