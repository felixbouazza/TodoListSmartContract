/* eslint-disable no-undef */
// Right click on the script name and hit "Run" to execute
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList initial value", function () {
    
    it("test initial value", async function () {
        let TodoList = await ethers.getContractFactory("TodoList");
        let [owner] = await ethers.getSigners();
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();
        expect(await todolist.owner()).to.equal(await owner.getAddress());
        expect(await todolist.taskCost()).to.equal(ethers.utils.parseEther("0.01"));
    });

})

describe("TodoList get task", function () {

    let TodoList;
    let owner;
    let addr1;

    before(async function () {
        TodoList = await ethers.getContractFactory("TodoList");
        [owner, addr1] = await ethers.getSigners();
    })

    it("test get task works", async function () {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const taskName = ethers.utils.formatBytes32String('Faire les courses')
        await todolist.createTask(taskName, {
            value: await todolist.taskCost()
        })

        const task = await todolist.getTask(0)
        expect(task[0]).equal(taskName)
        expect(task[1]).equal(0)
    })

    it("test get task not authorized", async function () {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const taskName = ethers.utils.formatBytes32String('Faire les courses')
        await todolist.createTask(taskName, {
            value: await todolist.taskCost()
        })
        
        await expect(todolist.connect(addr1).getTask(0)).to.be.reverted
    })
})

describe("TodoList get tasks", function () {

    let TodoList;
    let owner;
    let addr1;

    before(async function () {
        TodoList = await ethers.getContractFactory("TodoList");
        [owner, addr1] = await ethers.getSigners();
    })

    it("test get tasks works", async function () {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const taskName = ethers.utils.formatBytes32String('Faire les courses')
        await todolist.createTask(taskName, {
            value: await todolist.taskCost()
        })

        const secondTaskName = ethers.utils.formatBytes32String('Sortir le chien')
        await todolist.createTask(secondTaskName, {
            value: await todolist.taskCost()
        })

        const tasks = await todolist.getTasks()
        expect(tasks).to.have.lengthOf(2);
    })

    it("test get tasks not authorized", async function () {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();
        
        await expect(todolist.connect(addr1).getTasks()).to.be.reverted
    })
})

describe("TodoList create task", function () {

    let TodoList;
    let owner;
    let addr1;

    before(async function () {
        TodoList = await ethers.getContractFactory("TodoList");
        [owner, addr1] = await ethers.getSigners();
    })

    it("test create task works", async function () {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const taskName = ethers.utils.formatBytes32String('Faire les courses')
        await todolist.createTask(taskName, {
            value: await todolist.taskCost()
        })

        const task = await todolist.getTask(0)
        expect(task[0]).equal(taskName)
        expect(task[1]).equal(0)
    });

    it("test create task emit event", async function () {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const taskName = ethers.utils.formatBytes32String('Faire les courses')
        await expect(todolist.createTask(taskName, {
            value: await todolist.taskCost()
        })).to.emit(todolist, "TaskCreated")
          .withArgs(0);
    });
    
    it("test create task not authorized", async function () {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const taskName = ethers.utils.formatBytes32String('Faire les courses')
        await expect(todolist.connect(addr1).createTask(taskName, {
            value: await todolist.taskCost()
        })).to.be.reverted
    });

    it("test create task not enough ether", async function () {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const taskCost = await todolist.taskCost()
        const wrongTaskCost = taskCost.sub(ethers.utils.parseEther("0.0001"))  

        const taskName = ethers.utils.formatBytes32String('Faire les courses')
        await expect(todolist.createTask(taskName, {
            value: wrongTaskCost
        })).to.be.reverted
    });

})

