const Balance = require('../../schemas/balance');
const { Types } = require('mongoose');
module.exports = (client) => {
  client.fetchBalance = async (userId, guildId) => {
    let storedBalance = await Balance.findOne({
      userId: userId,
    });

    if (!storedBalance) {
      storedBalance = await new Balance({
        _id: Types.ObjectId(),
        userId: userId,
      });

      await storedBalance
        .save()
        .then(async (balance) => {
          console.log(`Balance Created: UserID: ${balance.userId}`);
        })
        .catch(console.error);
      return storedBalance;
    } else return storedBalance;
  };
};
