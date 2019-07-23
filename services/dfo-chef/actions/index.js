const SetMenu = require('../actions/SetMenu');
const Menu = require('../actions/Menu');
const Order = require('../actions/Order');
const Cancel = require('../actions/Cancel');
const Summary = require('../actions/Summary');

module.exports = function handler(body) {
  const { type, text, channelId } = body;
  if (!text || type !== 'message' || channelId !== 'skype') {
    return;
  }
  const plainText = text.replace(/dfo-chef/g, '').trim();
  const setMenuMatch = plainText.match(/^set-menu\s+([\s\S]+)/im);
  const menuMatch = plainText.match(/^menu(\s+[\s\S]*)?/im);
  const orderMatch = plainText.match(/^order\s+([\s\S]+)$/im);
  const cancelMatch = plainText.match(/^cancel(\s\S)?/im);
  const summaryMatch = plainText.match(/^summary(\s\S)?/im);
  if (menuMatch) {
    Menu(body, menuMatch[1]);
  }
  if (setMenuMatch) {
    SetMenu(body, setMenuMatch[1]);
  }
  if (orderMatch) {
    Order(body, orderMatch[1]);
  }
  if (cancelMatch) {
    Cancel(body);
  }
  if (summaryMatch) {
    Summary(body);
  }
};
