const eKYC = artifacts.require("eKYC");

module.exports = function(deployer) {
  deployer.deploy(eKYC, 0, {privateFor:
    // this is public key from tm7 of 7node Quorum samples
    ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]
  });
};
