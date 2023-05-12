require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
// require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */

// const ALCHEMY_API_KEY =

// const SEPOLIA_ACCOUNT_PRIVATE_KEY = 

module.exports = {
  // solidity: "0.8.18",

  solidity:{
    compilers:[
      {version: "0.8.18"},
      {version: "0.6.6"}
    ]
  },

  networks:{

    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
  },

    // sepolia:{
    //   url:`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    //   accounts:[`${SEPOLIA_ACCOUNT_PRIVATE_KEY}`],
    //   chainId : 11155111,
    //   blockConfirmation:6
    // }
  },

  // etherscan: {
  //   // Your API key for Etherscan
  //   // Obtain one at https://etherscan.io/
  //   apiKey: 
  // },

  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
        // 1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
},

gasReporter :{
  enabled :true,
  outputFile: "gas-report.txt",
  noColors: true,
  currency: "USD",
  token: "MATIC",
}
};
