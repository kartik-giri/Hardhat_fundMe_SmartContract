const { network } = require("hardhat");
const {networkConfig, developmentChain} = require("../helper-hardhat-config");
const {verify} = require("../utils/verify");

module.exports=  async({getNamedAccounts, deployments})=>{
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;

    // well what happen when we want to change the chains -- then we will pass the chain address at constructor...
    // when going for localhost or hardhat network we want to use a mock

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    let ethUsdPriceFeedAddress;
    if(developmentChain.includes(network.name)){
       const ethUsdAggregator = await deployments.get("MockV3Aggregator"); // to get recent deployment
       ethUsdPriceFeedAddress = ethUsdAggregator.address;
    }
    else{
         ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];  
    }
    const _args =[ethUsdPriceFeedAddress]; 
    const fundme = await deploy("FundMe",{
        from: deployer,
        log: true,
        args: _args,
        waitConfirmations: network.config.blockConfirmation || 1,
    })

    // if(!developmentChain.includes(network.name) && ETHERSCAN_API_KEY){
        if(!developmentChain.includes(network.name)){
        await verify(fundme.address, _args)
    }
    log("__________________________________");


   

}

module.exports.tags = ["all", "fundme"] // runs for specific tag///