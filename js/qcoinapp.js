const CHAIN_ID = 97; // TESTNET=97
const TOKEN_CONTRACT_ADDR = '0x7583Ea0945d8738EbdeCe8e60ca02E9ab92AA205'; // TESTNET TOKEN CONTRACT
const TOKEN_PRICE_LP = null; // TESTNET LP
const ICO_CONTRACT_ADDR = '0x02c912cF601AA679B57b8039BE91D2D0Faeba94F'; // TESTNET ICO
const PRESALE_RATE = 1000000; // ICO rate for 1 BNB

const tokenSymbol = 'Q';
const tokenDecimals = 9;
const BURNWALLET = "0x000000000000000000000000000000000000dead";

let pancakeSwapURL = "https://pancakeswap.finance/"+TOKEN_CONTRACT_ADDR;
let bscURL = "https://bscscan.com/address/"+TOKEN_CONTRACT_ADDR;
let chartURL = "https://poocoin.app/tokens/"+TOKEN_CONTRACT_ADDR;

if (CHAIN_ID == 97)
{
	pancakeSwapURL = "https://pancake.kiemtienonline360.com/#/swap?outputCurrency="+TOKEN_CONTRACT_ADDR;
	bscURL = "https://testnet.bscscan.com/address/"+TOKEN_CONTRACT_ADDR;
}

const tokenImage = 'https://qcoin.finance/assets/img/qcoin_logo.png'; // should be 512x512 I believe.

async function startApp(selectedAddress)
{
	// do app stuff.
	updateStaticContent();

	// check that they are on the network and display appropriate message.
	if (typeof ethereum !== 'undefined')
		checkNetwork();

	if (selectedAddress != null)
		setupAccount(selectedAddress);

	const tokenContract = new web3.eth.Contract(TOKEN_CONTRACT_ABI,TOKEN_CONTRACT_ADDR);
	const decimals = await tokenContract.methods.decimals().call();
	const burnBalance = await tokenContract.methods.balanceOf(BURNWALLET).call();
	let burnBalanceHR = addDecimalPlace(burnBalance,decimals); // human readable.
	const totalSupply = await tokenContract.methods.totalSupply().call();
	let totalSupplyHR = addDecimalPlace(totalSupply,decimals);
	updateTokenFigures(burnBalanceHR, totalSupplyHR);

	if (TOKEN_PRICE_LP != null)
	{
		console.log("Fetching prices..");
		const prices = await getBscPrices();

		// for testnet.
		prices["0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"] = prices["0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"];

		let tokenPrice = await getTokenPrice(prices);
		console.log("tokenPrice: " + tokenPrice);

		updateTokenPrice(tokenPrice);
		updateMarketCap(tokenPrice, totalSupplyHR);
	}
	
	//holders(tokenContract);
}

function holders(tokenContract)
{
	console.dir(tokenContract.events);
	event_filter = tokenContract.events.Transfer.createFilter(fromBlock='latest', argument_filters={'arg1':10})
	console.log("event_filter", event_filter);

	tx_list = filtering.get(only_changes=False);
	console.log("tx_list",tx_list);
}
function updateTokenPrice(tokenPrice)
{
  const tokenPriceArea = document.getElementById("tokenPrice");
  if (tokenPriceArea)
  	tokenPriceArea.innerHTML = "$"+tokenPrice.toLocaleString(  undefined, // leave undefined to use the visitor's browser 
             // locale or a string like 'en-US' to override it.
  			{ minimumFractionDigits: 10 })+"";  
}

function updateMarketCap(tokenPrice, totalSupply)
{
	let marketCap = tokenPrice*totalSupply;
	const marketCapArea = document.getElementById("marketCap");
	if (marketCapArea)
		marketCapArea.innerHTML = new Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(marketCap);  
}

function updateTokenFigures(burnBalance, totalSupply)
{
  const burnArea = document.getElementById("burnedTokens");
  if (burnArea)
    burnArea.innerHTML = new Intl.NumberFormat().format(burnBalance)+"";
  
  const totalSupplyArea = document.getElementById("totalSupply");
  if (totalSupplyArea)
    totalSupplyArea.innerHTML = new Intl.NumberFormat().format(totalSupply)+"";
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
  setupChartButton();
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
		console.log("Error with connecting to metamask: " + err);
	}
}

function setupAccount(account) {
	console.log("setupAccount: "+ account);
	const connectButton = document.getElementById('connectweb3');
	connectButton.classList.add("btn-success");
	connectButton.classList.remove("btn-dark");
	const connectButtonText = document.getElementById("connectweb3text");
	connectButtonText.innerText = account.substring(0,4).concat("...").concat(account.substring(account.length-4));

	setupPreSale(account);
	connected(account);
}

