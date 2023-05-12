const {  ethers, getNamedAccounts, network } = require("hardhat");
const {assert, expect} = require("chai");
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)? describe.skip:
describe("fundme", () => {
  
  let fundme;
  let deployer;
  const sendvalue = ethers.utils.parseEther("1"); // 1 eth
  beforeEach(async () => {
    //deploy hardhat contract
    // using hardhat deploy
    deployer = (await getNamedAccounts()).deployer; // get deployer
    
    // deployer is used to make transaction, to see which account is making trasaction....
    fundme = await ethers.getContract("fundme", deployer); // using hardhat deply ethers .getcontract we are getiing the latest deployrd contract fundme..
  
});

it("allows people to fund and withdraw", async function () {
    const fundTxResponse = await fundme.fund({ value: sendValue })
    await fundTxResponse.wait(1)
    const withdrawTxResponse = await fundme.withdraw()
    await withdrawTxResponse.wait(1)

    const endingfundmeBalance = await fundme.provider.getBalance(
        fundme.address
    )
    console.log(
        endingfundmeBalance.toString() +
            " should equal 0, running assert equal..."
    )
    assert.equal(endingfundmeBalance.toString(), "0")
})
})