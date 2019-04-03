import bnc from 'bnc-assist'

let initializedAssist

// assist methods
export const onboardUser = web3 => getAssist(web3).onboard()
export const decorateContract = contract => getAssist().Contract(contract)
export const decorateTransaction = txObject => getAssist().Transaction(txObject)
export const getUserState = () => getAssist().getState()

// msg handlers

function msgHandlers(methodName) {
  switch (methodName) {
    case 'execute':
      return txExecuteMsg
    case 'approve':
      return txApproveMsg
    case 'build':
      return txMigrateMsg
    default:
      return () => undefined
  }
}

// Returns initialized assist object if previously initialized.
// Otherwise will initialize assist with the config object
export function getAssist(web3) {
  if (initializedAssist) {
    return initializedAssist
  }

  const darkBlack = '#152128'
  const gray = '#202930'
  const offWhite = '#ededed'
  const shadowWhite = 'rgba(237,237,237, 0.1)'

  const assistConfig = {
    networkId: process.env.REACT_APP_NETWORK_ID || 1,
    dappId: 'f57848e2-e571-48c6-9721-4eaee64dfebb',
    web3,
    messages: {
      txSent: data => msgHandlers(data.contract.methodName)('txSent', data),
      txPending: data =>
        msgHandlers(data.contract.methodName)('txPending', data),
      txConfirmed: data =>
        msgHandlers(data.contract.methodName)('txConfirmed', data),
      txFailed: data => msgHandlers(data.contract.methodName)('txFailed', data)
    },
    cssString: `
      .bn-onboard-modal-shade {
        background: ${shadowWhite};
      }

      .bn-onboard-modal {
        background: ${darkBlack};
      }

      h1, h2, h3, h4, h5, p {
        color: ${offWhite};
      }

      .bn-notification {
        background: ${darkBlack};
        box-shadow: 1px 1px 1px 0px ${shadowWhite};
        border: 1px solid ${shadowWhite};
      }

      .bn-status-icon {
        transition: background-color 150ms ease-in-out;
      }

      .bn-notification:hover .bn-status-icon {
        background-position: -48px 1px !important;
      }

      .bn-notification.bn-failed .bn-status-icon:hover, .bn-notification.bn-progress .bn-status-icon:hover, .bn-notification.bn-complete .bn-status-icon:hover {
        background-color: ${offWhite};
        background-position: -48px 1px !important;
      }
    `
  }

  initializedAssist = bnc.init(assistConfig)

  return initializedAssist
}

const executeAddressToDetails = {
  '0xbc25a810': {
    action: {
      infinitive: 'deposit',
      present: 'depositing',
      past: 'deposited'
    },
    token: 'ETH'
  },
  '0xf9ef04be': {
    action: {
      infinitive: 'withdraw',
      present: 'withdrawing',
      past: 'withdrawn'
    },
    token: 'ETH'
  },
  '0x8a9fc475': {
    // PAYING STABILITY FEE WITH DAI
    action: {
      infinitive: 'payback',
      present: 'paying back',
      past: 'payed back'
    },
    token: 'DAI'
  },
  '0xa3dc65a7': {
    // PAYING STABILITY FEE WITH MKR
    action: {
      infinitive: 'payback',
      present: 'paying back',
      past: 'payed back'
    },
    token: 'DAI'
  },
  '0x0344a36f': {
    action: {
      infinitive: 'generate',
      present: 'generating',
      past: 'generated'
    },
    token: 'DAI'
  }
}

const approveAddressToToken = {
  '0x89d24a6b': 'DAI',
  '0x9f8f72aa': 'MKR'
}

const hexToAction = {
  '516e9aec': {
    infinitive: 'create',
    present: 'creating',
    past: 'created'
  },
  bc244c11: {
    infinitive: 'close',
    present: 'closing',
    past: 'closed'
  },
  da93dfcf: {
    infinitive: 'move',
    present: 'moving',
    past: 'moved'
  }
}

const truncateAddress = str => str.toLowerCase().slice(0, 10)
const capitalizeFirst = str =>
  str
    .split('')
    .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
    .join('')

function txExecuteMsg(eventCode, data) {
  const { contract: { parameters } } = data
  let details = executeAddressToDetails[truncateAddress(parameters[1])]

  if (!details) {
    // creating/moving/closing CDP
    const args = parameters[1].substr(2)

    details = {
      action: hexToAction[args.substr(0, 8)],
      cdpNum: parseInt(args.substr(72, 64), 16)
    }
  }

  const { action, token, cdpNum } = details

  switch (eventCode) {
    case 'txSent':
      return `Sending transaction to ${action.infinitive} ${token
        ? token
        : action.infinitive === 'create' ? 'CDP' : `CDP #${cdpNum}`}.`
    case 'txPending':
      return `${capitalizeFirst(action.present)} ${token
        ? token
        : action.infinitive === 'create' ? 'CDP' : `CDP #${cdpNum}`}.`
    case 'txConfirmed':
      return `Your ${token
        ? token
        : action.infinitive === 'create'
          ? 'CDP'
          : `CDP #${cdpNum}`} has been ${action.past}.`
    case 'txFailed':
      return `There was a problem ${action.present} ${token
        ? token
        : action.infinitive === 'create'
          ? 'CDP'
          : `CDP #${cdpNum}`}, please try again.`
    default:
      return undefined
  }
}

function txApproveMsg(
  eventCode,
  { contract: { parameters }, transaction: { to } }
) {
  const token = approveAddressToToken[truncateAddress(to)]
  const action =
    parameters[1] === 0
      ? {
          infinitive: 'lock',
          present: 'locking',
          past: 'locked'
        }
      : {
          infinitive: 'unlock',
          present: 'unlocking',
          past: 'unlocked'
        }

  switch (eventCode) {
    case 'txSent':
      return `Sending transaction to ${action.infinitive} ${token}.`
    case 'txPending':
      return `${capitalizeFirst(action.present)} ${token}.`
    case 'txConfirmed':
      return `Your ${token} has been ${action.past}.`
    case 'txFailed':
      return `There was a problem ${action.present} ${token}, please try again.`
    default:
      return undefined
  }
}

function txMigrateMsg(eventCode) {
  switch (eventCode) {
    case 'txSent':
      return 'Sending transaction to migrate your CDP.'
    case 'txPending':
      return 'Migrating CDP.'
    case 'txConfirmed':
      return 'Your CDP has been successfully migrated.'
    case 'txFailed':
      return 'There was a problem migrating your CDP, please try again.'
    default:
      return undefined
  }
}
