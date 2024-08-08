import Layout from '../components/layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Welcome to Passkey Wallet</h1>
        <p className="mb-4">
          Passkey Wallet is a secure and easy-to-use Ethereum wallet that leverages the power of passkeys for authentication.
        </p>
        <Link href="/demo" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          Try the Demo
        </Link>
      </div>
    </Layout>
  );
}