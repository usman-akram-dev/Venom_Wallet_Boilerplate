import { Address } from "everscale-inpage-provider"
import React, { useEffect, useState } from "react"

import BackImg from "../styles/img/decor.svg"
import LogOutImg from "../styles/img/log_out.svg"

// Importing of our contract ABI from smart-contract build action. Of cource we need ABI for contracts calls.
// import tokenRootAbi from "../abi/TokenRoot.abi.json"
// import tokenWalletAbi from "../abi/TokenWallet.abi.json"

import ConnectWallet from "../components/ConnectWallet"
import Transfer from "../components/Transfer"
import { abi, IR_CONTRACT_ADDRESS } from "../constants";

function Main({ venomConnect }) {
  const [venomProvider, setVenomProvider] = useState()
  const [address, setAddress] = useState()

  // We will store token balance from contract
  const [balance, setBalance] = useState()
  let tokenWalletAddress // User's TIP-3 TokenWallet address

  // This method allows us to gen a wallet address from inpage provider
  const getAddress = async provider => {
    const providerState = await provider?.getProviderState?.()
    return providerState?.permissions.accountInteraction?.address.toString()
  }

  // Any interaction with venom-wallet (address fetching is included) needs to be authentificated
  const checkAuth = async _venomConnect => {
    const auth = await _venomConnect?.checkAuth()
    if (auth) await getAddress(_venomConnect)
  }

  // This handler will be called after venomConnect.login() action
  // connect method returns provider to interact with wallet, so we just store it in state
  const onConnect = async provider => {
    setVenomProvider(provider)
    await onProviderReady(provider)
  }

  // This handler will be called after venomConnect.disconnect() action
  // By click logout. We need to reset address and balance.
  const onDisconnect = async () => {
    venomProvider?.disconnect()
    setAddress(undefined)
  }

  // When our provider is ready, we need to get address and balance from.
  const onProviderReady = async provider => {
    const venomWalletAddress = provider ? await getAddress(provider) : undefined
    setAddress(venomWalletAddress)
  }

  useEffect(() => {
    // connect event handler
    const off = venomConnect?.on("connect", onConnect)
    if (venomConnect) {
      checkAuth(venomConnect)
    }
    // just an empty callback, cuz we don't need it
    return () => {
      off?.()
    }
  }, [venomConnect])

  const callthis = async ()=>{
    const contr = new venomProvider.Contract(abi, IR_CONTRACT_ADDRESS);
    console.log("contract",contr);
    await contr.methods.transfer({
      amount: 1 * decimals,
      recipient: new Address("0:recipientsaddress"),
      deployWalletValue: toNano(0.1),
      remainingGasTo: new Address("0:youraddress"),
      notify: true,
      payload: ''
    }).send({
      from: new Address("0:youraddress"), 
      amount: toNano(0.2)
    });

  }

  return (
    <div className="box">
      {address && (
        <header>
          <p>{address}</p>
          <a className="logout" onClick={onDisconnect}>
            <img src={LogOutImg} alt="Logout" />
          </a>
        </header>
      )}

      <img className="decor" src={BackImg} alt="back" />
      <div className="card">
        <div className="card__wrap">
          {address ?<Transfer callthis={()=>""}/>
           : (
            <>
            <ConnectWallet venomConnect={venomConnect} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Main

