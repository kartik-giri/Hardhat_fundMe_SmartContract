const { deployments, ethers, getNamedAccounts } = require("hardhat");
const {assert, expect} = require("chai");


!developmentChains.includes(network.name)? describe.skip:
describe("FundMe", () => {
  
  let fundme;
  let deployer;
  let mockv3aggregator;
  const sendvalue = ethers.utils.parseEther("1"); // 1 eth
  beforeEach(async () => {
    //deploy hardhat contract
    // using hardhat deploy
    deployer = (await getNamedAccounts()).deployer; // get deployer
    
    await deployments.fixture(["all"]); // fixture use to run and deploy the deploy file with using tag name...
    // deployer is used to make transaction, to see which account is making trasaction....
    fundme = await ethers.getContract("FundMe", deployer); // using hardhat deply ethers .getcontract we are getiing the latest deployrd contract fundme..
    mockv3aggregator = await ethers.getContract("MockV3Aggregator", deployer);  
});

  describe("constructor", ()=>{
    it("sets the aggregator addresses correctly", async()=>{
        const response = await fundme.getPriceFeed();
        assert.equal(response,mockv3aggregator.address);
    })

    it("set the right getOwner", async()=>{
        const response = await fundme.getOwner();
        assert.equal(response, deployer);
    })
  })

  describe("fund", ()=>{
    it("should return Not enough ether!", async()=>{
        await expect(fundme.fund()).to.be.revertedWith("Not enough ether!");
    })

    it("should update the amount funded data structure", async()=>{
        await fundme.fund({value : sendvalue});
        const response = await fundme.getAddressToAmountFunded(deployer);
        assert.equal(response.toString(), sendvalue.toString());
    })

    it("should store address of deployer", async()=>{
        await fundme.fund({value : sendvalue});
        const response = await fundme.getFunder(0);
        assert.equal(response, deployer);
    })

    it("should not store deployer address", async()=>{
        await fundme.fund({value : sendvalue});
        // const response = await fundme.getFunder(1);
       await expect(fundme.getFunder(1),deployer).to.be.reverted;
    })
  })

  describe("cheaperWithdraw", ()=>{
    beforeEach(async()=>{
        await fundme.fund({value: sendvalue});
    })

    it("cheaperWithdraw ETH from a single funder", async()=>{
        //arrange
        const startingFundmeBal = await fundme.provider.getBalance(fundme.address);

        const startingDeployerBal = await fundme.provider.getBalance(deployer);

        // act
        const transactionResponse = await fundme.cheaperWithdraw();
        const transactionReceipt = await transactionResponse.wait(1);
        const {gasUsed, effectiveGasPrice} = transactionReceipt;
        const gasCost = gasUsed.mul( effectiveGasPrice);
        
        const endingFundmeBal = await fundme.provider.getBalance(fundme.address);

        const endingDeployerBal = await fundme.provider.getBalance(deployer);
        // Assert

        assert.equal(endingFundmeBal, 0);
        assert.equal(startingFundmeBal.add(startingDeployerBal).toString(), endingDeployerBal.add(gasCost).toString());
    })

    it("allow us to cheaperWithdraw with multiple getFunder", async()=>{
      const accounts = await ethers.getSigners();
      for(let i =1; i<6; i++){
        const fundmeConnectedContract = await fundme.connect(accounts[i]);
        await fundmeConnectedContract.fund({value: sendvalue});
      }

      const startingFundmeBal = await fundme.provider.getBalance(fundme.address);

      const startingDeployerBal = await fundme.provider.getBalance(deployer);
      
        // act
        const transactionResponse = await fundme.cheaperWithdraw();
        const transactionReceipt = await transactionResponse.wait(1);
        const {gasUsed, effectiveGasPrice} = transactionReceipt;
        const gasCost = gasUsed.mul( effectiveGasPrice);

        const endingFundmeBal = await fundme.provider.getBalance(fundme.address);

        const endingDeployerBal = await fundme.provider.getBalance(deployer);
        // Assert

        assert.equal(endingFundmeBal, 0);
        assert.equal(startingFundmeBal.add(startingDeployerBal).toString(), endingDeployerBal.add(gasCost).toString());
        await expect(fundme.getFunder(0)).to.be.reverted;
        for(let i= 0; i<6; i++){
          assert.equal(await fundme.getAddressToAmountFunded(accounts[i].address),0)
        }
    })
   
    it("allows only getOwner to cheaperWithdraw", async ()=>{
      const accounts = await ethers.getSigners();
      const attacker = accounts[1];
      const attackerconnectedcontract = await fundme.connect(attacker);
      await expect(attackerconnectedcontract.cheaperWithdraw()).to.be.reverted;
    })

      
  })

  

});





























// Another way to get the deplyer account is.....
    // const deployer = await ethers.getSigner();

    // if we are using localhoast then...
    // const deployer = await ethers.getSigners();
    // const deployerzero = account[0];
