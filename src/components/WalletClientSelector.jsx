// Libraries
import React from "react";
import {inject, observer} from "mobx-react";

// Utils
import {getWebClientProviderName} from "../utils/blockchain";
import walletIcons from './WalletIcons';
import { onboardUser, getUserState } from '../utils/assist'


@inject("network")
@observer
class WalletClientSelector extends React.Component {
  componentDidMount = () => {
    const intervalId = setInterval(() => checkReady(this.props.network.setWeb3WebClient), 500)

    function checkReady(setWeb3WebClient) {
      const onboardClicked = window.localStorage.getItem('onboardClicked')

      if (!onboardClicked) {
        clearInterval(intervalId)
        return
      }

      getUserState().then(({accessToAccounts, correctNetwork}) => {
        if (accessToAccounts && correctNetwork) {
          setTimeout(setWeb3WebClient, 250)
          clearInterval(intervalId)
          window.localStorage.removeItem('onboardClicked')
        }
      })
    }
  }
  
  onboard = async () => {
    window.localStorage.setItem('onboardClicked', 'true')
    if (!this.props.network.isMobile) {
      await onboardUser(window.web3Provider)
    }
    window.localStorage.removeItem('onboardClicked')
    this.props.network.setWeb3WebClient()
  }

  render() {
    const providerName = getWebClientProviderName();
    
    return (
      <div className="frame no-account">
        <div className="heading">
          <h2>Connect a Wallet</h2>
        </div>
        <section className="content">
          <div className="helper-text no-wrap">Get started by connecting one of the wallets below</div>
          <a href="#action" onClick={ e => { e.preventDefault(); providerName === 'metamask' ? this.onboard() : this.props.network.setWeb3WebClient() } } onTouchStart={ e => { e.preventDefault(); providerName === 'metamask' ? this.onboard() : this.props.network.setWeb3WebClient() } } className="web-wallet">
          {
            providerName ?
              <React.Fragment>
                <div className="provider-icon">{ walletIcons.hasOwnProperty(providerName) ? walletIcons[providerName] : walletIcons["web"] }</div>
                { this.props.formatClientName(providerName) }
              </React.Fragment>
            :
              <React.Fragment>
                <div className="provider-icon">{ walletIcons["web"] }</div>
                {this.props.network.isMobile ? "Mobile" : "Web"} Wallet
              </React.Fragment>
          }
          </a>
          {
          navigator.userAgent.toLowerCase().indexOf("firefox") === -1 &&
          <a href="#action" onClick={ e => { e.preventDefault(); this.props.network.showHW("ledger") } }>
            <div className="provider-icon">{ walletIcons["ledger"] }</div>
            Ledger Nano S
          </a>
          }
          <a href="#action" onClick={ e => { e.preventDefault(); this.props.network.showHW("trezor") } }>
            <div className="provider-icon">{ walletIcons["trezor"] }</div>
            Trezor
          </a>
        </section>
      </div>
    )
  }
}

export default WalletClientSelector;
