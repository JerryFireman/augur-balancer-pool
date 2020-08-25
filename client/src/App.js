import React, { Component } from "react";
import BPoolContract from "./contracts/BPool.json"
import YesContract from "./contracts/Yes.json";
import NoContract from "./contracts/No.json";
import DaiContract from "./contracts/Dai.json";
import getWeb3 from "./getWeb3";
import "./App.css";

//App controls the user interface
class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    web3: null,
    accounts: null,
    bpoolContract: null,
    bpoolAddress: null,
    yesContract: null,
    noContract: null,
    daiContract: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the BPool contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BPoolContract.networks[networkId];
      const bpoolInstance = new web3.eth.Contract(
        BPoolContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Get Yes contract instance
      const networkId2 = await web3.eth.net.getId();
      const deployedNetwork2 = YesContract.networks[networkId2];
      const yesInstance = new web3.eth.Contract(
        YesContract.abi,
        deployedNetwork2 && deployedNetwork2.address,
      );

      // Get No contract instance
      const networkId3 = await web3.eth.net.getId();
      const deployedNetwork3 = NoContract.networks[networkId3];
      const noInstance = new web3.eth.Contract(
        NoContract.abi,
        deployedNetwork3 && deployedNetwork3.address,
      );

      // Get Dai contract instance
      const networkId4 = await web3.eth.net.getId();
      const deployedNetwork4 = DaiContract.networks[networkId4];
      const daiInstance = new web3.eth.Contract(
        DaiContract.abi,
        deployedNetwork4 && deployedNetwork4.address,
      );

      // Set web3, accounts, and contracts to the state
      this.setState({
        web3,
        accounts,
        bpoolContract: bpoolInstance,
        yesContract: yesInstance,
        noContract: noInstance,
        daiContract: daiInstance,
      });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, contract or tokens. Check console for details.`,
      );
      console.error(error);
    }
  };

  // This function updates state in response to user input
  handleChange = async (e) => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(e.target.name, ": ", e.target.value);
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        Hello World
      </div>
    );
  };
}

export default App;