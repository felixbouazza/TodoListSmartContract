/* eslint-disable no-undef */
// Right click on the script name and hit "Run" to execute
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList", function () {
    let TodoList = null;
    let [owner, addr1, addr2] = [null, null, null];

    before(async function () {
        TodoList = await ethers.getContractFactory("TodoList");
        [owner, addr1, addr2] = await ethers.getSigners();
    })

    it("test initial value", async function () {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        expect(await todolist.owner()).to.equal(await owner.getAddress());
        expect(await todolist.taskCost()).to.equal(ethers.utils.parseEther("0.01"));
    });

    it("test create task works", async function () {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        await todolist.createTask("Sortir le chien", {
            value: await todolist.taskCost()
        })

        const task = await todolist.tasks(0)
        expect(task[0]).equal("Sortir le chien")
        expect(task[1]).equal(0)
        expect(task[2]._hex).to.exist;
    });

    it("test create task emit event", async function () {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        await expect(todolist.createTask("Sortir le chien", {
            value: await todolist.taskCost()
        })).to.emit(todolist, "TaskCreated")
          .withArgs(0, "Sortir le chien", 0);
    });
    
    it("test create task not authorized", async function () {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        await expect(todolist.connect(addr1).createTask("Sortir le chien", {
            value: await todolist.taskCost()
        })).to.be.reverted
    });

    it("test create task not enough ether", async function () {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const taskCost = await todolist.taskCost()
        const wrongTaskCost = taskCost.sub(ethers.utils.parseEther("0.0001"))  

        await expect(todolist.createTask("Sortir le chien", {
            value: wrongTaskCost
        })).to.be.reverted
    });

    it("test update task description works", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        await todolist.createTask("Sortir le chien", {
            value: await todolist.taskCost()
        })

        await todolist.updateTaskDescription(0, "Faire les courses")

        const task = await todolist.tasks(0)
        expect(task[0]).equal("Faire les courses")
        expect(task[1]).equal(0)
        expect(task[2]._hex).to.exist;
    })

    it("test update task description emit event", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        await todolist.createTask("Sortir le chien", {
            value: await todolist.taskCost()
        })

        await expect(await todolist.updateTaskDescription(0, "Faire les courses")).to.emit(todolist, "TaskUpdated")
          .withArgs(0, "Faire les courses", 0);
    })


    it("test update task description not authorized", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        await todolist.createTask("Sortir le chien", {
            value: await todolist.taskCost()
        })

        await expect(todolist.connect(addr1).updateTaskDescription("Faire les courses")).to.be.reverted
    })

    it("test update task state works", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        await todolist.createTask("Sortir le chien", {
            value: await todolist.taskCost()
        })

        await todolist.updateTaskState(0, 1)


        const task = await todolist.tasks(0)
        expect(task[0]).equal("Sortir le chien")
        expect(task[1]).equal(1)
        expect(task[2]._hex).to.exist;
    })

    it("test update task state emit event", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();


        await todolist.createTask("Sortir le chien", {
            value: await todolist.taskCost()
        })

        await expect(await todolist.updateTaskState(0, 1)).to.emit(todolist, "TaskUpdated")
          .withArgs(0, "Sortir le chien", 1);
    })

    it("test update task state not authorized", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        await todolist.createTask("Sortir le chien", {
            value: await todolist.taskCost()
        })

        await expect(todolist.connect(addr1).updateTaskState(0, 1)).to.be.reverted
    })

    it("test update task works", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        await todolist.createTask("Sortir le chien", {
            value: await todolist.taskCost()
        })

        await todolist.updateTask(0, "Faire les courses", 1)

        const task = await todolist.tasks(0)
        expect(task[0]).equal("Faire les courses")
        expect(task[1]).equal(1)
        expect(task[2]._hex).to.exist;
    })

    it("test update task emit event", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();


        await todolist.createTask("Sortir le chien", {
            value: await todolist.taskCost()
        })

        await expect(await todolist.updateTask(0, "Faire les courses", 1)).to.emit(todolist, "TaskUpdated")
          .withArgs(0, "Faire les courses", 1);
    })

    it("test update task not authorized", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        await todolist.createTask("Sortir le chien", {
            value: await todolist.taskCost()
        })

        await expect(todolist.connect(addr1).updateTask(0, "Faire les courses", 1)).to.be.reverted
    })

    it("test delete task works", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        await todolist.createTask("Sortir le chien", {
            value: await todolist.taskCost()
        })

        await todolist.deleteTask(0)

        const task =  await todolist.tasks(0)
        expect(task[0]).equal("")
        expect(task[1]).equal(0)
        expect(task[2]._hex).to.exist;
    })

    it("test delete task emit event", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        await todolist.createTask("Sortir le chien", {
            value: await todolist.taskCost()
        })

        await expect(await todolist.deleteTask(0)).to.emit(todolist, "TaskDeleted")
          .withArgs(0);
    })

    it("test delete task not authorized", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        await todolist.createTask("Sortir le chien", {
            value: await todolist.taskCost()
        })

        await expect(todolist.connect(addr1).deleteTask(0)).to.be.reverted
    })
})