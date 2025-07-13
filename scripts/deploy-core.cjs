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

  // 3. Deploy ContentRegistry
  const ContentRegistry = await hre.ethers.getContractFactory("ContentRegistry");
  const contentRegistry = await ContentRegistry.deploy(
    await creatorRegistry.getAddress(),
    deployer.address // Using deployer as a placeholder for ageVerifier
  );
  await contentRegistry.waitForDeployment();
  console.log("ContentRegistry deployed to:", await contentRegistry.getAddress());

  // 4. Deploy RevenueSplitter
  const RevenueSplitter = await hre.ethers.getContractFactory("RevenueSplitter");
  const revenueSplitter = await RevenueSplitter.deploy(
    await libertyToken.getAddress(),
    await creatorRegistry.getAddress(),
    await contentRegistry.getAddress(),
    deployer.address // Using deployer as a placeholder for treasury
  );
  await revenueSplitter.waitForDeployment();
  console.log("RevenueSplitter deployed to:", await revenueSplitter.getAddress());

  // 5. Deploy TipJar
  const TipJar = await hre.ethers.getContractFactory("TipJar");
  const tipJar = await TipJar.deploy(await creatorRegistry.getAddress());
  await tipJar.waitForDeployment();
  console.log("TipJar deployed to:", await tipJar.getAddress());

  console.log("Core contracts deployed successfully!");

  // 6. Deploy ContentStorage (new contract for Arweave TxIDs)
  const ContentStorage = await hre.ethers.getContractFactory("ContentStorage");
  const contentStorage = await ContentStorage.deploy();
  await contentStorage.waitForDeployment();
  console.log("ContentStorage deployed to:", await contentStorage.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
