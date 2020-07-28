import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
      console.log(web3, accounts);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  async runExample(e) {
    const { accounts, contract } = this.state;
//------------------------------------------------------
    e.preventDefault();

        let number = this.number.value;
//------------------------------------------------------

    await contract.methods.set(number).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>

        <form className="form-horizontal" onSubmit={async (e)=> { await this.runExample(e) }}>
                <div className="form-group">
                  <label htmlFor="fullName" className="col-sm-2 control-label">Full Name</label>
                  <div className="col-sm-10">
                    <input type="number" ref={(input)=>this.number=input} className="form-control" id="number" placeholder="Enter a number" />
                  </div>
                </div>

                <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                  <button type="submit" className="btn btn-default">Insert</button>
                </div>
              </div>
            </form>


        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
