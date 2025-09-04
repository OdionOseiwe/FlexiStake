import { useReadContract } from 'wagmi'
type ReadType = {
  address: `0x${string}`;
  functionName: string;
  args?: readonly unknown[]; 
  abi:any
}

export function useContractRead({
  address,
  functionName,
  args,
  abi,
}: ReadType) {
  return useReadContract({
    abi,
    address,
    functionName,
    args,
  }) as { data: undefined; isLoading: boolean; error: Error | null };
}

