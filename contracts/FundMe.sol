// SPDX-License-Identifier: GPL-3.0
// Pragma
pragma solidity ^0.8.0;
//Imports
import "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
//Error codes
error Fundme__Notowner();

//Interfaces, Libraries, Contract

// Use it for making uderstand other developers
/**
 * @title A contract for crowd funding
 * @author Kartik Giri
 * @notice This contract is demo a sample funding contract
 * @dev This implements price as our library
 */
contract FundMe {
    // Type Decalaration
    using PriceConverter for uint256;

    // State Variables
    uint256 public constant minmumUSD = 50 * 1e18;
    address[] private funders;
    mapping(address => uint) private addressToAmountFunded;
    address private immutable i_owner;
    AggregatorV3Interface private pricefeed;

    // Events

    // Modifier
    modifier onlyowner() {
        if (msg.sender != i_owner) {
            revert Fundme__Notowner();
        }
        _;
    }

    // Functions Order:
    //// constructor
    //// receive
    //// fallback
    //// external
    //// public
    //// internal
    //// private
    //// view / pure

    constructor(address pricefeedAddress) {
        i_owner = msg.sender;
        pricefeed = AggregatorV3Interface(pricefeedAddress);
    }

    

    // receive() external payable {
    //     fund();
    // }

    // fallback() external payable {
    //     fund();
    // }

    /// @notice Funds our contract based on the ETH/USD price
    function fund() public payable {
        require(
            msg.value.getConversionRate(pricefeed) >= minmumUSD,
            "Not enough ether!"
        );
        if (addressToAmountFunded[msg.sender] == 0) {
            funders.push(msg.sender);
        }
        addressToAmountFunded[msg.sender] += msg.value;
    }

    // function withdraw() public onlyowner {
    //     // require(msg.sender == owner, "you are not owner");
    //     for (uint funderIndex; funderIndex < funders.length; funderIndex++) {
    //         address funder = funders[funderIndex];
    //         addressToAmountFunded[funder] = 0;
    //     }
    //     funders = new address[](0);

    //     // transfer
    //     //  payable (msg.sender).transfer(address(this).balance);
    //     //  // send
    //     //  // it retrun bool
    //     //  bool sendSuccess = payable(msg.sender).send(address(this).balance);
    //     //  require(sendSuccess, "Send failed");
    //     // call
    //     (bool callSuccess, ) = payable(msg.sender).call{
    //         value: address(this).balance
    //     }("");
    //     require(callSuccess, "Call failed");
    // }

    function cheaperWithdraw() public payable onlyowner {
        address[] memory m_funders = funders;
         for (uint funderIndex; funderIndex < m_funders.length; funderIndex++) {
            address funder = m_funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);
        
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }
    
    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return funders[index];
    }

    function getAddressToAmountFunded(address fundingAddress)
        public
        view
        returns (uint256)
    {
        return addressToAmountFunded[fundingAddress];
    }

     function getPriceFeed() public view returns (AggregatorV3Interface) {
        return pricefeed;
    }

}
