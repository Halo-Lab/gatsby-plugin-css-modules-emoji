
let emojisList = require('emojis-list');

const regExpChromeIncompatible = '([©️🦼🧮🟢☹️*⃣0⃣1⃣2⃣3⃣4⃣5⃣6⃣7⃣8⃣9⃣])';
const regExpZWJ = '([\u200B-\u200D\uFEFF])';
const regExpFlags = '([\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF])';
const regExpLetters = '([\uD83C][\uDDE6-\uDDFF])';

const emojisIdentList = [];
const indentList = {};
let currentId = 0;

emojisList = emojisList.filter(emoji => (
  !emoji.match(new RegExp(`${regExpZWJ}|${regExpFlags}|${regExpLetters}|${regExpChromeIncompatible}`, 'g'))
));

function randomEmoji(length, emojisList) {
  let result = '';

  for (let i = 0; i < length; i++) {
    result += emojisList[Math.floor(Math.random() * emojisList.length)];
  }

  return result;
}

function emojiiIdent(path, localName, selectorLength = 3) {
  if(indentList[`${path}_${localName}`]) {
    return indentList[`${path}_${localName}`]
  }

  let randomEmojii = randomEmoji(selectorLength, emojisList);

  while (emojisIdentList.includes(randomEmojii)) {
    randomEmojii = randomEmoji(selectorLength, emojisList);
  }

  emojisIdentList.push(randomEmojii);
  indentList[`${path}_${localName}`] = randomEmojii;

  return `${randomEmojii}`;
}

exports.onCreateWebpackConfig = (
  { actions, getConfig, stage },
  { enableOnDevelopment = true, selectorLength }
) => {
  if (!enableOnDevelopment && stage.startsWith(`develop`)) {
    return
  }
  if(selectorLength < 3 || selectorLength > emojisList.length) {
    throw new Error(`Plugin 'gatsby-plugin-css-modules-emoji' Incorrect settings: selectorLength should be in range 3-${emojisList.length} emojis`)
  }

  const config = getConfig()
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

  for (let { oneOf } of rules) {
    for (let { use } of oneOf) {
      if (!use) continue
      for (let { options } of use) {
        if (!options || !options.localIdentName) continue
        options.getLocalIdent = (context, localIdentName, localName, options) => {
          const path = context.resourcePath
          currentId++
          return emojiiIdent(path, localName, selectorLength)
        }
      }
    }
  }

  actions.replaceWebpackConfig(config)
}