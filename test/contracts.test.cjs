const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NoCensorTV Contracts", function () {
  let libertyToken, creatorRegistry, moduleManager, owner, user;

before(async function () {
  [owner, treasury, user] = await ethers.getSigners();

  // Deploy LibertyToken with treasury address
  const LibertyToken = await ethers.getContractFactory("LibertyToken");
  libertyToken = await LibertyToken.deploy(treasury.address);
  await libertyToken.waitForDeployment && (await libertyToken.waitForDeployment());

  // Deploy CreatorRegistry with LibertyToken address
  const CreatorRegistry = await ethers.getContractFactory("CreatorRegistry");
  creatorRegistry = await CreatorRegistry.deploy(await libertyToken.getAddress());
  await creatorRegistry.waitForDeployment && (await creatorRegistry.waitForDeployment());

  // Deploy ModuleManager with CreatorRegistry address
  const ModuleManager = await ethers.getContractFactory("ModuleManager");
  moduleManager = await ModuleManager.deploy(await creatorRegistry.getAddress());
  await moduleManager.waitForDeployment && (await moduleManager.waitForDeployment());
});

  it("Should deploy LibertyToken", async function () {
    expect(await libertyToken.name()).to.equal("Liberty Token");
  });


  it("Should register creator", async function () {
    // register returns a creatorId
    const tx = await creatorRegistry.register("QmCreatorMetadata");
    const receipt = await tx.wait();
    // get the creatorId from the event or mapping
    const creatorId = await creatorRegistry.addressToCreatorId(owner.address);
    // get the creator struct by id
    const creator = await creatorRegistry.creators(creatorId);
    expect(creator.metadataCID).to.equal("QmCreatorMetadata");
  });

  it("Should add monetization module", async function () {
    // Deploy PayPerViewModule (no constructor args)
    const PayPerViewModule = await ethers.getContractFactory("PayPerViewModule");
    const ppvModule = await PayPerViewModule.deploy();
    await ppvModule.waitForDeployment && (await ppvModule.waitForDeployment());

    // Whitelist the module
    await moduleManager.whitelistModule(await ppvModule.getAddress(), true);

    // Attach the module to a contentId (simulate contentId=1, initData=0)
    await moduleManager.attachModule(1, await ppvModule.getAddress(), ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [0]));

    // There is no isModule, so check whitelistedModules
    const isWhitelisted = await moduleManager.whitelistedModules(await ppvModule.getAddress());
    expect(isWhitelisted).to.be.true;
  });
});
