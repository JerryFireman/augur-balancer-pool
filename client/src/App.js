import React, { Component } from "react";
import BFactoryContract from "./contracts/BFactory.json";
import BPoolContract from "./contracts/BPool.json";
import YesContract from "./contracts/Yes.json";
import NoContract from "./contracts/No.json";
import DaiContract from "./contracts/Dai.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import Trading from './components/Trading.js';
import PageHeader from './components/PageHeader.js';
import MarketHeader from './components/MarketHeader.js';
import Swap from './components/Swap.js';
const { abi } = require('./contracts/BPool.json');
const kovanYesAddress = "0x1dbccf29375304c38bd0d162f636baa8dd6cce44"
const kovanNoAddress = "0xeb69840f09A9235df82d9Ed9D43CafFFea2a1eE9"
const kovanDaiAddress = "0xb6085abd65e21d205aead0b1b9981b8b221fa14e"
const kovanPoolAddress = "0xbc6d6f508657c3c84983cd92f3eda6997e877e90"
const network = "kovan"; // set network as "ganache" or "kovan"
// if network is ganache, run truffle migrate --develop and disable metamask
// if network is kovan, enable metamask, set to kovan network and open account with kovan eth


//App controls the user interface
class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  };

  state = {
    web3: null,
    accounts: null,
    bfactoryContract: null,
    yesContract: null,
    noContract: null,
    daiContract: null,
    pool: null,
    bpoolAddress: null,
    fromToken: "",
    toToken: "",
    fromAmount: 0,
    toAmount: 0,
    yesContractAddress: "",
    noContractAddress: "",
    daiContractAddress: "",
    fromExact: true,
    fromBalance: 0,
    toBalance: 0,
    pricePerShare: 0,
    maxProfit: 0,
    priceImpact: 0,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log("accounts: ", accounts)

      if (network === "kovan") {
        var yesInstance = new web3.eth.Contract (
          YesContract.abi,
          kovanYesAddress
        );
        var noInstance = new web3.eth.Contract (
          NoContract.abi,
          kovanNoAddress
        );
        var daiInstance = new web3.eth.Contract (
          DaiContract.abi,
          kovanDaiAddress
        );
        var poolInstance = new web3.eth.Contract (
          BPoolContract.abi,
          kovanPoolAddress
        );

        this.setState({
          web3: web3,
          accounts: accounts,
          yesContract: yesInstance,
          noContract: noInstance,
          daiContract: daiInstance,
          pool: poolInstance,
          yesContractAddress: kovanYesAddress,
          noContractAddress: kovanNoAddress,
          daiContractAddress: kovanDaiAddress,
          bpoolAddress: kovanPoolAddress,
        });
      };

      if (network === "ganache") {
        // Get the BFactory contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = BFactoryContract.networks[networkId];
        var bfactoryInstance = new web3.eth.Contract(
          BFactoryContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        // Get Yes contract instance
        const networkId2 = await web3.eth.net.getId();
        const deployedNetwork2 = YesContract.networks[networkId2];
        yesInstance = new web3.eth.Contract(
          YesContract.abi,
          deployedNetwork2 && deployedNetwork2.address,
        );
        // Get No contract instance
        const networkId3 = await web3.eth.net.getId();
        const deployedNetwork3 = NoContract.networks[networkId3];
        noInstance = new web3.eth.Contract(
          NoContract.abi,
          deployedNetwork3 && deployedNetwork3.address,
        );

        // Get Dai contract instance
        const networkId4 = await web3.eth.net.getId();
        const deployedNetwork4 = DaiContract.networks[networkId4];
        daiInstance = new web3.eth.Contract(
          DaiContract.abi,
          deployedNetwork4 && deployedNetwork4.address,
        );

        // Set web3, accounts, and contracts to the state
        this.setState({
          web3,
          accounts,
          bfactoryContract: bfactoryInstance,
          yesContract: yesInstance,
          noContract: noInstance,
          daiContract: daiInstance,
        });

        var { bfactoryContract } = this.state;
        var { noContract } = this.state;
        var { yesContract } = this.state;
        var { daiContract } = this.state;
 
        // @ mint YES, NO and Dai and send to LP1
        await yesContract.methods.mint(accounts[1], web3.utils.toWei('5000')).send({ from: accounts[0] });
        await noContract.methods.mint(accounts[1], web3.utils.toWei('5000')).send({ from: accounts[0] });
        await daiContract.methods.mint(accounts[1], web3.utils.toWei('5000')).send({ from: accounts[0] });

        this.setState ({ 
          yesContractAddress: yesContract.options.address,
          noContractAddress: noContract.options.address,
          daiContractAddress: daiContract.options.address,
        });    

        // @ mint Dai and send to Trader1
        await daiContract.methods.mint(accounts[0], web3.utils.toWei('5000')).send({ from: accounts[0] });

        console.log("Balances of LP1 and Trader1 after minting and before pool creation");
        var LP1YesBalance = await yesContract.methods.balanceOf(accounts[1]).call();
        LP1YesBalance = web3.utils.fromWei(LP1YesBalance);
        var LP1NoBalance = await noContract.methods.balanceOf(accounts[1]).call();
        LP1NoBalance = web3.utils.fromWei(LP1NoBalance);
        console.log("LP1 No balance: ", LP1NoBalance);
        var trader1DaiBalance = await daiContract.methods.balanceOf(accounts[0]).call();
        trader1DaiBalance = web3.utils.fromWei(trader1DaiBalance);
        trader1DaiBalance = Number(trader1DaiBalance);
        trader1DaiBalance = trader1DaiBalance.toFixed(2);
        var zero = 0;
        zero = zero.toFixed(2);
        var trader1YesBalance = zero;
        var trader1NoBalance = zero;
        console.log("Trader1 Dai balance: ", trader1DaiBalance);
        this.setState({ trader1YesBalance: trader1YesBalance, trader1NoBalance: trader1NoBalance, trader1DaiBalance: trader1DaiBalance });

        // create a new balancer pool and save address to state, bind tokens and set public
        const tx = await bfactoryContract.methods.newBPool().send({from: accounts[1], gas: 6000000 });
        var bpoolAddress = tx.events.LOG_NEW_POOL.returnValues[1];
        this.setState({ bpoolAddress: bpoolAddress });
        var pool = new web3.eth.Contract(abi, this.state.bpoolAddress);
        this.setState( {pool: pool} );
        await yesContract.methods.approve(this.state.bpoolAddress, web3.utils.toWei('5000')).send( {from: accounts[1], gas: 6000000 });
        await pool.methods.bind(yesContract.options.address, web3.utils.toWei('5000'), web3.utils.toWei('18.75')).send( {from: accounts[1], gas: 6000000 });
        await noContract.methods.approve(this.state.bpoolAddress, web3.utils.toWei('5000')).send( {from: accounts[1], gas: 6000000 });
        await pool.methods.bind(noContract.options.address, web3.utils.toWei('5000'), web3.utils.toWei('6.25')).send( {from: accounts[1], gas: 6000000 });
        await daiContract.methods.approve(this.state.bpoolAddress, web3.utils.toWei('5000')).send( {from: accounts[1], gas: 6000000 });
        await pool.methods.bind(daiContract.options.address, web3.utils.toWei('5000'), web3.utils.toWei('25')).send( {from: accounts[1], gas: 6000000 });
        await pool.methods.setPublicSwap(true).send( {from: accounts[1], gas: 6000000 });
      };

    // Set starting parameters
    this.setState( {
      fromAmount: 0,
      toAmount: 0,
      fromToken: this.state.daiContractAddress,
      toToken: this.state.yesContractAddress,
    });
  
    await this.updateBalances();
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
    e.persist();
    console.log("handleChange working", e.target.name, ": ", e.target.value);
    await this.setState({ [e.target.name]: e.target.value });
    console.log("this.state.toToken: ", this.state.toToken)
    console.log("this.state.noContractAddress: ", this.state.noContractAddress)
    console.log("this.state.yesContractAddress: ", this.state.yesContractAddress)

    if (e.target.name === "fromAmount" && this.state.fromToken && this.state.toToken ) {
      await this.calcToGivenFrom();
      await this.calcPriceProfitSlippage()     
    }
    if (e.target.name === "toAmount" && this.state.fromToken && this.state.toToken) {
      await this.calcFromGivenTo();      
      await this.calcPriceProfitSlippage()     
    }
    if (e.target.name === "toToken" || e.target.name === "fromToken") {
      console.log("about to update balances")
      this.updateBalances();
      this.setState({ fromAmount: 0, toAmount: 0, pricePerShare: 0, maxProfit: 0, priceImpact: 0 });      
    }
  };

  // Calculates number of "to" tokens received for a given number of "from" tokens
  calcToGivenFrom = async () => {
    const { pool } = this.state;
    const { web3 } = this.state;
    const { fromToken } = this.state;
    const { toToken } = this.state;
    const { daiContractAddress } = this.state;

    try {

      var fromTokenBalance = await pool.methods.getBalance(fromToken).call();
      fromTokenBalance = Number(web3.utils.fromWei(fromTokenBalance));
      if (network === "kovan" && fromToken !== daiContractAddress) {
        fromTokenBalance = 100 * fromTokenBalance;
      }
      console.log("CTGF fromTokenBalance: ", fromTokenBalance);


      var fromTokenWeight = await pool.methods.getNormalizedWeight(fromToken).call();
      fromTokenWeight = web3.utils.fromWei(fromTokenWeight);

      var toTokenBalance = await pool.methods.getBalance(toToken).call();
      toTokenBalance = web3.utils.fromWei(toTokenBalance);
      if (network === "kovan" && toToken !== daiContractAddress) {
        toTokenBalance = 100 * toTokenBalance;
      }
      console.log("CFGT toTokenBalance: ", toTokenBalance);

      var toTokenWeight = await pool.methods.getNormalizedWeight(toToken).call();
      toTokenWeight = web3.utils.fromWei(toTokenWeight);

      console.log("fromTokenBalance + fromAmount: ", Number(fromTokenBalance) + Number(this.state.fromAmount) )

      var intermediate1 = Number(fromTokenBalance) / ( Number(fromTokenBalance) + Number(this.state.fromAmount) ) 
      console.log ("fromTokenWeight / toTokenWeight: ", fromTokenWeight / toTokenWeight)
      var intermediate2 =  intermediate1 ** (fromTokenWeight / toTokenWeight)
      console.log ("intermediate2: ", intermediate2)
      var toAmount = Number(toTokenBalance) * ( 1 -  intermediate2  );
      toAmount = toAmount.toFixed(2)      
      console.log("toAmount: ", toAmount);
      this.setState( { toAmount: toAmount, fromExact: true } );
      await this.calcPriceProfitSlippage();

      return toAmount ;
    } catch (error) {
      alert(
        `Calculate number of to tokens received failed. Check console for details.`,
      );
      console.error(error);
    }
  };

  // Calculates number of "from" tokens received for a given number of "to" tokens
  calcFromGivenTo = async () => {
    const { pool } = this.state;
    const { web3 } = this.state;
    const { fromToken } = this.state;
    const { toToken } = this.state;
    const { daiContractAddress } = this.state;

    try {
      var fromTokenBalance = await pool.methods.getBalance(fromToken).call();
      fromTokenBalance = Number(web3.utils.fromWei(fromTokenBalance));
      if (network === "kovan" && fromToken !== daiContractAddress) {
        fromTokenBalance = 100 * fromTokenBalance;
      }
      console.log("CFGT fromTokenBalance: ", fromTokenBalance);

      var fromTokenWeight = await pool.methods.getNormalizedWeight(fromToken).call();
      fromTokenWeight = web3.utils.fromWei(fromTokenWeight);

      var toTokenBalance = await pool.methods.getBalance(toToken).call();
      toTokenBalance = web3.utils.fromWei(toTokenBalance);
      if (network === "kovan" && toToken !== daiContractAddress) {
        toTokenBalance = 100 * toTokenBalance;
      }
      console.log("CFGT toTokenBalance: ", toTokenBalance);

      var toTokenWeight = await pool.methods.getNormalizedWeight(toToken).call();
      toTokenWeight = web3.utils.fromWei(toTokenWeight);

      var intermediate1 = Number(toTokenBalance) / ( Number(toTokenBalance) - Number(this.state.toAmount) );
      console.log("Number(toTokenBalance) + Number(this.state.toAmount): ", Number(toTokenBalance) - Number(this.state.toAmount))
      console.log("intermediate1: ", intermediate1);
      var intermediate2 =  intermediate1 ** (toTokenWeight / fromTokenWeight);
      var exponent = toTokenWeight / fromTokenWeight
      console.log("exponent: ", exponent);
      console.log("intermediate2: ", intermediate2);
      var fromAmount = fromTokenBalance * ( intermediate2 - 1 );
      fromAmount =  fromAmount.toFixed(2);
      this.setState( { fromAmount: fromAmount, fromExact: false } );
      console.log("fromAmount: ", fromAmount);
      await this.calcPriceProfitSlippage();

    } catch (error) {
      alert(
        `Calculate number of from tokens paid failed. Check console for details.`,
      );
      console.error(error);
    }
  };

  // This function determines whether to swapExactAmountIn or swapExactAmountOut
  swapBranch = async () => {
    console.log("swapBranch started")
    if (this.state.fromExact) {
      await this.swapExactAmountIn();
    } else {
      await this.swapExactAmountOut();
    };
  };


// Swap with the number of "from" tokens fixed
  swapExactAmountIn = async () => {
    const { web3 } = this.state;
    const { accounts } = this.state;
    const { pool } = this.state;
    const { fromToken } = this.state;
    const { toToken } = this.state;
    const { noContract } = this.state;
    const { noContractAddress } = this.state;
    const { yesContract } = this.state;
    const { yesContractAddress } = this.state;
    const { daiContract } = this.state;
    const { daiContractAddress } = this.state;
    const { bpoolAddress } = this.state;
    var { fromAmount } = this.state;
    var { toAmount } = this.state;
  
    console.log("SEAI toAmount: ", toAmount)
    if (network === "kovan" && fromToken !== daiContractAddress) {
      fromAmount = fromAmount / 100;
    }
    console.log("SEAI fromAmount: ", fromAmount)
    if (network === "kovan" && toToken !== daiContractAddress) {
      toAmount = toAmount / 100;
    }
    console.log("SEAI toAmount: ", toAmount)
    var maxPrice = 2 * (fromAmount / toAmount);
    console.log("SEAI maxPrice: ", maxPrice)
    toAmount = 0
    fromAmount = web3.utils.toWei(fromAmount.toString());
    toAmount = web3.utils.toWei(toAmount.toString());
    maxPrice = web3.utils.toWei(maxPrice.toString())
  
      try {
      //approve fromAmount of fromToken for spending by Trader1
      if (fromToken === noContractAddress) {
        await noContract.methods.approve(bpoolAddress, fromAmount).send({from: accounts[0], gas: 6000000 });
        var noAllowance = await noContract.methods.allowance(accounts[0], bpoolAddress).call();
        console.log("noAllowance: ", noAllowance);
      } else if (fromToken === yesContractAddress) {
        await yesContract.methods.approve(bpoolAddress, fromAmount).send({from: accounts[0], gas: 6000000 });
        var yesAllowance = await yesContract.methods.allowance(accounts[0], bpoolAddress).call();
        console.log("yesAllowance: ", yesAllowance);
      } else if (fromToken === daiContractAddress) {
        console.log("hit approve dai in SEAI")
        var tx1 = await daiContract.methods.approve(bpoolAddress, fromAmount).send({from: accounts[0], gas: 6000000 });
        console.log("Successful transaction: ", await tx1.status)
        console.log("tx1: ", tx1)
        var daiAllowance = await daiContract.methods.allowance(accounts[0], bpoolAddress).call();
        console.log("daiAllowance: ", daiAllowance);
        } 
      var tx = await pool.methods.swapExactAmountIn(fromToken, fromAmount, toToken, toAmount, maxPrice).send({from: accounts[0], gas: 6000000 });
        console.log("Successful transaction: ", tx.status)
        console.log("Checking balances after transaction ...")
        var trader1YesBalance = await yesContract.methods.balanceOf(accounts[0]).call();
        trader1YesBalance = web3.utils.fromWei(trader1YesBalance)
        trader1YesBalance = Number(trader1YesBalance);
        trader1YesBalance = trader1YesBalance.toFixed(2);
        console.log("trader1YesBalance: ", trader1YesBalance)
        var trader1NoBalance = await noContract.methods.balanceOf(accounts[0]).call();
        trader1NoBalance = web3.utils.fromWei(trader1NoBalance)
        trader1NoBalance = Number(trader1NoBalance);
        trader1NoBalance = trader1NoBalance.toFixed(2);
        console.log("trader1NoBalance: ", trader1NoBalance)
        var trader1DaiBalance = await daiContract.methods.balanceOf(accounts[0]).call();
        trader1DaiBalance = web3.utils.fromWei(trader1DaiBalance);
        trader1DaiBalance = Number(trader1DaiBalance);
        trader1DaiBalance = trader1DaiBalance.toFixed(2);
        console.log("Trader1 Dai balance: ", trader1DaiBalance);
        this.setState({ trader1YesBalance: trader1YesBalance, trader1NoBalance: trader1NoBalance, trader1DaiBalance: trader1DaiBalance });
        await this.updateBalances();

      } catch (error) {
      alert(
        `Swap with from tokens fixed failed. Check console for details.`,
      );
      console.error(error);
    }
  }; 
  
// Swap with the number of "to"" tokens fixed
swapExactAmountOut = async () => {
  const { web3 } = this.state;
  const { accounts } = this.state;
  const { pool } = this.state;
  const { fromToken } = this.state;
  const { toToken } = this.state;
  const { noContract } = this.state;
  const { noContractAddress } = this.state;
  const { yesContract } = this.state;
  const { yesContractAddress } = this.state;
  const { daiContract } = this.state;
  const { daiContractAddress } = this.state;
  const { bpoolAddress } = this.state;
  var { fromAmount } = this.state;
  var { toAmount } = this.state;

  if (network === "kovan" && toToken !== daiContractAddress) {
    toAmount = toAmount / 100;
  }
  console.log("SEAO toAmount: ", toAmount)
  if (network === "kovan" && fromToken !== daiContractAddress) {
    fromAmount = fromAmount / 100;
  }
  fromAmount = 2 * fromAmount;
  console.log("SEAO fromAmount: ", fromAmount)

  var maxPrice = 2 * (fromAmount / toAmount);
  console.log("SEAO maxPrice: ", maxPrice)
  fromAmount = web3.utils.toWei(fromAmount.toString());
  toAmount = web3.utils.toWei(toAmount.toString());
  maxPrice = web3.utils.toWei(maxPrice.toString())

  try {
    //approve fromAmount of fromToken for spending by Trader1

    if (fromToken === noContractAddress) {
      await noContract.methods.approve(bpoolAddress, fromAmount).send({from: accounts[0], gas: 6000000 });
      var noAllowance = await noContract.methods.allowance(accounts[0], bpoolAddress).call();
      console.log("noAllowance: ", noAllowance);
    } else if (fromToken === yesContractAddress) {
      await yesContract.methods.approve(bpoolAddress, fromAmount).send({from: accounts[0], gas: 6000000 });
      var yesAllowance = await yesContract.methods.allowance(accounts[0], bpoolAddress).call();
      console.log("yesAllowance: ", yesAllowance);
    } else if (fromToken === daiContractAddress) {
      console.log("hit approve dai branch")
      var tx1 = await daiContract.methods.approve(bpoolAddress, fromAmount).send({from: accounts[0], gas: 6000000 });
      console.log("Successful transaction: ", tx1.status)
      console.log("tx: ", tx1)
      var daiAllowance = await daiContract.methods.allowance(accounts[0], bpoolAddress).call();
      console.log("daiAllowance: ", daiAllowance);
    } 
      var tx2 = await pool.methods.swapExactAmountOut(fromToken, fromAmount, toToken, toAmount, maxPrice).send({from: accounts[0], gas: 6000000 });
      console.log("Successful transaction: ", tx2.status)
      console.log("tx2: ", tx2)
      console.log("Checking balances after transaction ...")
      var trader1YesBalance = await yesContract.methods.balanceOf(accounts[0]).call();
      trader1YesBalance = web3.utils.fromWei(trader1YesBalance)
      trader1YesBalance = Number(trader1YesBalance);
      trader1YesBalance = trader1YesBalance.toFixed(2);
      console.log("trader1YesBalance: ", trader1YesBalance)
      var trader1NoBalance = await noContract.methods.balanceOf(accounts[0]).call();
      trader1NoBalance = web3.utils.fromWei(trader1NoBalance)
      trader1NoBalance = Number(trader1NoBalance);
      trader1NoBalance = trader1NoBalance.toFixed(2);
      console.log("trader1NoBalance: ", trader1NoBalance)
      var trader1DaiBalance = await daiContract.methods.balanceOf(accounts[0]).call();
      trader1DaiBalance = web3.utils.fromWei(trader1DaiBalance);
      trader1DaiBalance = Number(trader1DaiBalance);
      trader1DaiBalance = trader1DaiBalance.toFixed(2);
      console.log("Trader1 Dai balance: ", trader1DaiBalance);
      this.setState({ trader1YesBalance: trader1YesBalance, trader1NoBalance: trader1NoBalance, trader1DaiBalance: trader1DaiBalance });
      await this.updateBalances();
    } catch (error) {
      alert(
        `Swap with number of from tokens fixed failed. Check console for details.`,
      );
      console.error(error);
    }
  }; 
  
  // This function updates trader balances initially and after sale
  // Also resets price per share, max profit and price impact to 0
  updateBalances = async () => {
    const { web3 } = this.state;
    const { fromToken } = this.state;
    const { toToken } = this.state;
    const { noContract } = this.state;
    const { yesContract } = this.state;
    const { daiContract } = this.state;
    const { noContractAddress } = this.state;
    const { yesContractAddress } = this.state;
    const { daiContractAddress } = this.state;
    const { accounts } = this.state;

    if (fromToken === yesContractAddress) {
      var trader1YesBalance = await yesContract.methods.balanceOf(accounts[0]).call();
      trader1YesBalance = web3.utils.fromWei(trader1YesBalance)
      trader1YesBalance = Number(trader1YesBalance);
      if (network === "kovan") {
        trader1YesBalance = 100 * trader1YesBalance;
      }
      trader1YesBalance = trader1YesBalance.toFixed(2);
      this.setState({ fromBalance: trader1YesBalance});
    }
    if (fromToken === noContractAddress) {
      var trader1NoBalance = await noContract.methods.balanceOf(accounts[0]).call();
      trader1NoBalance = web3.utils.fromWei(trader1NoBalance)
      trader1NoBalance = Number(trader1NoBalance);
      if (network === "kovan") {
        trader1NoBalance = 100 * trader1NoBalance;
      }
      trader1NoBalance = trader1NoBalance.toFixed(2);
      this.setState({ fromBalance: trader1NoBalance});
    }
    if (fromToken === daiContractAddress) {
      var trader1DaiBalance = await daiContract.methods.balanceOf(accounts[0]).call();
      trader1DaiBalance = web3.utils.fromWei(trader1DaiBalance)
      trader1DaiBalance = Number(trader1DaiBalance);
      trader1DaiBalance = trader1DaiBalance.toFixed(2);
      this.setState({ fromBalance: trader1DaiBalance})
    }
    if (toToken === yesContractAddress) {
      trader1YesBalance = await yesContract.methods.balanceOf(accounts[0]).call();
      trader1YesBalance = web3.utils.fromWei(trader1YesBalance)
      trader1YesBalance = Number(trader1YesBalance);
      if (network === "kovan") {
        trader1YesBalance = 100 * trader1YesBalance;
      }
      trader1YesBalance = trader1YesBalance.toFixed(2);
      this.setState({ toBalance: trader1YesBalance});
    }
    if (toToken === noContractAddress) {
      trader1NoBalance = await noContract.methods.balanceOf(accounts[0]).call();
      trader1NoBalance = web3.utils.fromWei(trader1NoBalance)
      trader1NoBalance = Number(trader1NoBalance);
      if (network === "kovan") {
        trader1NoBalance = 100 * trader1NoBalance;
      }
      trader1NoBalance = trader1NoBalance.toFixed(2);
      this.setState({ toBalance: trader1NoBalance});
    }
    if (toToken === daiContractAddress) {
      console.log("hit fromToken === daiContractAddress")
      trader1DaiBalance = await daiContract.methods.balanceOf(accounts[0]).call();
      trader1DaiBalance = web3.utils.fromWei(trader1DaiBalance)
      trader1DaiBalance = Number(trader1DaiBalance);
      trader1DaiBalance = trader1DaiBalance.toFixed(2);
      console.log("trader1DaiBalance for form: ", trader1DaiBalance)
      this.setState({ toBalance: trader1DaiBalance})
    }
    this.setState({ fromAmount: 0, toAmount: 0, pricePerShare: 0, maxProfit: 0, priceImpact: 0})
  };

  // This function calculates miscellaneous numbers after quote
  calcPriceProfitSlippage = async () => {
    const { fromToken } = this.state;
    const { toToken } = this.state;
    const { fromAmount } = this.state;
    const { toAmount } = this.state;
    const { yesContractAddress } = this.state;
    const { noContractAddress } = this.state;
    const { daiContractAddress } = this.state;
    const { pool } = this.state
    const { web3 } = this.state

    if ( ( toToken === yesContractAddress || toToken === noContractAddress )  && fromToken === daiContractAddress) {
      var spotPrice = await pool.methods.getSpotPrice(fromToken, toToken).call();
      spotPrice = web3.utils.fromWei(spotPrice)
      spotPrice = Number(spotPrice);
      if (network === "kovan") {
        spotPrice = spotPrice / 100;
      }
      spotPrice = spotPrice.toFixed(4)
      console.log("CPPS spotPrice", spotPrice);
      var pricePerShare = fromAmount / toAmount;
      pricePerShare = pricePerShare.toFixed(4);
      var maxProfit = 1 - pricePerShare;
      var priceImpact = (pricePerShare - spotPrice) * 100
      pricePerShare = Number(pricePerShare);
      pricePerShare = pricePerShare.toFixed(2);
      maxProfit = maxProfit.toFixed(2);
      priceImpact = priceImpact.toFixed(2);
      console.log("pricePerShare: ", pricePerShare)
      console.log("maxProfit: ", maxProfit)
      console.log("priceImpact: ", priceImpact)  
      this.setState({ 
        pricePerShare: pricePerShare,
        maxProfit: maxProfit,
        priceImpact: priceImpact,
      });

    } else if  ((fromToken === yesContractAddress || fromToken === noContractAddress ) && toToken === daiContractAddress ) {
      spotPrice = await pool.methods.getSpotPrice(fromToken, toToken).call();
      spotPrice = web3.utils.fromWei(spotPrice)
      spotPrice = Number(spotPrice);
      spotPrice = spotPrice.toFixed(4);
      spotPrice = 1 / spotPrice;
      if (network === "kovan") {
        spotPrice = spotPrice * 100;
      }
      console.log("CPPS spotPrice", spotPrice);
      pricePerShare = toAmount / fromAmount;
      pricePerShare = pricePerShare.toFixed(4);
      priceImpact = (spotPrice - pricePerShare) * 100
      pricePerShare = Number(pricePerShare);
      pricePerShare = pricePerShare.toFixed(2);
      priceImpact = priceImpact.toFixed(2);
      console.log("pricePerShare: ", pricePerShare)
      console.log("priceImpact: ", priceImpact)  
      this.setState({ 
        pricePerShare: pricePerShare,
        maxProfit: 0,
        priceImpact: priceImpact,
      });
    } else {
      this.setState({ 
        pricePerShare: 0,
        maxProfit: 0,
        priceImpact: 0,
      });
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
      <PageHeader/>
      <MarketHeader/>
      <Trading 
        handleChange={this.handleChange}
        fromAmount={this.state.fromAmount}
        fromToken={this.state.fromToken}
        toAmount={this.state.toAmount}
        toToken={this.state.toToken}
        fromBalance={this.state.fromBalance}  
        toBalance={this.state.toBalance}        
        yesContractAddress={this.state.yesContractAddress}
        noContractAddress={this.state.noContractAddress}
        daiContractAddress={this.state.daiContractAddress}
        pricePerShare={this.state.pricePerShare}
        maxProfit={this.state.maxProfit}
        priceImpact={this.state.priceImpact}
      />
      <Swap
        swapBranch={this.swapBranch}
      />
      </div>
    );
  };
};

export default App;