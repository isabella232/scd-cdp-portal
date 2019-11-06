// Libraries
import React from "react";
import {inject, observer} from "mobx-react";

// Utils
import {getWebClientProviderName} from "../utils/blockchain";
import walletIcons from "./WalletIcons";

@inject("network")
@observer
class WalletClientSelector extends React.Component {
  render() {
    const providerName = getWebClientProviderName();
    return (
      <div className="frame no-account">
        <div className="heading">
          <h2>Connect a Wallet</h2>
        </div>
        <section className="content">
          <div className="helper-text no-wrap">Get started by selecting and connecting your wallet</div>
          <a href="#action" onClick={ e => { e.preventDefault(); this.props.network.setWeb3WebClient() } } className="web-wallet">
                <div className="provider-icon">{ walletIcons["web"] }</div>
                Select Wallet
          </a>
        </section>
      </div>
    )
  }
}

export default WalletClientSelector;
