import React from 'react';
import {observer} from "mobx-react";
import {capitalize} from "../helpers";

class WalletHardHWSelector extends React.Component {

  selectAccount = e => {
    this.props.network.selectHWAddress(e.target.value);
  }

  render() {
    return (
      <div>
        {
          this.props.network.hw.loading
          ?
            <React.Fragment>
              <h2>
                Connecting to {capitalize(this.props.network.hw.option)}
              </h2>
              <button href="#action" onClick={ this.props.network.hideHw }>Cancel</button>
            </React.Fragment>
          :
            <React.Fragment>
              {
                this.props.network.hw.error &&
                <React.Fragment>
                  <h2>{ capitalize(this.props.network.hw.option) } Connection Failed</h2>
                  {
                    this.props.network.hw.option === 'ledger' &&
                    <ul>
                      <li>Unlock you ledger and open the ETH application.</li>
                      <li>Verify Contract Data &amp; Browser Support are enabled in the ETH settings.</li>
                      <li>If Browser Support is not an option in settings, update to the latest firmware.</li>
                    </ul>
                  }
                  <div>
                    <button href="#action" onClick={ this.props.network.hideHw }>Cancel</button>&nbsp;
                    <button href="#action" onClick={ this.props.network.loadHWAddresses }>Detect</button>
                  </div>
                </React.Fragment>
              }
              {
                this.props.network.hw.addresses.length > 0 &&
                <React.Fragment>
                  Choose Address:
                  <select onChange={ this.selectAccount } defaultValue={ this.props.network.hw.addresses[this.props.network.hw.addressIndex] } >
                    {
                      this.props.network.hw.addresses.map(key =>
                        <option key={ key } value={ key }>{ key }</option>
                      )
                    }
                  </select>
                  {
                    <button onClick={ this.props.network.importAddress }>Connect this Address</button>
                  }
                </React.Fragment>
              }
            </React.Fragment>
        }
      </div>
    )
  }
}

export default observer(WalletHardHWSelector);
