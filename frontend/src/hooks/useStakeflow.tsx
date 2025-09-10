import { useState } from "react";
import { ethers } from "ethers";
import TokenAbi from "../ABI/TokenAbi.json";
import StakeAbi from "../ABI/StakeAbi.json";
import { TokenAddress, StakeAddress } from "../utils/Address";
import { useWalletClient } from "wagmi";

export const useStakeFlow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [approve, isApproving] = useState(false);
  const [stake, isStaking] = useState(false);
  const { data: walletClient } = useWalletClient();

  const getSigner = async () => {
    const provider = new ethers.BrowserProvider(walletClient.transport);
    return await provider.getSigner();
  };

  async function approveTokens(amount: bigint) {
    try {
      isApproving(true);
      setLoading(true);
      setError(null);

      const signer = await getSigner();
      const tokenContract = new ethers.Contract(TokenAddress, TokenAbi, signer);

      const tx = await tokenContract.approve(StakeAddress, amount);
      await tx.wait();
      isApproving(false);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
      isApproving(false);
    }
  }

  const stakeTokens = async (amount: bigint, tier: number) => {
    try {
      setError(null);

      const signer = await getSigner();
      const tokenContract = new ethers.Contract(TokenAddress, TokenAbi, signer);
      const stakingContract = new ethers.Contract(
        StakeAddress,
        StakeAbi,
        signer
      );

      const owner = await signer.getAddress();
      const allowance = await tokenContract.allowance(owner, StakeAddress);

      if (allowance < amount) {
        const approved = await approveTokens(amount);
        if (!approved) throw new Error("Approval failed");
      }
      isStaking(true);
      setLoading(true);
      const tx = await stakingContract.stakeToken(amount, tier);
      await tx.wait();
      setLoading(false);
      isStaking(false);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    approveTokens,
    stakeTokens,
    loading,
    error,
    approve,
    stake,
    getSigner,
  };
};
