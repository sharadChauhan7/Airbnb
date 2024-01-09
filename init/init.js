const Listing = require("../modal/index");
const bulk = require("./data");


async function initdb() {
  await Listing.deleteMany({});
  let data=bulk.data;
  let finaldata=data.map((data)=>{
    return({...data,owner:"659921c30e7bbc29c61f4f01"});
  });
  console.log(finaldata)
  await Listing.insertMany(finaldata);
};
initdb();


