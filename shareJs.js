
document.getElementById("btn-share").onclick = share;
document.getElementById("btn-viewShared").onclick = viewShared;

const ABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"message","type":"string"},{"indexed":false,"internalType":"address","name":"recipient","type":"address"}],"name":"SharewithExisting","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"message","type":"string"},{"indexed":false,"internalType":"address","name":"recipient","type":"address"}],"name":"SharewithNew","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"message","type":"string"}],"name":"SubsequentUpload","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"message","type":"string"}],"name":"Upload","type":"event"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"string[]","name":"_newCidsToUpload","type":"string[]"}],"name":"_addTwoArrays","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"string[]","name":"_cidsToShare","type":"string[]"}],"name":"_addTwoArraysShared","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"_getListOfAllUploadedCIDS","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_getListOfUploadedCIDS","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_getSharedFiles","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string[]","name":"_cidsToShare","type":"string[]"},{"internalType":"address","name":"_recipient","type":"address"}],"name":"_shareWithExisting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"_cidsToShare","type":"string[]"},{"internalType":"address","name":"_recipient","type":"address"}],"name":"_shareWithNew","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"_sharedFiles","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string[]","name":"_newCidsToUpload","type":"string[]"}],"name":"_subsequentUpload","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"_cidsToUpload","type":"string[]"}],"name":"_upload","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"_uploadedCIDS","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allUploadedFiles","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"isAnUploader","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"upLoaders","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"viewBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

//initialize Moralis on RRRinkeby
const serverUrl = "https://ujwb1som3llq.usemoralis.com:2053/server" 
const appId = "TPzse1a4T6YsxrbB5Em4weILu5cR0AUplKU43QsZ"
Moralis.start({ serverUrl, appId });

async function share(){
    const hash = document.querySelector("#hash").value
    const address = document.querySelector("#address").value
    const hashArray = []
    hashArray.push(hash)
    const bool = await isAnUploader(address) //check if this address has uploaded before //a SC view function
    if (bool) {
        console.log("share With Existing")
        await _shareWithExisting(hashArray, address) //upload //a SC action function
    } else {
        console.log("share With New")
        await _shareWithNew(hashArray, address) //upload //a SC action function
    } 
    console.log("shared")
}

async function isAnUploader(address){
    const options = {
        chain: "rinkeby", //update
        address: "0x653857eCaB380c458206C19142310C1a0cA1683F", //update
        function_name: "isAnUploader", //check
        abi: ABI,
        params:{
            _address: address
        }
    };
    return await Moralis.Web3API.native.runContractFunction(options);
}

async function _shareWithExisting(hashArray, address){
    const options = {
        chain: "rinkeby",
        contractAddress: "0x653857eCaB380c458206C19142310C1a0cA1683F",
        functionName: "_shareWithExisting",
        abi: ABI,
        params:{
            _cidsToShare: hashArray,
            _recipient: address
        }
    };
    await Moralis.authenticate()
    await Moralis.executeFunction(options);
}

async function _shareWithNew(hashArray, address){
    const options = {
        chain: "rinkeby",
        contractAddress: "0x653857eCaB380c458206C19142310C1a0cA1683F",
        functionName: "_shareWithNew",
        abi: ABI,
        params:{
            _cidsToShare: hashArray,
            _recipient: address
        }
    };
    await Moralis.authenticate()
    await Moralis.executeFunction(options);    
}

async function viewShared(){
    let user = Moralis.User.current();
    const address = user.get("ethAddress")
    const sharedHashArray = await _getSharedFiles(address)
    console.log(sharedHashArray)
    console.log("CIDS shared retrieved")
    const metadataArray = [] 
    for( let i = 0; i < sharedHashArray.length; i++){
        const element = sharedHashArray[i]
        const json = await getJSONfiles(element) //had to be like this because of await and async keyword. //it calls the Moralis IPFS link for each member of the array
        metadataArray.push(json) //push each object into the array
    }
    console.log("Metadata retrieved")
    if (element.status != "private") {
        displayPublicLibrary(element)
    } else {
        displayPrivateLibrary(element)
    }
}

async function _getSharedFiles(address){
    const options = {
        chain: "rinkeby", //update
        address: "0x653857eCaB380c458206C19142310C1a0cA1683F", //update
        function_name: "_getSharedFiles", //check
        abi: ABI,
        params:{
            _address: address
        }
    };
    return await Moralis.Web3API.native.runContractFunction(options);
}

async function fetchIPFSDoc(ipfsHash) {
    const url = `https://gateway.moralisipfs.com/ipfs/${ipfsHash}`;
    const response = await fetch(url);
    return await response.json();
}

async function getJSONfiles(CidHashStr){
    return await fetchIPFSDoc(CidHashStr) 
}

function displayPublicLibrary(metadata){
    const container = document.querySelector(".data")

    //create displayCard container
    const displayCard = document.createElement('div');
    displayCard.className = "displayCard";

    //create image element
    const image = document.createElement('img');
    image.src = "/FrontEnd/images/Screenshot (725).png"
    image.alt = "png-icon"
    //create nameTag container
    const nameTags = document.createElement('div');
    nameTags.className = "nameTags";
    //create h4 status element
    const status = document.createElement('h4');
    status.textContent = metadata.status;
    //create h3 element
    const name = document.createElement('h3');
    name.textContent = metadata.name;
    //create h4 element
    const cid = document.createElement('h4');
    cid.textContent = metadata.ipfsCID;
    //create a element
    const hash = document.createElement('a');
    hash.href = metadata.ipfsCID;
    hash.target = "_blank"
    hash.textContent = metadata.ipfsHash;
    
    //append all nameTag elements to the nameTag container
    nameTags.append(name, cid, hash);

    //append all displayCard elements to the displayCard container
    displayCard.append(image, nameTags, status);

    //append the card to the dom element(i.e the container)
    container.append(displayCard)
}

function displayPrivateLibrary(metadata){
    const container = document.querySelector(".data")

    //create displayCard container
    const displayCard = document.createElement('div');
    displayCard.className = "displayCard";

    //create image element
    const image = document.createElement('img');
    image.src = "/FrontEnd/images/Screenshot (725).png"
    image.alt = "png-icon"
    //create nameTag container
    const nameTags = document.createElement('div');
    nameTags.className = "nameTags";
    //create h4 status element
    const status = document.createElement('h4');
    status.textContent = metadata.status;
    //create h3 element
    const name = document.createElement('h3');
    name.textContent = metadata.name;
    //create h4 element
    
    //append all nameTag elements to the nameTag container
    nameTags.append(name);

    //append all displayCard elements to the displayCard container
    displayCard.append(image, nameTags, status);

    //append the card to the dom element(i.e the container)
    container.append(displayCard)
}