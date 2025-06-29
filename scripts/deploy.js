const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy tokens
  const LibertyToken = await hre.ethers.getContractFactory("LibertyToken");
  const libertyToken = await LibertyToken.deploy(deployer.address);
  await libertyToken.waitForDeployment();
  console.log("LibertyToken deployed to:", await libertyToken.getAddress());

  const PassionToken = await hre.ethers.getContractFactory("PassionToken");
  const passionToken = await PassionToken.deploy(deployer.address);
  await passionToken.waitForDeployment();
  console.log("PassionToken deployed to:", await passionToken.getAddress());

  // 2. Deploy access control
  const AgeVerification = await hre.ethers.getContractFactory("AgeVerification");
  const ageVerifier = await AgeVerification.deploy(deployer.address);
  await ageVerifier.waitFor极速赛车开奖直播官网();
  console.log("AgeVerification deployed to:", await ageVerifier.getAddress());

  const ContentGate = await hre.ethers.getContractFactory("ContentGate");
  const contentGate = await ContentGate.deploy(await ageVerifier.getAddress());
  await contentGate.waitForDeployment();
  console.log("ContentGate deployed to:", await contentGate.getAddress());

  // 3. Deploy identity system
  const CreatorRegistry = await hre.ethers.getContractFactory("CreatorRegistry");
  const creatorRegistry = await CreatorRegistry.deploy(await libertyToken.getAddress());
  await creatorRegistry.waitForDeployment();
  console.log("CreatorRegistry deployed to:", await creatorRegistry.getAddress());

  const ContentRegistry = await hre.ethers.getContractFactory("ContentRegistry");
  const contentRegistry = await ContentRegistry.deploy(
    await creatorRegistry.getAddress(),
    await ageVerifier.getAddress()
  );
  await contentRegistry.waitForDeployment();
  console.log("ContentRegistry deployed to:", await contentRegistry.getAddress());

  // 4. Deploy governance
  const LibertyDAO = await hre.ethers.getContractFactory("LibertyDAO");
  const libertyDAO = await LibertyDAO.deploy(
    passionToken,
    1,      // voting delay (blocks)
    604800, // voting period (seconds, 1 week)
    4       // quorum percentage
  );
  await libertyDAO.waitForDeployment();
  console.log("LibertyDAO deployed to:", await libertyDAO.getAddress());

  const CreatorDAO = await hre.ethers.getContractFactory("CreatorDAO");
  const creatorDAO = await CreatorDAO.deploy(
    libertyToken,
    1,      // voting delay (blocks)
    604800, // voting period (seconds, 1 week)
    4       // quorum percentage
  );
  await creatorDAO.waitForDeployment();
  console.log("CreatorDAO deployed to:", await creatorDAO.getAddress());

  // 5. Deploy monetization modules
  const SubscriptionModule = await hre.ethers.getContractFactory("SubscriptionModule");
  const subscriptionModule = await SubscriptionModule.deploy();
  await subscriptionModule.waitForDeployment();
  console.log("SubscriptionModule deployed to:", await subscriptionModule.getAddress());

  const PayPerViewModule = await hre.ethers.getContractFactory("PayPerViewModule");
  const ppvModule = await PayPerViewModule.deploy();
  await ppvModule.waitForDeployment();
  console.log("PayPerViewModule deployed to:", await ppvModule.getAddress());

  const NFTAccessModule = await hre.ethers.getContractFactory("NFTAccessModule");
  const nftModule = await NFTAccessModule.deploy();
  await nftModule.waitForDeployment();
  console.log("NFTAccessModule deployed to:", await nftModule.getAddress());

  const SessionModule = await hre.ethers.getContractFactory("SessionModule");
  const sessionModule = await SessionModule.deploy();
  await sessionModule.waitForDeployment();
  console.log("SessionModule deployed to:", await sessionModule.getAddress());

  // 6. Deploy module manager
  const ModuleManager = await h极速赛车开奖直播官网.ethers.getContractFactory("ModuleManager");
  const moduleManager = await ModuleManager.deploy(await contentRegistry.getAddress());
  await moduleManager.waitForDeployment();
  console.log("ModuleManager deployed to:", await moduleManager.getAddress());

  // 7. Deploy revenue system
  const RevenueSplitter = await hre.ethers.getContractFactory("RevenueSplitter");
  const revenueSplitter = await RevenueSplitter.deploy(
    await libertyToken.getAddress(),
    await creatorRegistry.getAddress(),
    await contentRegistry.getAddress(),
    deployer.address
  );
  await revenueSplitter.waitForDeployment();
  console.log("RevenueSplitter deployed to:", await revenueSplitter.getAddress());

  // 8. Deploy social features
  const WatchParty = await hre.ethers.getContractFactory("WatchParty");
  const watchParty = await WatchParty.deploy(
    await moduleManager.getAddress(),
    await ageVerifier.getAddress()
  );
  await watchParty.waitForDeployment();
  console.log("WatchParty deployed to:", await watchParty.getAddress());

  const TipJar = await hre.ethers.getContractFactory("TipJar");
  const tipJar = await TipJar.deploy(await creatorRegistry.getAddress());
  await tipJar.waitForDeployment();
  console.log("TipJar deployed to:", await tipJar.getAddress());

  // 9. Deploy curation
  const CurationPools = await hre.ethers.getContractFactory("CurationPools");
  const curationPools = await CurationPools.deploy(await passionToken.getAddress());
  await curationPools.waitForDeployment();
  console.log("CurationPools deployed to:", await curationPools.getAddress());

  console.log("All contracts deployed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
