// tailwind config is required for editor support
const antdTw = require("tailwind-config/antd-tailwind.config.js")
module.exports = {
  ...antdTw,
  content: [
    './docs/**/*.tsx',
    './packages/ui/**/*.tsx'
  ],

}
