const Listing = require("../modal/index");
const bulk = require("./data");
const mbxClient = require('@mapbox/mapbox-sdk');
const mbgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken="pk.eyJ1Ijoic2hhcmFkc2luZ2hjaGEtY3MyMiIsImEiOiJjbHI4cXlseGsyZ3VpMmtwbmpwamE1bDNwIn0.s2xcZq-7mZ71CNpimlNP_A";
const baseClient = mbxClient({ accessToken: mapToken });
const geocodingClient= mbgeocoding(baseClient);


async function initdb() {
  await Listing.deleteMany({});
  let data=bulk.data;
  let finaldata=data.map((data)=>{
    return({...data,owner:"659921c30e7bbc29c61f4f01"});
  });

  // finaldata=finaldata.map(async(data)=>{
    let newdata=[];
    for(fdata of finaldata){

    let match = await geocodingClient.forwardGeocode({
      query: fdata.location,
      limit: 1
    }).send() 
    fdata.geometry=match.body.features[0].geometry;
    fdata.category=["Rooms"];

    newdata.push(fdata);
    }
  // })
    console.log(finaldata);

  await Listing.insertMany(finaldata);
  console.log("done");
};
initdb();


