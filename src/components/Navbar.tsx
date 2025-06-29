import { Link } from 'react-router-dom';
import WalletButton from './WalletButton';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-10">
        <Link to="/" className="text-2xl font-bold text-purple-400">NoCensor TV</Link>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-purple-300">Home</Link>
          <Link to="/trending" className="hover:text-purple-300">Trending</Link>
          <Link to="/nft-access" className="hover:text-purple-300">NFT Access</Link>
          <Link to="/shorts" className="hover:text-purple-300">Shorts</Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search videos, creators, and NFTs..."
          className="bg-gray-700 px-4 py-2 rounded-lg w-64 hidden md:block"
        />
        <WalletButton />
      </div>
    </nav>
  );
}
