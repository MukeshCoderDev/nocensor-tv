#!/bin/bash

# 1. Deploy contracts
npm run deploy:contracts

# 2. Build frontend
npm run build

# 3. Preload essential content
npm run preload

# 4. Deploy to decentralized hosting
npm run deploy:frontend

# 5. Update ENS record
npx ens-update nocensor.eth $(fleek sites:info --json | jq -r '.url')
