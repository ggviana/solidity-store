pragma solidity ^0.5.8;

interface IStore {
    /**
     *
     */
    function set(bytes32 key, uint256 value) external returns (IStore);

    /**
     *
     */
    function get(bytes32 key) external view returns (bool found, uint256 value);

    /**
     *
     */
    function getAt(uint256 index) external view returns (bool found, uint256 value);

    /**
     *
     */
    function remove(bytes32 key) external returns (bool found, uint256 value);

    /**
     *
     */
    function has(bytes32 key) external view returns (bool found);

    /**
     *
     */
    function keys() external view returns (bytes32[] memory);

    /**
     *
     */
    function keyAt(uint256 index) external view returns (bytes32 key);

    /**
     *
     */
    function empty() external returns (IStore);

    /**
     *
     */
    function isEmpty() external view returns (bool);

    /**
     *
     */
    function size() external view returns (uint256 value);
}
