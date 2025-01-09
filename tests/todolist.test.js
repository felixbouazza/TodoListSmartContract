/* eslint-disable no-undef */
// Right click on the script name and hit "Run" to execute
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList", function () {
    it("test initial value", async function () {
        const TodoList = await ethers.getContractFactory("TodoList");
        const todolist = await TodoList.deploy();
        await todolist.deployed();

        expect(await todolist.owner()).to.equal(await ethers.getSigner(0).getAddress());
        expect(await todolist.taskCost()).to.equal(ethers.utils.parseEther("0.01"));
    });
})