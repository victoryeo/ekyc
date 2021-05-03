const Web3 = require('web3')
const path = require('path')
const wlt = require('ethereumjs-wallet').default;

let contractABI = require(path.join(__dirname, '../build/contracts/eKYC.json'))

const node1 = new Web3.providers.HttpProvider("http://localhost:22000");
const web3_1 = new Web3(node1);
const node5 = new Web3.providers.HttpProvider("http://localhost:22004");
const web3_5 = new Web3(node5);

//console.log(web3.version)
//console.log(contractABI.bytecode)

const deploy = async () => {
    const accounts1 =  await web3_1.eth.getAccounts();
    console.log('Attempt to deploy from account', accounts1[0]);

    const accounts5 =  await web3_5.eth.getAccounts();
    console.log('Attempt to deploy from account', accounts5[0]);

    console.log(await web3_5.eth.getGasPrice())
    
    //var nodekey = '1be3b50b31734be48452c29d714941ba165ef0cbf3ccea8ca16c45e3d8d45fb0';
    //var wallet = wlt.fromPrivateKey(Buffer.from(nodekey, 'hex'));
    //console.log('wallet addr: ' + wallet.getAddressString());

    var kycContract_1 = await new web3_1.eth.Contract(
        contractABI.abi
        //{
          //from: accounts[0], // default from address
          //gasPrice: '0', // default gas price in wei, 20 gwei in this case
          //privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]
        //}
    )  
    .deploy({ data: contractABI.bytecode, arguments: [0] })
    .send({
        from: accounts1[0],
        gas: 1500000,
        gasPrice: '0',
        privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="],
            // this is public key from tm7 of 7node Quorum samples
        PrivacyFlag: 3
    })
    // contract is deployed between node 1 and node 7

    console.log('Contract deployed to ', kycContract_1._address);

    // node 5 can see the contract instance, but cannot access the contract
    var kycContract_5 = await new web3_5.eth.Contract(
        contractABI.abi, kycContract_1._address
    )

    console.log('Contract deployed to :', kycContract_5._address);

    //await kycContract.methods.addUserMetaData().send({
    //    from: accounts[0], privateFor: ["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="]})
    //await kycContract.methods.checkUserExistence(1, 123).send({
    //    from: accounts[0], gasPrice: '0', privateFor: ["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="]})
    //kycContract.getPastEvents('UserExist', {fromBlock: 0, toBlock: 'latest'}, {})
    //.then(function(events){
    //  console.log("then")
    //  console.log(events) // same results as the optional callback above
    //})

    await kycContract_1.methods.setUserKYC(39).send(
        {from: accounts1[0], privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc"], PrivacyFlag: 3})
    ret = await kycContract_1.methods.getUserKYC().estimateGas()
    console.log(ret)
    ret = await kycContract_1.methods.getUserKYC().call({from: accounts1[0], gas: 30000000, gasPrice: '0',})
    console.log(ret)
}
deploy();