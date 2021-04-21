const Web3 = require('web3')
const contract = require('@truffle/contract')
const path = require('path')
const ipfsClient = require('ipfs-http-client')
const IPFS = require('ipfs')
const all = require('it-all')
const uint8ArrayFromString = require('uint8arrays/from-string')
const uint8ArrayConcat = require('uint8arrays/concat')

let contractABI = require(path.join(__dirname, '../build/contracts/eKYC.json'))
let provider = new Web3.providers.HttpProvider("http://localhost:22000")

let masterContract = contract(contractABI)
masterContract.setProvider(provider)

const web3 = new Web3()
web3.setProvider(provider)

let accounts

getAccount = async() => {
  accounts = await web3.eth.getAccounts()
  console.log(accounts)
}

getAccount()

routineKYC = async(instance) => {
  let data0 = await instance.getUserNID({from: accounts[0]})
  console.log("user Meta data")
  console.log(data0.toString())

  data0 = await instance.getUserMetaData({from: accounts[0]})
  console.log("user Meta data")
  console.log(data0.toString())
}

(async function() {
  const instance = await masterContract.deployed();
  console.log("contract address " + instance.address)
  instance.addUserMetaData({from: accounts[0]})
  await instance.checkUserExistence(1, 123, {from: accounts[0]})

  routineKYC(instance)

  instance.getUserKYCApproval({from: accounts[0]})
  instance.getPastEvents('UserExist', {}, {})
  .then(function(events){
    console.log("then")
    console.log(events) // same results as the optional callback above
  })

  instance.getPastEvents('UserApproval', { fromBlock: 0, toBlock: 'latest' }, {})
  .then(function(events){
    console.log("then")
    console.log(events) // same results as the optional callback above
  })

  console.log("KYC end")	

})()

const ipfs = ipfsClient({host:'ipfs.infura.io', port:'5001', protocol: 'https'})
let testBuffer = Buffer.alloc(100)
testBuffer = Buffer.from('Hello KYC')

routineIPFS = async() => {
  const node = await IPFS.create()
  try {
    // first method of add and get
    let result = await ipfs.add(testBuffer)
    console.log(result.cid)
    console.log("get file content")
    for await (const file of ipfs.get(result.cid)) {
      if (file.content) {
        const content = uint8ArrayConcat(await all(file.content))
        console.log("first method")
        console.log(content)
      }
    }

    // second method of add and get
    const file = await node.add({
      path: 'hello.txt',
      content: uint8ArrayFromString('Hello World 101')
    })
    console.log('Added file:', file.path, file.cid.toString())
    hash = file.cid
    for await (const file of node.get(hash)) {
      if (file.content) {
        const content = uint8ArrayConcat(await all(file.content))
        console.log(content)
      }
    }
    //const data = uint8ArrayConcat(await all(node.cat(file.cid)))
    //console.log('Added file contents:', data.toString())
  } catch (err) {
    console.log("Error IPFS", err)
  }
}


routineIPFS()
