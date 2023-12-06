const { network } = require("hardhat");
const {developmentChain} = require("../helper-hardhat-config");

const DECIMAL = 8;
const initialAnswer = 200000000000;
module.exports=  async({getNamedAccounts, deployments})=>{
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;

    if(developmentChain.includes(network.name)){ // checks the some element is present in array or not...
        log("Local network detected! Deploying mocks...");
        await deploy("MockV3Aggregator",{
            contract : "MockV3Aggregator",
            from: deployer,
            log: true,  // means it will spit essential information for deployment.
            args:[DECIMAL, initialAnswer]
        })
        log("mock deploy");
        log("____________________________________________");
    }
}

module.exports.tags=["all", "mocks"]