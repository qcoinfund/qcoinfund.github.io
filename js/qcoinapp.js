const TOKEN_CONTRACT_ADDR = '0x45EB209d2f758CF2Bc623578B0ADcb7e351eab77'; // TESTNET
const pancakeSwapURL = "https://pancake.kiemtienonline360.com/#/swap?outputCurrency="+TOKEN_CONTRACT_ADDR;
const tokenSymbol = 'Q';
const tokenDecimals = 9;
const tokenImage = 'https://qcoin.finance/assets/img/qcoin_logo.png'; // should be 512x512 I believe.
const CHAIN_ID = 97;

async function startApp(selectedAddress)
{
	// do app stuff.
	setupBuyButtons();

	// check that they are on the network and display appropriate message.
	checkNetwork();

	if (selectedAddress != null)
		setupAccount(selectedAddress);
	//const tokenContract = new web3.eth.Contract(TOKEN_CONTRACT_ABI,TOKEN_CONTRACT_ADDR);
}

function setupBuyButtons()
{
	const pcsLink = document.getElementById("pancakeBuyButton");
	if (pcsLink)
		pcsLink.href = pancakeSwapURL;
}

function checkNetwork()
{
	const networkMessageArea = document.getElementById("networkMessage");
	if (ethereum.networkVersion != null && ethereum.networkVersion != CHAIN_ID)
	{
		if (networkMessageArea)
			networkMessageArea.classList.remove("d-none");

		return;
	}
	else
	{
		if (networkMessageArea)
			networkMessageArea.classList.add("d-none");
	}
}

async function addCustomToken() {
	try {
	const wasAdded = await window.ethereum.request({
		method: 'wallet_watchAsset',
		params: {
		type: 'ERC20', // Initially only supports ERC20, but eventually more!
		options: {
			address: TOKEN_CONTRACT_ADDR, // The address that the token is at.
			symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
			decimals: tokenDecimals, // The number of decimals in the token
			image: tokenImage, // A string url of the token logo
		},
		},
	});

	if (wasAdded) {
		console.log('Thanks for your interest!');
	} else {
		console.log('Your loss!');
	}
	} catch (error) {
		console.log(error);
	}
}

const ethEnabled = async () => {
	if (window.ethereum) {
	  await window.ethereum.send('eth_requestAccounts');
	  window.web3 = new Web3(window.ethereum);
	  return true;
	}
	return false;
  }

const connectButton = document.getElementById('connectweb3');
if (connectButton)
	connectButton.addEventListener('click', connect);

async function connect() {
	/*
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(handleAccountsChanged)
    .catch((error) => {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log('Please connect to MetaMask.');
      } else {
        console.error(error);
      }
    });*/
	console.log("connect button clicked");
	try {
		const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
		const account = accounts[0];
		setupAccount(account);
	}
	catch(err) {
		console.log("Error with connecting to metamask.");
	}
}

function setupAccount(account) {
	const connectButton = document.getElementById('connectweb3');
	connectButton.classList.add("btn-success");
	connectButton.classList.remove("btn-dark");
	const connectButtonText = document.getElementById("connectweb3text");
	connectButtonText.innerText = account.substring(0,4).concat("...").concat(account.substring(account.length-4));
	connected(account);
}

async function connected(account)
{
	console.log("we are connected.");
}

function handleAccountsChanged()
{
	console.log("need to handle account that just changed.");
}

window.addEventListener('load', function() {
	if (typeof web3 !== 'undefined') {
		web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
		console.log("ethereum.networkVersion:"+ethereum.networkVersion);
		console.log("ethereum.selectedAddress:"+ethereum.selectedAddress);

		if (ethereum.selectedAddress)
		{
			startApp(ethereum.selectedAddress);
		}
		else
		{
			startApp(null);
		}

	} else {
		console.log("No web3.");
	}

	if (window.ethereum)
	{
		window.ethereum.on('accountsChanged', function (accounts) {
			console.log('accountsChanges',accounts);
			location.reload();
		});

		window.ethereum.on('chainChanged', function(networkId){
			console.log('chainChanged',networkId);
			location.reload();
		});
	}
});