# GASTROCOIN — testnet starter v0.1

This is a **testnet-only prototype**, not a launched cryptocurrency, investment, audited contract, or legal approval.

## Contract behavior

- Name: GASTROCOIN
- Symbol: GASTRO
- Decimals: 18
- Fixed supply: 1,000,000,000 GASTRO
- Initial supply is minted once to the deployer/initial holder.
- No mint function, no transfer tax, no pause/admin controls.
- This prototype does NOT implement the proposed treasury/reward allocations yet.

## Requirements

Node.js 20+ and npm. Use a separate test wallet with no real funds.

## Install and test

```bash
npm install
npm test
npm run compile
```

## Configure Polygon Amoy

Amoy chain ID: `80002`. Native test gas token: POL.
Explorer: https://amoy.polygonscan.com/

1. Create a NEW test wallet. Do not use a wallet holding real assets.
2. Copy `.env.example` to `.env`.
3. Put the test wallet private key only in your local `.env`.
4. Obtain test POL from a reputable Amoy faucet. Test POL has no monetary value.
5. Deploy:

```bash
npm run deploy:amoy
```

6. Save the contract address and transaction hash. Verify the address on the Amoy explorer.

## Safety

- Never paste a seed phrase or private key into ChatGPT, websites, chats, or screenshots.
- Never fund this test wallet with real money.
- Do not deploy this prototype to Polygon mainnet.
- The source has not been independently audited.
- The token allocation plan is not enforced by this contract. All tokens initially belong to the deployer; any distribution must be separately approved, documented, and tested.
- Before any public sale, custody, exchange listing, or mainnet launch, obtain Colombian legal/tax advice and an independent smart-contract audit.
