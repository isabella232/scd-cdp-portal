import Onboard from "bnc-onboard";
import notify from "bnc-notify";

const BLOCKNATIVE_KEY = "12153f55-f29e-4f11-aa07-90f10da5d778";
const NETWORK_ID = 1;
const FORTMATIC_KEY = "pk_live_8F8CBC328178CD38";
const PORTIS_KEY = "d7d72646-709a-45ab-aa43-8de5307ae0df";
const INFURA_KEY = "d5e29c9b9a9d4116a7348113f57770a8";
const SQUARELINK_KEY = "87288b677f8cfb09a986";

let initializedOnboard;
let initializedNotify;

export function initializeOnboard(subscriptions) {
  if (!initializedOnboard) {
    const wallets = [
      { walletName: "coinbase", preferred: true },
      { walletName: "trust", preferred: true },
      { walletName: "metamask", preferred: true },
      { walletName: "dapper", preferred: true },
      {
        walletName: "fortmatic",
        apiKey: FORTMATIC_KEY,
        preferred: true
      },
      {
        walletName: "portis",
        apiKey: PORTIS_KEY,
        preferred: true
      },
      {
        walletName: "squarelink",
        apiKey: SQUARELINK_KEY
      },
      { walletName: "authereum" },
      {
        walletName: "walletConnect",
        infuraKey: INFURA_KEY
      }
    ];

    const walletChecks = [{ checkName: "connect" }, { checkName: "network" }];

    initializedOnboard = Onboard({
      dappId: "12153f55-f29e-4f11-aa07-90f10da5d778",
      networkId: NETWORK_ID,
      subscriptions,
      walletSelect: {
        heading: "Select a Wallet",
        description: "Please select a wallet to connect to this dapp:",
        wallets
      },
      walletCheck: walletChecks,
      darkMode: true
    });
  }

  return initializedOnboard;
}

export function getOnboard() {
  return initializedOnboard;
}

export function getNotify() {
  if (!initializedNotify) {
    initializedNotify = notify({
      dappId: BLOCKNATIVE_KEY,
      networkId: NETWORK_ID,
      darkMode: true
    });
  }

  return initializedNotify;
}
