const Web3 = require('web3')
const path = require('path')
const wlt = require('ethereumjs-wallet');

let contractABI = require(path.join(__dirname, '../build/contracts/eKYC.json'))

const provider = new Web3.providers.HttpProvider("http://localhost:22000");
const web3 = new Web3(provider);

//console.log(web3.version)
//console.log(contractABI.bytecode)

const deploy = async () => {
    const accounts =  await web3.eth.getAccounts();
    console.log('Attempt to deploy from account', accounts[0]);

    console.log(await web3.eth.getGasPrice())
    
    var kycContract = await new web3.eth.Contract(
        contractABI.abi,
        {
          from: accounts[0], // default from address
          gasPrice: '0', // default gas price in wei, 20 gwei in this case
          //privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]
        }
    )  
    .deploy({ data: contractABI.bytecode, arguments: [0] })
    .send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: '0',
        privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]
            // this is public key from 7node Quorum samples
    })

    console.log('Contract deployed to ', kycContract);

    await kycContract.methods.startUserKYC().send({from: accounts[0], gasPrice: '0'})
    await kycContract.methods.addUserMetaData().send({
        from: accounts[0], privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]})
    await kycContract.methods.checkUserExistence(1, 123).send({
        from: accounts[0], gasPrice: '0', privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]})
    kycContract.getPastEvents('UserExist', {fromBlock: 0, toBlock: 'latest'}, {})
    .then(function(events){
      console.log("then")
      console.log(events) // same results as the optional callback above
    })
}
deploy();