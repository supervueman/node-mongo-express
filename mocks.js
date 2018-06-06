const faker = require(`faker`);
const models = require(`./models`);
const TurndownService = require(`turndown`);
const owner = `5b143651230d3e3ec00be519`;

module.exports = () => {
  models.Post.remove().then(() => {
    Array.from({length: 20}).forEach(() => {
      const turndownService = new TurndownService();
      models.Post.create({
        title: faker.lorem.words(5),
        body: turndownService.turndown(faker.lorem.words(100)),
        owner
      }).then(() => {
      }).catch(err => {
        console.log(err);
      })
    })
  }).catch(err => {
    console.log(err);
  });
}
