const Listing = require("../modal/index");
const bulk = require("./data");


async function initdb() {
  await Listing.deleteMany({});
  await Listing.insertMany(bulk.data);
};
initdb();


