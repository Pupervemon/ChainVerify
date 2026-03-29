// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MockSubjectAccountRegistry {
    mapping(bytes32 key => address accountAddress) private _accounts;

    function createAccount(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external returns (address) {
        bytes32 key = _accountKey(implementation, salt, chainId, tokenContract, tokenId);
        address existing = _accounts[key];
        if (existing != address(0)) {
            return existing;
        }

        address derived = _deriveAccountAddress(key);
        _accounts[key] = derived;
        return derived;
    }

    function account(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external view returns (address) {
        bytes32 key = _accountKey(implementation, salt, chainId, tokenContract, tokenId);
        address existing = _accounts[key];
        if (existing != address(0)) {
            return existing;
        }

        return _deriveAccountAddress(key);
    }

    function _accountKey(
        address implementation,
        bytes32 salt,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) private pure returns (bytes32) {
        return keccak256(abi.encode(implementation, salt, chainId, tokenContract, tokenId));
    }

    function _deriveAccountAddress(bytes32 key) private view returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(address(this), key)))));
    }
}
