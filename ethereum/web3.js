import Web3 from "web3";
import React from "react";
// window only available inside browser, not in node js where our server is currently running

let web3;
if (typeof window !== "undefined" && typeof (window.web3 !== "undefined")) {
    // We are in the browser and metamask is running.
    window.ethereum.request({method: "eth_requestAccounts"});
    web3 = new Web3(window.ethereum);
} else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        process.env.PROVIDER_URL
    );
    web3 = new Web3(provider);
}

export default web3;
