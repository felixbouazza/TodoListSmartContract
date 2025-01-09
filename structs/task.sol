// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../enums/taskState.sol";

struct Task {
    string description;
    TaskState state;
    uint createdAt;
}