describe("TodoList update task", function () {

    let TodoList;
    let owner;
    let addr1;

    before(async function () {
        TodoList = await ethers.getContractFactory("TodoList");
        [owner, addr1] = await ethers.getSigners();
    })

    it("test update task works", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const taskName = ethers.utils.formatBytes32String('Faire les courses')
        await todolist.createTask(taskName, {
            value: await todolist.taskCost()
        })

        const newTaskName = ethers.utils.formatBytes32String('Sortir le chien')
        await todolist.updateTask(0, newTaskName, 1)

        const task = await todolist.getTask(0)
        expect(task[0]).equal(newTaskName)
        expect(task[1]).equal(1)
    })

    it("test update task emit event", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const taskName = ethers.utils.formatBytes32String('Faire les courses')
        await todolist.createTask(taskName, {
            value: await todolist.taskCost()
        })

        const newTaskName = ethers.utils.formatBytes32String('Sortir le chien')
        await expect(await todolist.updateTask(0, newTaskName, 1)).to.emit(todolist, "TaskUpdated")
          .withArgs(0);
    })

    it("test update task not authorized", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const taskName = ethers.utils.formatBytes32String('Faire les courses')
        await todolist.createTask(taskName, {
            value: await todolist.taskCost()
        })

        const newTaskName = ethers.utils.formatBytes32String('Sortir le chien')
        await expect(todolist.connect(addr1).updateTask(0, newTaskName, 1)).to.be.reverted
    })

})

describe("TodoList delete task", function () {

    let TodoList;
    let owner;
    let addr1;

    before(async function () {
        TodoList = await ethers.getContractFactory("TodoList");
        [owner, addr1] = await ethers.getSigners();
    })

    it("test delete works with one item", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const taskName = ethers.utils.formatBytes32String('Faire les courses')
        await todolist.createTask(taskName, {
            value: await todolist.taskCost()
        })

        await todolist.deleteTask(0)
        const tasks = await todolist.getTasks()
        expect(tasks).to.have.lengthOf(0);
    })

    it("test delete not authorized", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const taskName = ethers.utils.formatBytes32String('Faire les courses')
        await todolist.createTask(taskName, {
            value: await todolist.taskCost()
        })
        await expect(todolist.connect(addr1).deleteTask(0)).to.be.reverted
        const tasks = await todolist.getTasks()
        expect(tasks).to.have.lengthOf(1);
    })

    it("test delete emit event", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const taskName = ethers.utils.formatBytes32String('Faire les courses')
        await todolist.createTask(taskName, {
            value: await todolist.taskCost()
        })

        await expect(await todolist.deleteTask(0)).to.emit(todolist, "TaskDeleted")
          .withArgs(0);
    })

    it("test delete item should swap id with last item of tasks list", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const firstTaskName = ethers.utils.formatBytes32String('Faire les courses')
        await todolist.createTask(firstTaskName, {
            value: await todolist.taskCost()
        })

        const secondTaskName = ethers.utils.formatBytes32String('Sortir le chien')
        await todolist.createTask(secondTaskName, {
            value: await todolist.taskCost()
        })

        const thirdTaskName = ethers.utils.formatBytes32String('Sortir le chien')
        await todolist.createTask(thirdTaskName, {
            value: await todolist.taskCost()
        })

        let tasks = await todolist.getTasks()
        expect(tasks).to.have.lengthOf(3);

        await todolist.deleteTask(0)
        tasks = await todolist.getTasks()
        expect(tasks).to.have.lengthOf(2);

        const firstTask = await todolist.getTask(0)
        expect(firstTask[0]).equal(thirdTaskName)
    })

    it("test delete item with swap should emit event", async function() {
        const todolist = await TodoList.connect(owner).deploy();
        await todolist.deployed();

        const firstTaskName = ethers.utils.formatBytes32String('Faire les courses')
        await todolist.createTask(firstTaskName, {
            value: await todolist.taskCost()
        })

        const secondTaskName = ethers.utils.formatBytes32String('Sortir le chien')
        await todolist.createTask(secondTaskName, {
            value: await todolist.taskCost()
        })

        const thirdTaskName = ethers.utils.formatBytes32String('Sortir le chien')
        await todolist.createTask(thirdTaskName, {
            value: await todolist.taskCost()
        })

        await expect(await todolist.deleteTask(0)).to.emit(todolist, "TaskIdMoved").withArgs(2, 0);

    })

})