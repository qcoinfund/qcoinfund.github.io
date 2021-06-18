const CHAIN_ID = 97; // TESTNET=97
const TOKEN_CONTRACT_ADDR = '0x45EB209d2f758CF2Bc623578B0ADcb7e351eab77'; // TESTNET TOKEN CONTRACT
const TOKEN_PRICE_LP = '0x6a34f03db48f6dfffad221edd5264123e875d97c'; // TESTNET LP

const tokenSymbol = 'Q';
const tokenDecimals = 9;
const BURNWALLET = "0x000000000000000000000000000000000000dead";

let pancakeSwapURL = "https://pancakeswap.finance/"+TOKEN_CONTRACT_ADDR;
if (CHAIN_ID == 97)
	pancakeSwapURL = "https://pancake.kiemtienonline360.com/#/swap?outputCurrency="+TOKEN_CONTRACT_ADDR;

const tokenImage = 'https://qcoin.finance/assets/img/qcoin_logo.png'; // should be 512x512 I believe.

const TOKEN_CONTRACT_ABI = [
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minTokensBeforeSwap",
          "type": "uint256"
        }
      ],
      "name": "MinTokensBeforeSwapUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokensSwapped",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "ethReceived",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokensIntoLiqudity",
          "type": "uint256"
        }
      ],
      "name": "SwapAndLiquify",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bool",
          "name": "enabled",
          "type": "bool"
        }
      ],
      "name": "SwapAndLiquifyEnabledUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "_liquidityFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_maxTxAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_taxFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tAmount",
          "type": "uint256"
        }
      ],
      "name": "deliver",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "excludeFromFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "excludeFromReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "geUnlockTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "includeInFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "includeInReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isExcludedFromFee",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isExcludedFromReward",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "time",
          "type": "uint256"
        }
      ],
      "name": "lock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tAmount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "deductTransferFee",
          "type": "bool"
        }
      ],
      "name": "reflectionFromToken",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "liquidityFee",
          "type": "uint256"
        }
      ],
      "name": "setLiquidityFeePercent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "maxTxPercent",
          "type": "uint256"
        }
      ],
      "name": "setMaxTxPercent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "setRestrictionAmount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_enabled",
          "type": "bool"
        }
      ],
      "name": "setSwapAndLiquifyEnabled",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "taxFee",
          "type": "uint256"
        }
      ],
      "name": "setTaxFeePercent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "time",
          "type": "uint256"
        }
      ],
      "name": "setTradingStart",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "swapAndLiquifyEnabled",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "rAmount",
          "type": "uint256"
        }
      ],
      "name": "tokenFromReflection",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalFees",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "uniswapV2Pair",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "uniswapV2Router",
      "outputs": [
        {
          "internalType": "contract IUniswapV2Router02",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unlock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "whitelistAccount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];

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

//TODO: fix this method up.
function addDecimalPlace(numberAsString,decimals)
{
	if (numberAsString == 0)
		return 0;
	const len = numberAsString.length;
	const startPiece=numberAsString.substr(0,(len-decimals));
	const endPiece=numberAsString.substring(len-decimals);
	return startPiece+"."+endPiece;
}

function updateStaticContent()
{
  setupBuyButtons();
  populateContractAddress();
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
		reserves = await getReserves(lpContract);
		const reserve0 = reserves[0];
		const reserve1 = reserves[1];
		var rate = reserve1/reserve0;
		var altRate = reserve0/reserve1;
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