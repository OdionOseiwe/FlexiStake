import { ArrowDown } from "lucide-react";
import Button from "../Components/Button";
import Tether from "../images/tether.svg";
import Dropdown from "../Components/Dropdown";
import { useContractRead } from "../hooks/useContractRead";
import StakeAbi from "../ABI/StakeAbi.json";
import { StakeAddress } from "../utils/Address";
import { useState } from "react";
import { useStakeFlow } from "../hooks/useStakeflow";
import { parseUnits } from "ethers";
import { GetTierNumber } from "../utils/Tier";
import { useAccount } from "wagmi";
import { formatEther } from "ethers";

type StakeFormProps = {
  stakeAmount: string;
  setStakeAmount: (amount: string) => void;
};

function StakeForm({ stakeAmount, setStakeAmount }: StakeFormProps) {
  const [stakeTier, setStakeTier] = useState("Tier1");
  const { isConnected } = useAccount();
  const { stakeTokens, loading, error, approve, stake } = useStakeFlow();

  const { data: basicAPR, isLoading: loadingBasicAPR } = useContractRead({
    abi: StakeAbi,
    address: StakeAddress,
    functionName: "basicAPR",
  });

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await stakeTokens(
      parseUnits(stakeAmount, 18),
      GetTierNumber(stakeTier)
    );
    if (success) {
      alert("Stake successful!");
      setStakeAmount("");
    }
  };

  return (
    <>
      <div>
        <h1 className="md:text-2xl text-xl"> Stake Tokens</h1>

        <p className="mt-4 text-fuchsia-950 font-extralight">
          APR value:{" "}
          {isConnected && !loadingBasicAPR && (
            <span className="ml-2 font-bold">
              {Math.round(Number(formatEther(String(basicAPR))))}%
            </span>
          )}
        </p>

        <p className="mt-4 text-gray-500 text-l font-bold">
          Stake your tokens in Tier 1, 2, or 3. Earn interest as you stake,{" "}
          <br />
          plus bonus rewards for completing the full tier — 1.5× in Tier 2, 3×
          in Tier 3
        </p>
        <div
          className="flex justify-between items-center bg-fuchsia-950 p-6 h-16 brightness-125 
                      rounded-xl shadow-2xl shadow-blue-700 mt-5 text-gray-500"
        >
          <div className="flex items-center">
            <div className="mr-2">
              <img src={Tether} alt="logo " className="size-8 rounded-full" />
            </div>
            <p>mUSDT</p>
          </div>
          <div>
            <Dropdown tier={stakeTier} setTier={setStakeTier} />
          </div>
        </div>
        <div className="flex justify-center mt-4 mb-2">
          <ArrowDown />
        </div>
        <form className="">
          <label className="">Enter amount</label>
          <input
            onChange={(e) => setStakeAmount(e.target.value)}
            value={stakeAmount}
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
          {stake && !error && <p className="text-green-500 mt-2">Staking...</p>}
          {error && (
            <p className="text-red-500 mt-2">error occured while staking</p>
          )}
        </form>
      </div>
    </>
  );
}

export default StakeForm;
