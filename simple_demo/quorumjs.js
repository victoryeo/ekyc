const Web3 = require("web3");
const quorumjs = require("quorum-js");
const path = require('path')

const web3 = new Web3("http://localhost:22000");

quorumjs.extend(web3);

let contractABI = require(path.join(__dirname, '../build/contracts/eKYC.json'))

const simpleContract = new web3.eth.Contract(contractABI.abi);

const bytecodeWithInitParam = simpleContract
  .deploy({ data: contractABI.bytecode, arguments: [0] })
  .encodeABI();

const rawTransactionManager = quorumjs.RawTransactionManager(web3, {
  privateUrl: "http://localhost:9081"
});  

const accAddress = "ed9d02e382b34818e88b88a309c7fe71e65f419d";

const signAcct = web3.eth.accounts.decrypt(
    {
      address: accAddress,
      crypto: {
        cipher: "aes-128-ctr",
        ciphertext:
          "4e77046ba3f699e744acb4a89c36a3ea1158a1bd90a076d36675f4c883864377",
        cipherparams: { iv: "a8932af2a3c0225ee8e872bc0e462c11" },
        kdf: "scrypt",
        kdfparams: {
          dklen: 32,
          n: 262144,
          p: 1,
          r: 8,
          salt: "8ca49552b3e92f79c51f2cd3d38dfc723412c212e702bd337a3724e8937aff0f"
        },
        mac: "6d1354fef5aa0418389b1a5d1f5ee0050d7273292a1171c51fd02f9ecff55264"
      },
      id: "a65d1ac3-db7e-445d-a1cc-b6c5eeaa05e0",
      version: 3
    },
    ""
  );

web3.eth.getTransactionCount(`0x${accAddress}`).then(txCount => {
    console.log(txCount)
    const newTx = rawTransactionManager.sendRawTransaction({
      gasPrice: 0,
      gasLimit: 4300000,
      value: 0,
      data: bytecodeWithInitParam,
      from: signAcct,
      isPrivate: true,
      privateFrom: "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=",
      privateFor: ["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="],
      nonce: txCount
    });
    newTx
    .then(tx => {
      console.log("Contract address: ", tx.contractAddress);
      const simpleContract2 = new web3.eth.Contract(contractABI.abi, tx.contractAddress);
      simpleContract2.methods
        .getUserNID()
        .call({from: accAddress})
        .then(res => console.log(`result ${res}`))
        .catch(console.log);
      extendCon(tx.contractAddress);  
      return simpleContract2;
    })
    .catch(console.log);
});

const methods = [
	{
		name: 'approveExtension',
		call: 'quorumExtension_approveExtension',
		params: 3,
		inputFormatter: [web3.extend.formatters.inputAddressFormatter, null, web3.extend.formatters.inputTransactionFormatter]
	},
	{
		name: 'extendContract',
		call: 'quorumExtension_extendContract',
		params: 4,
		inputFormatter: [web3.extend.formatters.inputAddressFormatter, null, web3.extend.formatters.inputAddressFormatter, web3.extend.formatters.inputTransactionFormatter]
	},
	{
		name: 'cancelExtension',
		call: 'quorumExtension_cancelExtension',
		params: 2,
		inputFormatter: [web3.extend.formatters.inputAddressFormatter, web3.extend.formatters.inputTransactionFormatter]
	},
	{
		name: 'getExtensionStatus',
		call: 'quorumExtension_getExtensionStatus',
		params: 1,
		inputFormatter: [web3.extend.formatters.inputAddressFormatter]
	},
	{
		name: 'activeExtensionContracts',
		call: 'quorumExtension_activeExtensionContracts',
		params: 0
	}
];

web3.extend({
  property: 'quorumExtension',
  methods
});

const extendCon = async (contractAddress) => {
  let kk = await web3.quorumExtension.activeExtensionContracts()
  console.log(kk)

  await web3.quorumExtension.extendContract(
    contractAddress,
    "R56gy4dn24YOjwyesTczYa8m5xhP6hF2uTMCju/1xkY=",
    "0x0638e1574728b6d862dd5d3a3e0942c3be47d996",
    {"from":accAddress,
     "value":"0x0",
     "privateFor":["R56gy4dn24YOjwyesTczYa8m5xhP6hF2uTMCju/1xkY="],
     "privacyFlag":1
    }
  )
}
 
