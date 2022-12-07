import { useContractReads } from 'wagmi';
import { BigNumber } from 'ethers';
import kingOfTheFoolsABI from '../utils/kingOfTheFoolsABI.json';
import { KING_OF_THE_FOOLS, ZERO_ADDRESS } from '../consts/goerli';

const useKingOfTheFools = (): {
  isFetching: boolean;
  king: string;
  lastDeposit: BigNumber;
} => {
  // fetch king and last deposit from contract
  const { data, isFetching } = useContractReads({
    contracts: [
      {
        address: KING_OF_THE_FOOLS,
        abi: kingOfTheFoolsABI,
        functionName: 'king',
      },
      {
        address: KING_OF_THE_FOOLS,
        abi: kingOfTheFoolsABI,
        functionName: 'lastDeposit',
      },
    ],
    watch: true,
  });

  if (data) {
    const [king, lastDeposit] = data;

    return {
      isFetching,
      king: king as string,
      lastDeposit: lastDeposit as BigNumber,
    };
  }

  return {
    isFetching,
    king: ZERO_ADDRESS,
    lastDeposit: BigNumber.from(0),
  };
};

export default useKingOfTheFools;
