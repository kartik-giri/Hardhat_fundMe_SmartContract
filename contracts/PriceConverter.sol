// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// library can not have state variable and can not send ether and its functions are internal ....

library PriceConverter{
    
    function getprice(AggregatorV3Interface _pricefeed) internal view returns(uint256) {
    // to communicate with other contract we need 2 things.
    // 1. ABI
    // 2. Address:0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e 

    // AggregatorV3Interface pricefeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
     (,int price,,,)= _pricefeed.latestRoundData();
     return uint256(price * 1e10);

    }

    function getConversionRate(uint256 ethAmt, AggregatorV3Interface _pricefeed) internal view returns(uint256){
        uint ethprice = getprice(_pricefeed);
        uint256 ethAmtInUSD = (ethprice * ethAmt) / 1e18;
        return ethAmtInUSD;
    }
}