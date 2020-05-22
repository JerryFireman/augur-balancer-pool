pragma solidity 0.5.12;

import "./BFactory.sol";
import "./BPool.sol";

contract PoolManager {
    address public owner;
    address public factory;

    event PoolCreated(address bpoolAddress);

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address _factory) public {
        owner = msg.sender;
        factory = _factory;
    }

    function createPool()
        public
        onlyOwner
        returns(BPool)
    {
        BFactory bfactory = BFactory(factory);
        BPool bpool = bfactory.newBPool();
        address poolAddress = address(bpool);
        emit PoolCreated(poolAddress);
        return bpool;
    }

    //Stored data section for testing UI
    uint storedData;

    event LogSet(address sender, uint newValue);

    function set(uint x) public {
        storedData = x;
        emit LogSet(msg.sender, x);
    }

    function get() public view returns (uint) {
        return storedData;
    }

}