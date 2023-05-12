const networkConfig ={
    11155111 :{
        name : "sepolia",
        ethUsdPriceFeed : "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },

    // 31337: {
    //     name: "localhost",
    // },
}

const developmentChain =["hardhat", "localhost"]

module.exports ={
    networkConfig,
    developmentChain
}