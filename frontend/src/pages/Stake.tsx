import {  Loader } from 'lucide-react';
import Button from '../Components/Button';
import Dropdown from '../Components/Dropdown';
import PopUpModal from '../Components/PopUpModal';
import StakeForm from '../Components/StakeForm';
import Stats from '../Components/Stats';
import { useState } from 'react';
import { ConnectButton } from "thirdweb/react";
import { client } from '../config/thirdwebClient';
import {useContractRead} from '../hooks/useContractRead';
import { useContractWrite } from '../hooks/useContractWrite';
import StakeAbi from '../ABI/StakeAbi.json'
import { GetTierNumber } from '../utils/tier';
import {formatEther } from "ethers";
import {StakeAddress} from '../utils/address'
import { useAccount } from 'wagmi'
import {convertEpochToDays} from '../utils/epochConverter'
type ModalType = 'withdraw' | 'emergency' | 'claim' | null;

export default function Stake() {
  const { address, isConnected } = useAccount();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [formData, setFormData] = useState({
    stakeAmount: '',
    withdrawAmount: '',
    emergencyAmount: '',
    claimAmount: '',
  });  
  const [rewardsTier, setRewardsTier] = useState("Tier1");
  const { writeToContractState } = useContractWrite();

  console.log(convertEpochToDays(1756765320, GetTierNumber(rewardsTier)));
  

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    await writeToContractState({
      abi: StakeAbi,
      address: StakeAddress,
      functionName: "withdraw",
      args: [formData.withdrawAmount, GetTierNumber(rewardsTier)],
    });
    alert("withdrawal successful 🎉")
  };

  const handleEmergencyWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    await writeToContractState({
      abi: StakeAbi,
      address: StakeAddress,
      functionName: "emergencyWithdraw",
      args: [formData.emergencyAmount, GetTierNumber(rewardsTier)],
    });
    alert("withdrawal successful 🎉")
  };


  /////////////Read functions //////////////////////
  const { data: stakeData, isLoading:isStakeLoading } = useContractRead({
    abi: StakeAbi,
    address: StakeAddress,
    functionName: "getUserStake",
    args: [address, GetTierNumber(rewardsTier)],
  });

  

  const { data: rewardData, isLoading:isRewardLoading } = useContractRead({
    abi: StakeAbi,
    address: StakeAddress,
    functionName: "getPendingRewards",
    args: [address, GetTierNumber(rewardsTier)],
  });

  if (isStakeLoading || isRewardLoading) {
    return <div className='grid justify-center'><Loader color="#3e9392" size={50}/></div>;
  } 

  return (
    <div className="md:px-12  md:py-6 bg-linear-to-br from-fuchsia-950 to-blue-950 brighteness-50">
      <ConnectButton client={client} />
      <div className="flex flex-wrap justify-around mt-10">
        <div
          className="bg-linear-to-b from-blue-700 to-fuchsia-950 md:border-t-1 rounded-3xl mx-2 md:p-6 p-3 brightness-110 hover:-translate-y-2 
      transition-all duration-500"
        >
         
          <StakeForm stakeAmount ={formData.stakeAmount} setStakeAmount={(p) => setFormData({...formData, stakeAmount: p})  }/>
          {isConnected ? <div className="bg-fuchsia-950 md:p-6 p-3 rounded-2xl mt-8 md:border-t-1">
            <p className="flex justify-end">
              <Dropdown tier={rewardsTier} setTier={setRewardsTier} />
            </p>
            <div>
              <div className="mt-4 bg-linear-to-r from-fuchsia-950 brightness-75 text-gray-500 md:text-xl p-3 mb-2 rounded-xl">
                My Stake: <span className="text-black font-bold">{formatEther(String(stakeData[0]))}</span>
              </div>
              <p className="bg-linear-to-r from-fuchsia-950 brightness-75 text-gray-500 md:text-xl p-3 mb-2 rounded-xl">
                Pending rewards:{" "}
                <span className="text-black font-bold">{formatEther(String(rewardData))}</span>
              </p>
              <p className="bg-linear-to-r from-fuchsia-950 brightness-75 text-gray-500 md:text-xl p-3 mb-2 rounded-xl">
                {" "}
                <span className="text-black font-bold">{convertEpochToDays(1756765320, GetTierNumber(rewardsTier))}</span> days left
              </p>
              <div className="mt-6 ">
                <Button label="Withdraw" onClick={() => setActiveModal('withdraw')} />
                <Button label="Emergency withdraw" onClick={() => setActiveModal('emergency')} />
                <Button label="Claim rewards" onClick={() => setActiveModal('claim')} />
              </div>
              {activeModal === 'withdraw' && (
                <PopUpModal
                  PopUplabel="withdraw"
                  message=""
                  onClose={() => setActiveModal(null)}
                  onConfirm ={()=> {
                    handleWithdraw; setActiveModal(null);
                  }}
                   setAmount={(p)=>setFormData({...formData, withdrawAmount: p})}
                />
              )}

              {activeModal === 'emergency' && (
                <PopUpModal
                  PopUplabel="Emergency withdraw"
                  message="⚠️ Withdrawing your stake before the tier period ends will incur a 5% penalty fee on the amount withdrawn.
                          Additionally, no rewards will be earned or distributed for early withdrawals.
                          Please ensure you are aware of the lock-in period before initiating a withdrawal."
                          onClose={() => setActiveModal(null)}
                  onConfirm ={()=> {
                    handleEmergencyWithdraw; setActiveModal(null);
                  }}
                  setAmount={(p)=>setFormData({...formData, emergencyAmount:p})}
                />
              )}

              {activeModal === 'claim' && (
                <PopUpModal
                  PopUplabel="Claim rewards"
                  message="Congratulations! 🎉 You’ve successfully completed the tier period.
                You can now withdraw your full stake without any penalty, along with your earned rewards.
                Thank you for staking with us!"
                onClose={() => setActiveModal(null)}
                  onConfirm ={()=> {
                    handleWithdraw; setActiveModal(null);
                  }}
                  setAmount={(p)=> setFormData({...formData, claimAmount:p})}
                />
              )}
            </div>
          </div> : <div> Connect wallet</div>
        }
        </div>
        
        <div>
          <Stats/>
        </div>
      </div>
  </div>
  );
}
