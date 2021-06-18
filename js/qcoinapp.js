const CHAIN_ID = 97; // TESTNET=97
const TOKEN_CONTRACT_ADDR = '0x45EB209d2f758CF2Bc623578B0ADcb7e351eab77'; // TESTNET TOKEN CONTRACT
const TOKEN_PRICE_LP = '0x6a34f03db48f6dfffad221edd5264123e875d97c'; // TESTNET LP

const tokenSymbol = 'Q';
const tokenDecimals = 9;
const BURNWALLET = "0x000000000000000000000000000000000000dead";

let pancakeSwapURL = "https://pancakeswap.finance/"+TOKEN_CONTRACT_ADDR;
let bscURL = "https://bscnscan.com/address/"+TOKEN_CONTRACT_ADDR;
let chartURL = "https://poocoin.app/tokens/"+TOKEN_CONTRACT_ADDR;

if (CHAIN_ID == 97)
{
	pancakeSwapURL = "https://pancake.kiemtienonline360.com/#/swap?outputCurrency="+TOKEN_CONTRACT_ADDR;
	bscURL = "https://testnet.bscnscan.com/address/"+TOKEN_CONTRACT_ADDR;
}

const tokenImage = 'https://qcoin.finance/assets/img/qcoin_logo.png'; // should be 512x512 I believe.

async function startApp(selectedAddress)
{
	// do app stuff.
	updateStaticContent();

	// check that they are on the network and display appropriate message.
	checkNetwork();

	if (selectedAddress != null)
		setupAccount(selectedAddress);

	const tokenContract = new web3.eth.Contract(TOKEN_CONTRACT_ABI,TOKEN_CONTRACT_ADDR);
	console.log("tokenContrct",tokenContract);
	const decimals = await tokenContract.methods.decimals().call();
	console.log("Decimals is: " + decimals);
	const burnBalance = await tokenContract.methods.balanceOf(BURNWALLET).call();
	let burnBalanceHR = addDecimalPlace(burnBalance,decimals); // human readable.
	console.log("Burn balance: " + burnBalance + " human Readable: " + burnBalanceHR);

	const totalSupply = await tokenContract.methods.totalSupply().call();
	let totalSupplyHR = addDecimalPlace(totalSupply,decimals);
	updateTokenFigures(burnBalanceHR, totalSupplyHR);
}

function updateTokenFigures(burnBalance, totalSupply)
{
  const burnArea = document.getElementById("burnedTokens");
  if (burnArea)
    burnArea.innerHTML = burnBalance+"";
  
  const totalSupplyArea = document.getElementById("totalSupply");
  if (totalSupplyArea)
    totalSupplyArea.innerHTML = totalSupply+"";
}

function addDecimalPlace(number,decimals)
{
  let bigNum = new BigNumber(number);
  let bigNumHR = bigNum.shiftedBy(parseInt(-decimals));
  return bigNumHR;
}

function updateStaticContent()
{
  setupBuyButtons();
  populateContractAddress();
  setupBlockScannerButton();
}

function setupBuyButtons()
{
	const pcsLink = document.getElementById("pancakeBuyButton");
  	const pcsLink2 = document.getElementById("pancakeBuyButton1");

	if (pcsLink)
		pcsLink.href = pancakeSwapURL;

  if (pcsLink2)
	  pcsLink2.href = pancakeSwapURL;
}

function setupBlockScannerButton()
{
	const bscButton = document.getElementById("bscbutton");
	if (bscButton)
		bscButton.href = bscURL;
}

function setupChartButton()
{
	const chartButton = document.getElementById("poobutton");
	if (chartButton)
		chartButton.href = chartURL;
}

function populateContractAddress()
{
  const contractAddress1 = document.getElementById("contractAddress");
  if (contractAddress1)
    contractAddress1.innerHTML = TOKEN_CONTRACT_ADDR;
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

/*
const ethEnabled = async () => {
	if (window.ethereum) {
		await window.ethereum.send('eth_requestAccounts');
		window.web3 = new Web3(window.ethereum);
		return true;
	}
	
	return false;
}*/

const connectButton = document.getElementById('connectweb3');
if (connectButton)
	connectButton.addEventListener('click', connect);

const addTokenButton = document.getElementById('addCustomToken');
if (addTokenButton) {
  addTokenButton.addEventListener('click', () => {
    addCustomToken();
  });  
}

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

async function getTokenPrice() {  
	const lpContract = new web3.eth.Contract(poolABI,TOKEN_PRICE_LP);
	token0 = await lpContract.methods.token0().call();
	token1 = await lpContract.methods.token1().call();

	var token0Price = 0;
	var token1Price = 0;

	if (prices[token0])
		token0Price = prices[token0].usd; // E.g. MATIC->USDC

	if (prices[token1])
		token1Price = prices[token1].usd; // E.g. 1 USDC worth of MATIC

	var tokenPrice = 0;

	if (token0Price == 0 && token1Price > 0)
	{
		console.log("need token0 price..");
	}
	else if (token0Price > 0 && token1Price == 0)
	{
		// need token1 price
		const reserves = await lpContract.methods.getReserves().call();
		const reserve0 = reserves[0];
		const reserve1 = reserves[1];
		const altRate = reserve0/reserve1;
		tokenPrice = altRate * (token0Price);
		prices[TOKEN_CONTRACT_ADDR] = {usd: tokenPrice};
	}

	return tokenPrice;
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
	} 
  else 
  {
		updateStaticContent();
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