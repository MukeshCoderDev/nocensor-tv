const { ethers } = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();
  const rewardTester = await ethers.getContractAt("RewardTester", process.env.REACT_APP_REWARD_TESTER);

  // Fund contract
  await owner.sendTransaction({
    to: rewardTester.address,
    value: ethers.utils.parseEther("5")
  });

  // Add valid bugs
  await rewardTester.setValidBug("Payment failure", true);
  await rewardTester.setValidBug("Video playback error", true);
  await rewardTester.setValidBug("DAO voting exploit", true);

  console.log("Test phase initialized!");
}

main();
