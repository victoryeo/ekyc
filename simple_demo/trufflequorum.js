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

    // the contract address is from truffle deploy
    let contractAddress = '0x9d13C6D3aFE1721BEef56B55D303B09E021E27ab'
    var kycContract_1 = await new web3_1.eth.Contract(
        contractABI.abi, contractAddress)  
    //.deploy({ data: contractABI.bytecode, arguments: [0] })
    //.send({
    //    from: accounts[0],
    //    gas: 1500000,
    //    gasPrice: '0',
    //    privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]
            // this is public key from tm7 of 7node Quorum samples
    //})

    var kycContract_5 = await new web3_5.eth.Contract(
        contractABI.abi, contractAddress
    )

    console.log('Contract deployed to ', kycContract_5.methods);

    // the tx hash is from truffle deploy
    let ethhash = await web3_5.eth.getTransaction("0x7a7137294eafa09cbee1fdbf4c814e1dd1d8c7a07edd61a8cca5f5758aff47e1")
    console.log(ethhash)

    //await kycContract.methods.addUserMetaData().send({
    //    from: accounts[0], privateFor: ["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="]})
    //await kycContract.methods.checkUserExistence(1, 123).send({
    //    from: accounts[0], gasPrice: '0', privateFor: ["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="]})
    //kycContract.getPastEvents('UserExist', {fromBlock: 0, toBlock: 'latest'}, {})
    //.then(function(events){
    //  console.log("then")
    //  console.log(events) // same results as the optional callback above
    //})

    // contract is deployed on node 1 and for node 7
    await kycContract_1.methods.setUserKYC(39).send(
        {from: accounts1[0], privateFor: [], PrivacyFlag: 3})
    ret = await kycContract_5.methods.getUserKYC().estimateGas()
    console.log(ret)
    ret = await kycContract_1.methods.getUserKYC().call({from: accounts5[0], gas: 30000000, gasPrice: '0',})
    console.log(ret)
}
deploy();