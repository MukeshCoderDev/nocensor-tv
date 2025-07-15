@echo off
echo 🚀 Starting Local E2E Test Setup...
echo.

echo 📦 Installing ArLocal...
npm install -g arlocal

echo.
echo 🌐 Starting ArLocal (Arweave local node)...
start "ArLocal" cmd /k "arlocal"

echo.
echo ⏳ Waiting 5 seconds for ArLocal to start...
timeout /t 5 /nobreak > nul

echo.
echo 🧪 Running E2E Test...
echo Replace YOUR_CORRECT_PRIVATE_KEY with your actual 64-character MetaMask private key
echo.

echo npm run test:e2e -- ^
  --network local ^
  --rpcUrl https://sepolia.infura.io/v3/7cddccd83fda404b941fe80581c76c0a ^
  --ethPrivateKey YOUR_CORRECT_PRIVATE_KEY ^
  --arweaveKey ./arweave-key.json ^
  --videoPath ./sample-video.mp4 ^
  --contract 0x9Fc0552df6fA4ca99b2701cfD8bBDbD3F98723E8

echo.
echo 💡 Instructions:
echo 1. Replace YOUR_CORRECT_PRIVATE_KEY with your full MetaMask private key
echo 2. Make sure ArLocal is running (separate window should open)
echo 3. Run the command above
echo.
pause