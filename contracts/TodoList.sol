// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import "../structs/task.sol";

contract TodoList {

    address public immutable owner;
    uint public constant taskCost = 0.01 ether;
    Task[] public tasks;

    event TaskCreated(uint indexed taskId);
    event TaskUpdated(uint indexed taskId);
    event TaskDeleted(uint indexed taskId);

    error Unauthorized();
    error IncorrectEther();

    modifier onlyOwner() {
        if(msg.sender != owner)
            revert Unauthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createTask(string calldata description) external payable onlyOwner() {
        if (msg.value != taskCost)
            revert IncorrectEther();

        tasks.push(
            Task(description, TaskState.Todo, block.timestamp)
        );
        emit TaskCreated(tasks.length - 1);
    }

    function updateTaskDescription(uint taskId, string calldata description) external onlyOwner() {
        tasks[taskId].description = description;
        emit TaskUpdated(taskId);
    }

    function updateTaskState(uint taskId, TaskState state) external onlyOwner() {
        tasks[taskId].state = state;
        emit TaskUpdated(taskId);
    }

    function updateTask(uint taskId, string calldata description, TaskState state) external onlyOwner() {
        tasks[taskId].description = description;
        tasks[taskId].state = state;
        emit TaskUpdated(taskId);
    }

    function deleteTask(uint taskId) external onlyOwner() {
        delete tasks[taskId];
        emit TaskDeleted(taskId);
        payable(msg.sender).transfer(taskCost);
    }

}