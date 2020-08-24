const BFactory = artifacts.require('BFactory');
const BPool = artifacts.require('BPool');
const Yes = artifacts.require('Yes');
const No = artifacts.require('No')
const Dai = artifacts.require('Dai')
module.exports = function(deployer) {
  deployer.deploy(Yes, 'Yes', 'YES', 18);
  deployer.deploy(No, 'No', 'NO', 18)
  deployer.deploy(Dai, 'Dai Stablecoin', 'DAI', 18)
  deployer.deploy(BFactory).then(function() {
    return deployer.deploy(BPool);
  });
};