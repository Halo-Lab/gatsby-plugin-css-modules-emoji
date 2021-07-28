# gatsby-plugin-css-modules-emoji 

Replace CSS Modules Class selectors by Emojis. `Supports Gatsby v3`

![emoji selectors](https://i.ibb.co/RPxfpP8/gatsby-plugin-emojis.png)

> ⚠️ Applies only while using CSS Modules.

The plugin will create a unique emoji combination for each CSS selector. Compatible with Official Gatsby Sass/Scss and Less plugins.

## Install

`npm install --save gatsby-plugin-css-modules-emoji`

## How to use

Add plugin to the end of your `gatsby-config.js` file. **If you're using Sass/Scss or Less plugin be sure that this plugin comes after them**.

```javascript
module.exports = {
  plugins: [
    `gatsby-plugin-css-modules-emoji`
  ],
}
```

If you want to configure the plugin, take a look at available options below:

> ⚠️ Any changes require the server be restarted.

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-css-modules-emoji`,
      options: {
        enableOnDevelopment: true, 
        selectorLength: 7, // min selector length is 3 emojis
      },
    },
  ],
}
```

## Options

* `enableOnDevelopment` - allows you to disable Emoji selectors while in develop mode. The default value is **true**.

* `selectorLength` - define selector length. The default and minimum required length is **3 emojis**.

## Browser support 

Some of emojis filtered due to Chrome support. Were excluded:

- Emojis that includes ZWJ ([What does ZWJ stand for?](https://en.wikipedia.org/wiki/Zero-width_joiner))
- Flags 
- Letter symbols
- Other emojis that displayed incorrectly in Chrome DevTools
