pragma solidity ^0.5.8;

contract Store {
    mapping(bytes32 => uint256) private _data;
    mapping(bytes32 => bool) private _cache;
    bytes32[] private _keys;

    function set(bytes32 key, uint256 value) external returns (Store) {
        _data[key] = value;

        if (!_internalHas(key)) {
            _keys.push(key);
            _cache[key] = true;
        }

        return this;
    }

    function get(bytes32 key) external view returns (uint256 value) {
        if (!_internalHas(key)) return 0;
        return _data[key];
    }

    function getAt(uint256 index) external view returns (uint256 value) {
        _requireInBounds(index);

        return _data[_keys[index]];
    }

    function remove(bytes32 key) external returns (bool found, uint256 value) {
        bool hasFoundKey = false;
        uint256 removedValue;

        if (!_internalHas(key)) {
            return (hasFoundKey, removedValue);
        }

        for (uint256 i = 0; i < _keys.length; i++) {
            if (!hasFoundKey && _keys[i] == key) {
                removedValue = _data[key];
                hasFoundKey = true;
                delete _keys[i];
                delete _data[key];
                _cache[key] = false;
            }

            if (hasFoundKey && i < _keys.length - 1) {
                _keys[i] = _keys[i + 1];
            }
        }

        if (hasFoundKey) {
            _keys.length--;
        }

        return (hasFoundKey, removedValue);
    }

    function empty() external returns (Store) {
        if (_internalIsEmpty()) return this;

        for (uint256 i = 0; i < _keys.length; i++) {
            delete _data[_keys[i]];
            delete _cache[_keys[i]];
        }

        _keys.length = 0;

        return this;
    }

    function isEmpty() external view returns (bool) {
        return _internalIsEmpty();
    }

    function has(bytes32 key) external view returns (bool found) {
        return _internalHas(key);
    }

    function size() external view returns (uint256 value) {
        return _keys.length;
    }

    function keys() external view returns (bytes32[] memory) {
        return _keys;
    }

    function keyAt(uint256 index) external view returns (bytes32 key) {
        _requireInBounds(index);

        return _keys[index];
    }

    function _internalHas(bytes32 key) internal view returns (bool) {
        if (_internalIsEmpty()) return false;
        return _cache[key];
    }

    function _internalIsEmpty() internal view returns (bool) {
        return _keys.length == uint256(0);
    }

    function _requireInBounds(uint256 index) internal view {
        require(!_internalIsEmpty() && index < _keys.length, "Out of bounds");
    }
}
