import onboard from 'bnc-onboard'
import notify from 'bnc-notify'

const ASSIST_KEY = ''
const NETWORK_ID = 1
const FORTMATIC_KEY = ""
const PORTIS_KEY = ""
const INFURA_KEY = ""
const SQUARELINK_KEY = ''

let initializedOnboard
let initializedNotify

export function initializeOnboard(subscriptions) {
  if (!initializedOnboard) {
    initializedOnboard = onboard.init({
      dappId: ASSIST_KEY,
      networkId: NETWORK_ID,
      subscriptions,
      modules: {
        walletSelect: onboard.modules.select.defaults({
          fortmaticInit: { apiKey: FORTMATIC_KEY },
          portisInit: { apiKey: PORTIS_KEY },
          walletConnectInit: { infuraKey: INFURA_KEY },
          squarelinkInit: {
            apiKey: SQUARELINK_KEY,
            networkId: NETWORK_ID
          },
          networkId: NETWORK_ID
        }),
        walletReady: onboard.modules.ready.defaults({
          networkId: NETWORK_ID
          // set a minimum balance below (optional):
          // minimumBalance: '100000'
        })
      }
    })
  }

  return initializedOnboard
}

export function getOnboard() {
  return initializedOnboard
}

export function getNotify() {
  if (!initializedNotify) {
    initializedNotify = notify({
      dappId: ASSIST_KEY,
      networkId: NETWORK_ID
    })
  }

  return initializedNotify
}