let balanceHR = 0;

async function setupPreSale(walletAddress)
{
	const presaleArea = document.getElementById("presale-connected");
	const presaleNotConnectedArea = document.getElementById("presale-notconnected");
	presaleArea.classList.remove("d-none");
	presaleNotConnectedArea.classList.add("d-none");

	const btn = document.getElementById('purchase-button');
	btn.disabled = true; // Disable by default.
	
	setupPurchaseButton();
	//let balance = await tokenContract.methods.balanceOf(walletAddress).call();
	let balance = await web3.eth.getBalance(walletAddress);
	balanceHR = web3.utils.fromWei(balance);

	let balanceBox = document.getElementById("bnbbalance");
	balanceBox.innerHTML = balanceHR+"";
	//let balanceBN = new BigNumber(balance);
	//let balanceBNHR = reserve0big.shiftedBy(parseInt(-decimals));
	setupPresetButtons();

	const inputBox = document.getElementById("purchase-amount");
	inputBox.addEventListener('change', inputChanged);
}

function setupPresetButtons()
{
	const btnmax = document.getElementById('max-button');
	btnmax.addEventListener('click',presetMax);

	const btn25pct = document.getElementById('button-25');
	btn25pct.addEventListener('click',preset25PCT);

	const btn50pct = document.getElementById('button-50');
	btn50pct.addEventListener('click',preset50PCT);

	const btn75pct = document.getElementById('button-75');
	btn75pct.addEventListener('click',preset75PCT);

	const btn100pct = document.getElementById('button-100');
	btn100pct.addEventListener('click',presetMax);
}

function presetMax()
{
	updateInputs(balanceHR-0.01);
}

function preset25PCT()
{
	updateInputs(balanceHR*0.25);
}

function preset50PCT()
{
	updateInputs(balanceHR*0.5);
}

function preset75PCT()
{
	updateInputs(balanceHR*0.75);
}

function inputChanged()
{
	const inputBox = document.getElementById("purchase-amount");	
	let inputsBNB = inputBox.value;
	
	const purchaseButton = document.getElementById('purchase-button');
	if (inputsBNB != null && inputsBNB != "" && inputsBNB > 0)
		purchaseButton.disabled = false;
	else
		purchaseButton.disabled = true;

	updateGetBox(inputsBNB);
}

function updateInputs(bnb)
{
	updateGetBox(bnb);
	const inputBox = document.getElementById("purchase-amount");
	inputBox.value = bnb;
	const btn = document.getElementById('purchase-button');
	btn.disabled = false;
}

function setupPurchaseButton()
{
	const btn = document.getElementById('purchase-button');
	btn.addEventListener('click',buyPresale);
}

async function buyPresale()
{
	const inputBox = document.getElementById("purchase-amount");
	let amount =inputBox.value;
	

	const icoContract = new web3.eth.Contract(ICO_CONTRACT_ABI,ICO_CONTRACT_ADDR);

	//console.dir(icoContract.methods);

	 // value in wei
	let amtValue = web3.utils.toWei(amount+"");
	var res = null
	makeButtonPurchasing();
	try{
		res = await icoContract.methods.buyTokens().send({from:ethereum.selectedAddress, value: amtValue}).once("receipt", function(receipt) {
			console.log("receipt",receipt);
			activatePurchaseButton();
			const transId = receipt.transactionHash;
			const presaleSuccessBox = document.getElementById("presale-success");
			presaleSuccessBox.classList.remove("d-none");
		});
	}
	catch(err) {		
		console.log("Exception in buyTokens call: " + err);
		activatePurchaseButton();
	}
}

function updateGetBox(numBNB)
{
	let numTokens = PRESALE_RATE*numBNB;
	let getAmount = document.getElementById("getamount");
	getAmount.innerHTML = numTokens;
}

function activatePurchaseButton()
{
	const spinner = document.getElementById("purchase-spinner");
	spinner.classList.add("d-none");
	const btn = document.getElementById('purchase-button');
	btn.disabled = false;
}

function makeButtonPurchasing()
{
	const spinner = document.getElementById("purchase-spinner");
	spinner.classList.remove("d-none");
	const btn = document.getElementById('purchase-button');
	btn.disabled = true;
}

async function connected(account)
{
	console.log("we are connected.");
}

function handleAccountsChanged()
{
  console.log("need to handle account that just changed.");
}

