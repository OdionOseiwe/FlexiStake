import React from 'react'
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from '../config/thirdwebClient';
import { useStakeFlow } from "../hooks/useStakeflow";
import { Contract, parseUnits, ethers } from "ethers";


function check() {
  const {stakeTokens} = useStakeFlow();

  
  const handleStake =async() =>{
    // const value = parseUnits(amount, 18); // assumes 18 decimals
    await stakeTokens(10000, 1);
  }
  return (
    <div>
      <ConnectButton client={client}/>
      <button onClick={handleStake}> stake</button>
    </div>
  );
}

export default check
