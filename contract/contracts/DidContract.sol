// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DidContract is Ownable {

    mapping(address => string) public WalletData;
    mapping(string => string) public DidData;
    mapping(string => mapping(string => string)) public VcData;

    event EventSetWalletData(address walletAddress, string Hashdata);
    event EventSetDidData(string DidAddress, string Hashdata);
    event EventSetVcData(string DidAddress, string vcTitle, string vcHashData);
    
    constructor() Ownable(msg.sender) {}

    function setWalletData(address _address, string memory _HashData) public onlyOwner {
        WalletData[_address] = _HashData;
        emit EventSetWalletData(_address, _HashData);
    }

    function setDidData(string memory _didaddress, string memory _HashData) public onlyOwner {
        DidData[_didaddress] = _HashData;
        emit EventSetDidData(_didaddress, _HashData);
    }

    function setVcData(string memory _didaddress, string memory _vcTitle, string memory _vcHashData) public onlyOwner {
        VcData[_didaddress][_vcTitle] = _vcHashData;
        emit EventSetVcData(_didaddress, _vcTitle, _vcHashData);
    }


}


