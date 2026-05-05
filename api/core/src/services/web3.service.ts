import { ethers } from 'ethers';

const RPC_URL = process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology';
const PRIVATE_KEY = process.env.ADMIN_WALLET_PRIVATE_KEY || '';
const CONTRACT_ADDRESS = process.env.ESCROW_CONTRACT_ADDRESS || '';

// Minimal ABI for the functions we need
const ABI = [
  "function deposit(string memory _bookingId, address _owner) external payable",
  "function release(string memory _bookingId) external",
  "function openDispute(string memory _bookingId) external",
  "function escrows(string memory) view returns (address tenant, address owner, uint256 amount, uint8 status, string memory bookingId)"
];

class Web3Service {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    if (PRIVATE_KEY) {
      this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, this.wallet);
    }
  }

  async getEscrowOnChain(bookingId: string) {
    if (!this.contract) return null;
    try {
      const data = await this.contract.escrows(bookingId);
      return {
        tenant: data.tenant,
        owner: data.owner,
        amount: ethers.formatEther(data.amount),
        status: data.status
      };
    } catch (error) {
      console.error('Web3 Read Error:', error);
      return null;
    }
  }

  async releaseFunds(bookingId: string) {
    if (!this.contract) throw new Error('Web3 not configured');
    const tx = await this.contract.release(bookingId);
    await tx.wait();
    return tx.hash;
  }
}

export const web3Service = new Web3Service();
