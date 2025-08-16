import { ArrowLeft } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const searchParams = new URLSearchParams(location.search);
    const query = searchParams.toString();
  
const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
            // Scroll to the top of the page when the component is mounted
            window.scrollTo(0, 0);
          }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> 
    {/* Fixed position for the Back to Payment button */}
      <button
        onClick={() => 
          navigate(`/payment${query ? `?${query}` : ''}`)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-red-600">Back to Payment</span>
      </button>
    <div className="p-6 m-4 border border-gray-300 rounded-lg bg-white shadow-sm">
      <h1 className="text-xl font-bold mb-4">Privacy Policy</h1>
      <div className="text-gray-600 text-sm">
        <h2 className="text-lg font-semibold mt-4">1. Overview</h2>
        <p className="mt-2">
          We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your information.
        </p>

        <h2 className="text-lg font-semibold mt-4">2. Information Collection</h2>
        <p className="mt-2">
          We collect personal information such as your name, phone number, seat number, and screen details to facilitate your order and ensure smooth transactions.
        </p>

        <h2 className="text-lg font-semibold mt-4">3. Use of Information</h2>
        <p className="mt-2">
          Your personal information is used solely for processing transactions, improving user experience, and providing order confirmations. It is not shared with unauthorized third parties.
        </p>

        <h2 className="text-lg font-semibold mt-4">4. Data Protection</h2>
        <p className="mt-2">
          To protect your personal information, we implement industry best practices and precautions to ensure it is not lost, misused, accessed, disclosed, altered, or destroyed.
        </p>

        <h2 className="text-lg font-semibold mt-4">5. Third-Party Payment Processors</h2>
        <p className="mt-2">
          Payments are processed through secure third-party gateways like Phonepe. These gateways adhere to PCI-DSS standards to ensure secure handling of payment information.
        </p>

        <h2 className="text-lg font-semibold mt-4">6. Retention of Information</h2>
        <p className="mt-2">
          Personal information collected is retained only as long as necessary to complete transactions and comply with legal requirements.
        </p>

        <h2 className="text-lg font-semibold mt-4">7. Changes to the Privacy Policy</h2>
        <p className="mt-2">
          We reserve the right to modify this Privacy Policy at any time. Changes will be posted on this page and take effect immediately. If material changes are made, you will be notified here.
        </p>

        <h2 className="text-lg font-semibold mt-4">8. Contact Us</h2>
        <p className="mt-2">
          For questions or concerns about this Privacy Policy, contact:
        </p>
        <ul className="list-disc ml-6">
          <li>Phone: 9346917375</li>
          <li>Email: harigepl@gmail.com</li>
          <li>Address: Geetha Multiplex, Jupalli Centre, 60 Feet Rd, Salem Nagar, Narasaraopeta, Andhra Pradesh 522601, India</li>
        </ul>

        <h2 className="text-lg font-semibold mt-4">9. Privacy and Protection of Information</h2>
        <p className="mt-2">
          To protect your personal information, we implement reasonable precautions and industry best practices to ensure it is not inappropriately lost, misused, accessed, disclosed, altered, or destroyed. All personal and payment information provided during the ordering process is handled securely and used solely for completing transactions and improving the user experience. As a third party, we act as custodians of this data for website functionality and account handling purposes.
        </p>
      </div>
    </div>
    </div>
  );
};

export default PrivacyPolicy;
