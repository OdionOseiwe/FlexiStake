import { useWriteContract } from 'wagmi';

export function useContractWrite() {
  const { writeContract,isError, isSuccess, isPending } = useWriteContract();
  type InputType ={
    abi: any,
    address: `0x${string}`,
    functionName: string,
    args: readonly any[] | [];
  }

  const writeToContractState = async ({abi, address, functionName, args}: InputType) => {
    try {
      await writeContract({
        abi,
        address,
        functionName,
        args,
      });
    } catch (err) {
      console.error('Write function failed:', err);
    }
  };

  return { writeToContractState, isError, isSuccess, isPending };
}
