const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);




  // 1. Deploy LibertyToken
  const LibertyToken = await hre.ethers.getContractFactory("LibertyToken");
  const libertyToken = await LibertyToken.deploy(deployer.address);
  await libertyToken.waitForDeployment();
  console.log("LibertyToken deployed to:", await libertyToken.getAddress());

  // 2. Deploy CreatorRegistry
  const CreatorRegistry = await hre.ethers.getContractFactory("CreatorRegistry");
  const creatorRegistry = await CreatorRegistry.deploy(await libertyToken.getAddress());
  await creatorRegistry.waitForDeployment();
  console.log("CreatorRegistry deployed to:", await creatorRegistry.getAddress());

  // 3. Deploy AgeVerification
  const AgeVerification = await hre.ethers.getContractFactory("AgeVerification");
  const ageVerification = await AgeVerification.deploy(deployer.address);
  await ageVerification.waitForDeployment();
  console.log("AgeVerification deployed to:", await ageVerification.getAddress());

  // 4. Deploy ContentRegistry (needs creatorRegistry and ageVerification)
  const ContentRegistry = await hre.ethers.getContractFactory("ContentRegistry");
  const contentRegistry = await ContentRegistry.deploy(
    await creatorRegistry.getAddress(),
    await ageVerification.getAddress()
  );
  await contentRegistry.waitForDeployment();
  console.log("ContentRegistry deployed to:", await contentRegistry.getAddress());

  // 4. Deploy RevenueSplitter
  const RevenueSplitter = await hre.ethers.getContractFactory("RevenueSplitter");
  const revenueSplitter = await RevenueSplitter.deploy(
    await libertyToken.getAddress(),
    await creatorRegistry.getAddress(),
    await contentRegistry.getAddress(),
    deployer.address // platform treasury
  );
  await revenueSplitter.waitForDeployment();
  console.log("RevenueSplitter deployed to:", await revenueSplitter.getAddress());

  // 5. Deploy ContentDAO
  const ContentDAO = await hre.ethers.getContractFactory("ContentDAO");
  const contentDAO = await ContentDAO.deploy();
  await contentDAO.waitForDeployment();
  console.log("ContentDAO deployed to:", await contentDAO.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