const bscTokens = [ 
	{ "id": "wbnb", "symbol": "wbnb","contract": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" }, 
	{ "id": "binance-usd", "symbol": "busd", "contract": "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"  }, 
	{ "id": "pancakeswap-token", "symbol": "CAKE", "contract": "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"  }, 
	{ "id": "beefy-finance", "symbol": "BIFI", "contract": "0xca3f508b8e4dd382ee878a314789373d80a5190a" }, 
	{ "id": "bdollar-share", "symbol": "sBDO", "contract": "0x0d9319565be7f53cefe84ad201be3f40feae2740"  }, 
	{ "id": "belugaswap","symbol": "BELUGA", "contract": "0x181de8c57c4f25eba9fd27757bbd11cc66a55d31" }, 
	{ "id": "chainlink","symbol": "LINK","contract":"0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd" }, 
	{ "id": "bscex","symbol": "BSCX", "contract": "0x5ac52ee5b2a633895292ff6d8a89bb9190451587" },
	{ "id": "binance-eth","symbol": "BETH", "contract": "0x250632378e573c6be1ac2f97fcdf00515d0aa91b" },
	{ "id": "tether","symbol": "USDT", "contract": "0x55d398326f99059fF775485246999027B3197955" },
	{ "id": "bitcoin-bep2","symbol": "BTCB", "contract": "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c" },
	{ "id": "ethereum","symbol": "ETH", "contract": "0x2170Ed0880ac9A755fd29B2688956BD959F933F8" },
	{ "id": "bakerytoken","symbol": "BAKE", "contract": "0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5" },
	{ "id": "goose-finance","symbol": "EGG", "contract": "0xf952fc3ca7325cc27d15885d37117676d25bfda6" },
	{ "id": "dai","symbol": "DAI", "contract": "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3" },
	{ "id": "auto","symbol": "AUTO", "contract": "0xa184088a740c695e156f91f5cc086a06bb78b827" },
	{ "id": "wault-finance","symbol": "WAULT", "contract": "0x6ff2d9e5891a7a7c554b80e0d1b791483c78bce9" },
	{ "id": "swipe","symbol": "SXP", "contract": "0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A" },
	{ "id": "vai","symbol": "VAI", "contract": "0x4bd17003473389a42daf6a0a729f6fdb328bbbd7" },
	{ "id": "venus","symbol": "XVS", "contract": "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63" },
	{ "id": "terrausd", "symbol": "UST", "contract": "0x23396cf899ca06c4472205fc903bdb4de249d6fc"},
	{ "id": "cardano", "symbol": "ADA", "contract": "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47"},
	{ "id": "bearn-fi", "symbol": "BFI", "contract": "0x81859801b01764d4f0fa5e64729f5a6c3b91435b"},
	{ "id": "polkadot", "symbol": "DOT", "contract": "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402"},
	{ "id": "vbswap", "symbol": "VBSWAP", "contract": "0x4f0ed527e8a95ecaa132af214dfd41f30b361600"},
	{ "id": "bdollar", "symbol": "BDO", "contract": "0x190b589cf9fb8ddeabbfeae36a813ffb2a702454"},
	{ "id": "julswap", "symbol": "JULD", "contract": "0x5a41f637c3f7553dba6ddc2d3ca92641096577ea"},
	{ "id": "the-famous-token", "symbol": "TFT", "contract": "0xA9d3fa202b4915c3eca496b0e7dB41567cFA031C"},
	{ "id": "shield-protocol", "symbol": "SHIELD", "contract": "0x60b3bc37593853c04410c4f07fe4d6748245bf77"},
	{ "id": "lead-token", "symbol": "LEAD", "contract": "0x2ed9e96EDd11A1fF5163599A66fb6f1C77FA9C66"},
	{ "id": "sparkpoint", "symbol": "SRK", "contract": "0x3B1eC92288D78D421f97562f8D479e6fF7350a16"},
	{ "id": "curate", "symbol": "XCUR", "contract": "0x708C671Aa997da536869B50B6C67FA0C32Ce80B2"},
	{ "id": "uniswap", "symbol": "UNI", "contract": "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1"},
	{ "id": "tsuki-dao", "symbol": "TSUKI", "contract": "0x3fd9e7041c45622e8026199a46f763c9807f66f3"},
	{ "id": "panda-yield", "symbol": "BBOO", "contract": "0xd909840613fcb0fadc6ee7e5ecf30cdef4281a68"},
	{ "id": "cryptex", "symbol": "CRX", "contract": "0x97a30C692eCe9C317235d48287d23d358170FC40"},
	{ "id": "polis", "symbol": "POLIS", "contract": "0xb5bea8a26d587cf665f2d78f077cca3c7f6341bd"},
	{ "id": "tether", "symbol": "USDT", "contract": "0x049d68029688eAbF473097a2fC38ef61633A3C7A"},
	{ "id": "swirl-cash", "symbol": "SWIRL", "contract": "0x52d86850bc8207b520340b7e39cdaf22561b9e56"},
	{ "id": "squirrel-finance", "symbol": "NUTS", "contract": "0x8893D5fA71389673C5c4b9b3cb4EE1ba71207556"},
	{ "id": "usd-coin", "symbol": "USDC", "contract": "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"},
	{ "id": "iron-stablecoin", "symbol": "IRON", "contract": "0x7b65b489fe53fce1f6548db886c08ad73111ddd8" },
	{ "id": "midas-dollar", "symbol": "MDO", "contract": "0x35e869b7456462b81cdb5e6e42434bd27f3f788c" },
	{ "id": "slime-finance", "symbol": "SLME", "contract": "0x4fcfa6cc8914ab455b5b33df916d90bfe70b6ab1" },
	{ "id": "bolt-true-dollar", "symbol": "BTD", "contract": "0xd1102332a213e21faf78b69c03572031f3552c33" },
	{ "id": "mdex", "symbol": "MDX", "contract": "0x9C65AB58d8d978DB963e63f2bfB7121627e3a739" },
	{ "id": "ice-token", "symbol": "ICE", "contract": "0xf16e81dce15b08f326220742020379b855b87df9"},
	{ "id": "alpaca-finance", "symbol": "ALPACA", "contract": "0x8f0528ce5ef7b51152a59745befdd91d97091d2f"},
	{ "id": "blue-planetfinance", "symbol": "AQUA", "contract": "0x72B7D61E8fC8cF971960DD9cfA59B8C829D91991"},
	{ "id": "dogecoin", "symbol": "DOGE", "contract": "0xbA2aE424d960c26247Dd6c32edC70B295c744C43"},
	{ "id": "degen", "symbol": "DGNZ", "contract": "0xb68a67048596502A8B88f1C10ABFF4fA99dfEc71"},
	{ "id": "degencomp", "symbol": "aDGNZ", "contract": "0xe8B9b396c59A6BC136cF1f05C4D1A68A0F7C2Dd7"},
	{ "id": "gambit", "symbol": "GMT", "contract": "0x99e92123eb77bc8f999316f622e5222498438784"},
	{ "id": "alien-worlds-bsc", "symbol": "TLM", "contract": "0x2222227e22102fe3322098e4cbfe18cfebd57c95"},
	{ "id": "ten", "symbol": "TENFI", "contract": "0xd15c444f1199ae72795eba15e8c1db44e47abf62"}
  ]
  
async function getBscPrices() {
		const idPrices = await lookUpPrices(bscTokens.map(x => x.id));
		const prices = {}
		for (const bt of bscTokens)
			if (idPrices[bt.id])
				prices[bt.contract] = idPrices[bt.id];
		return prices;
}  

const lookUpPrices = async function(id_array) {
	let ids = id_array.join('%2C')
	const url = 'https://api.coingecko.com/api/v3/simple/price?ids=' + ids + '&vs_currencies=usd';
	const res = await fetch(url);
	const text = await res.text();
	return JSON.parse(text);
}

async function getTokenPrice(prices) {  
	const lpContract = new web3.eth.Contract(POOL_ABI,TOKEN_PRICE_LP);
	token0 = await lpContract.methods.token0().call();
	token1 = await lpContract.methods.token1().call();

	var token0Price = 0;
	var token1Price = 0;

	if (prices[token0])
		token0Price = prices[token0].usd;

	if (prices[token1])
		token1Price = prices[token1].usd;

	var tokenPrice = 0;

	if (token0Price == 0 && token1Price > 0)
	{
		console.log("need token0 price..");
		const reserves = await lpContract.methods.getReserves().call();

		const reserve0 = reserves[0];
		const reserve1 = reserves[1];
		
		let decimals0 = 9;
		let reserve0big = new BigNumber(reserve0);
		let reserve0bigHR = reserve0big.shiftedBy(parseInt(-decimals0));
		let decimals1 = 18;
		let reserve1big = new BigNumber(reserve1);
		let reserve1bigHR = reserve1big.shiftedBy(parseInt(-decimals1));
		//const rate = reserve1/reserve0;
		const rate = reserve0bigHR.div(reserve1bigHR);
		//const altRate = reserve0/reserve1; //dont know what this is
		//console.log("Price rate: " + rate + " altRate: " + altRate + " token1Price: " + token1Price);
		tokenPrice = token1Price / rate;
		prices[TOKEN_CONTRACT_ADDR] = {usd: tokenPrice};
	}
	else if (token0Price > 0 && token1Price == 0)
	{
		console.log("need token1 price");
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
	  	console.log("no Web3");
		web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'));
		//web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');
		updateStaticContent();
		startApp(null);
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