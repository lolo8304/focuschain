

//event stuff
function listenEvent() {
var CarContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"damageState","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":true,"inputs":[],"name":"model","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[],"name":"getState","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":true,"inputs":[],"name":"customer","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"producer","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"ccm","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":true,"inputs":[],"name":"details","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"chassisNo","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"price","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[],"name":"receive","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_chassisNo","type":"string"},{"name":"_assemblyLine","type":"string"}],"name":"produce","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":true,"inputs":[],"name":"creationTime","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"assemblyLine","outputs":[{"name":"","type":"string"}],"type":"function"},{"inputs":[{"name":"_model","type":"string"},{"name":"_ccm","type":"uint8"},{"name":"_price","type":"uint8"},{"name":"_details","type":"string"},{"name":"_producer","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_producer","type":"address"},{"indexed":false,"name":"_customer","type":"address"},{"indexed":false,"name":"_modell","type":"string"},{"indexed":false,"name":"_ccm","type":"uint8"},{"indexed":false,"name":"_price","type":"uint8"}],"name":"Ordered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_producer","type":"address"},{"indexed":false,"name":"_customer","type":"address"},{"indexed":false,"name":"chassisNo","type":"string"}],"name":"Produced","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_producer","type":"address"},{"indexed":false,"name":"_customer","type":"address"}],"name":"Delivered","type":"event"}]);
    
var Address = "0xcd35DcB2B0f7f7C95aD6b9bD7777aa7c86a7BA9F";
var carContract = CarContract.at(Address);
    
var block = web3.eth.getBlock('latest').number;
carContract.Produced().watch(function(error, result) {
//if(result.blockNumber > block){
// Do something with the event
console.log("XXXXXXXXXXXXXXXXX" + JSON.stringify(result.args));
//}
});
};