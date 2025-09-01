import { ArrowDown } from 'lucide-react';
import Button from '../Components/Button';
import Ethereum from '../images/ethereum.png'
import Dropdown from '../Components/Dropdown';
import PopUpModal from '../Components/PopUpModal';
import { useState } from 'react';
import { ConnectButton } from "thirdweb/react";
import { client } from '../config/thirdwebClient';
import {useContractRead} from '../hooks/useContractRead';
import { useStakeFlow } from '../hooks/useStakeflow';
import { useContractWrite } from '../hooks/useContractWrite';
import StakeAbi from '../ABI/StakeAbi.json'
import { GetTierNumber } from '../ABI/utils/tier';
import { parseUnits } from "ethers";

export default function Stake() {
  const [showModalWithdraw, setshowModalWithdrawdal] = useState<boolean>(false)
  const [showModalEmergencyWithdraw, setshowModalEmergencyWithdraw] = useState<boolean>(false)
  const [showModalClaimRewards, setshowModalClaimRewards] = useState<boolean>(false)
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [tier, setTier] = useState<string>("Tier1");
  const {stakeTokens,loading,error,approve,stake} = useStakeFlow();

  const handleStake = async(e) =>{
    e.preventDefault();
    const success = await stakeTokens(parseUnits(stakeAmount, 18), GetTierNumber(tier));    
    if(success){
      setStakeAmount('');
    }
    alert("Stake sucessful 🎉")
  }

  return (
    <div className="md:px-12  md:py-6 bg-linear-to-br from-fuchsia-950 to-blue-950 brighteness-50">
      <ConnectButton client={client} />
      <div className="flex flex-wrap justify-around mt-10">
        <div
          className="bg-linear-to-b from-blue-700 to-fuchsia-950 md:border-t-1 rounded-3xl mx-2 md:p-6 p-3 brightness-110 hover:-translate-y-2 
      transition-all duration-500"
        >
          <div>
            <h1 className="md:text-2xl text-xl"> Stake Tokens</h1>
            <p className="mt-4 text-fuchsia-950 font-extralight">
              APY total value <span className="ml-2">3%</span>
            </p>
            <p className="mt-4 text-gray-500 text-l font-bold">
              Stake your tokens in Tier 1, 2, or 3. Earn interest as you stake,{" "}
              <br />
              plus bonus rewards for completing the full tier — 1.5× in Tier 2,
              3× in Tier 3
            </p>
            <div
              className="flex justify-between items-center bg-fuchsia-950 p-6 h-16 brightness-125 
              rounded-xl shadow-2xl shadow-blue-700 mt-5 text-gray-500"
            >
              <div className="flex items-center">
                <div className="mr-2">
                  <img
                    src={Ethereum}
                    alt="logo "
                    className="size-8 rounded-full"
                  />
                </div>
                <p>mETH</p>
              </div>
              <div>
                <Dropdown tier={tier} setTier={setTier} />
              </div>
            </div>
            <div className="flex justify-center mt-4 mb-2">
              <ArrowDown />
            </div>
            <form className="">
              <label className="">Enter amount</label>
              <input
                onChange={(e) => setStakeAmount(e.target.value)}
                value= {stakeAmount}
                className="flex justify-between items-center bg-fuchsia-950 p-4 w-full h-16 brightness-125 mb-6 
            rounded-xl shadow-2xl shadow-blue-700 mt-1 text-gray-500 focus:border-none focus:outline-0 text-2xl"
                type="text"
                placeholder="0.0"
              />
              <div className="flex justify-end">
                <Button
                  label={
                    loading
                      ? approve
                        ? "Approving..."
                        : stake
                          ? "Staking..."
                          : "Processing..."
                      : "Stake"
                  }
                  onClick={handleStake}
                />
              </div>
              {approve && <p className="text-green-500 mt-2">Approving...</p>}
              {stake && <p className="text-green-500 mt-2">Staking...</p>}
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          </div>

          <div className="bg-fuchsia-950 md:p-6 p-3 rounded-2xl mt-8 md:border-t-1">
            <p className="flex justify-end">
              <Dropdown tier={tier} setTier={setTier} />
            </p>
            <div>
              <div className="mt-4 bg-linear-to-r from-fuchsia-950 brightness-75 text-gray-500 md:text-xl p-3 mb-2 rounded-xl">
                My Stake: <span className="text-black font-bold">0.0</span>
              </div>
              <p className="bg-linear-to-r from-fuchsia-950 brightness-75 text-gray-500 md:text-xl p-3 mb-2 rounded-xl">
                Pending rewards:{" "}
                <span className="text-black font-bold">0.0</span>
              </p>
              <p className="bg-linear-to-r from-fuchsia-950 brightness-75 text-gray-500 md:text-xl p-3 mb-2 rounded-xl">
                {" "}
                <span className="text-black font-bold">7</span> days left
              </p>
              <div className="mt-6 ">
                <Button
                  label="Withdraw"
                  onClick={() => setshowModalWithdrawdal(!showModalWithdraw)}
                />
                <Button
                  label="Emergency withdraw"
                  onClick={() =>
                    setshowModalEmergencyWithdraw(!showModalEmergencyWithdraw)
                  }
                />
                <Button
                  label="Claim rewards"
                  onClick={() =>
                    setshowModalClaimRewards(!showModalClaimRewards)
                  }
                />
              </div>
              {showModalWithdraw && (
                <PopUpModal
                  PopUplabel="withdraw"
                  message=""
                  onClick={() => setshowModalWithdrawdal(false)}
                />
              )}

              {showModalEmergencyWithdraw && (
                <PopUpModal
                  PopUplabel="Emergency withdraw"
                  message="⚠️ Withdrawing your stake before the tier period ends will incur a 5% penalty fee on the amount withdrawn.
                          Additionally, no rewards will be earned or distributed for early withdrawals.
                          Please ensure you are aware of the lock-in period before initiating a withdrawal."
                  onClick={() => setshowModalEmergencyWithdraw(false)}
                />
              )}

              {showModalClaimRewards && (
                <PopUpModal
                  PopUplabel="Claim rewards"
                  message="Congratulations! 🎉 You’ve successfully completed the tier period.
                You can now withdraw your full stake without any penalty, along with your earned rewards.
                Thank you for staking with us!"
                  onClick={() => setshowModalClaimRewards(false)}
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <div
            className="bg-fuchsia-950 md:p-3 p-2 rounded-2xl mt-8 md:border-t-1 text-gray-500 w-60
        hover:-translate-y-2 
      transition-all duration-500"
          >
            <h1 className="mb-4">FlexiStake Stats</h1>
            <div className="bg-linear-to-r from-fuchsia-950 brightness-75 rounded-2xl p-3 ">
              <div className="flex items-center">
                <div className="mr-4">
                  <img
                    src={Ethereum}
                    alt="logo "
                    className="size-8 rounded-full"
                  />
                </div>
                <div>
                  <p className="text-xs">TVL</p>
                  <p className="text-l">
                    $ <span>1.8</span> B
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-linear-to-b from-blue-700 to-fuchsia-950 md:p-3 p-2 rounded-2xl mt-8 md:border-t-1
        hover:-translate-y-2 
      transition-all duration-500"
          >
            <h1 className="mb-4">Assets Restaked</h1>
            <div className="bg-linear-to-r from-fuchsia-950 brightness-75 rounded-2xl p-3 ">
              <div className="flex items-center">
                <div className="mr-4">
                  <img
                    src={Ethereum}
                    alt="logo "
                    className="size-8 rounded-full"
                  />
                </div>
                <div>
                  <p className="text-xs">mETH</p>
                  <p className="text-l">
                    $ <span>1.8</span> B
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
