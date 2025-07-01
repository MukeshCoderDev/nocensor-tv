import { useContract } from './web3';
import ContentDAOABI from '../contracts/ContentDAO.json';

export default function useDAO() {
  const { contract } = useContract(
    process.env.DAO_CONTRACT_ADDRESS, 
    ContentDAOABI
  );
  
  const proposeVideoTakeDown = async (cid, reason) => {
    return contract.flagContent(cid, reason);
  };
  
  return { proposeVideoTakeDown };
}
