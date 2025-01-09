// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./structs/task.sol";

contract TodoList {

    address public owner = msg.sender;
    uint public taskCost = 0.01 ether;
    Task[] private tasks;

    event TaskCreated(uint taskId, string description, TaskState state);
    event TaskUpdated(uint taskId, string description, TaskState state);
    event TaskDeleted(uint taskId);

    error Unauthorized();
    error NotEnoughEther();

    modifier onlyOwner() {
        if(msg.sender != owner)
            revert Unauthorized();
        _;
    }

    modifier costs(uint amount) {
        if (msg.value < amount)
            revert NotEnoughEther();

        _;
        if (msg.value > amount)
            payable(msg.sender).transfer(msg.value - amount);
    }

    function createTask(string memory description) public payable onlyOwner() costs(taskCost) {
        tasks.push(
            Task(description, TaskState.Todo, block.timestamp)
        );
        emit TaskCreated(tasks.length - 1, description, TaskState.Todo);
    }

    function updateTaskDescription(uint taskId, string memory description) public onlyOwner() {
        tasks[taskId].description = description;
        emit TaskUpdated(taskId, description, tasks[taskId].state);
    }

    function updateTaskState(uint taskId, TaskState state) public onlyOwner() {
        tasks[taskId].state = state;
        emit TaskUpdated(taskId, tasks[taskId].description, state);
    }

    function updateTask(uint taskId, string memory description, TaskState state) public onlyOwner() {
        tasks[taskId].description = description;
        tasks[taskId].state = state;
        emit TaskUpdated(taskId, description, state);
    }

    function deleteTask(uint taskId) public onlyOwner() {
        delete tasks[taskId];
        emit TaskDeleted(taskId);
    }

}