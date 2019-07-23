const moment = require('moment');
const database = require('../models/database');
const bot = require('../models/bot');

module.exports = async function Summary(body) {
  try {
    const { from } = body;
    if (!from) {
      throw new Error('Not found guest info');
    }
    const id = moment().format('DD-MM-YYYY');

    const orders = await database.Order.findAll({
      where: {
        day: id
      },
      raw: true
    });

    const sumMap = {};

    let total = 0;

    orders.forEach(order => {
      const key = `**${order.info.food.name}** (*${order.info.food.price}k`;
      sumMap[key] = sumMap[key] || [];
      sumMap[key].push(order);
      total += order.info.food.price;
    });

    const sum = Object.entries(sumMap).map(([name, items]) => {
      return `${name} x ${items.length} = ${items[0].info.food.price *
        items.length}k*):   ${items.map(i => i.info.guest.name)}`;
    });

    await bot.sendMessage(body.conversation.id, {
      text: `${sum.join('\n\n')} \n\n TOTAL: ${total}k`
    });
  } catch (e) {
    await bot.sendMessage(body.conversation.id, {
      text: `ERROR: ${e.message}`
    });
  }
};
