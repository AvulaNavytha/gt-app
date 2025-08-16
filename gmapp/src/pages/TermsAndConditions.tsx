import { ArrowLeft } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const searchParams = new URLSearchParams(location.search);
    const query = searchParams.toString();

const TermsAndConditions: React.FC = () => {
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
      {/* Replace with your actual terms and conditions */}
      <p className="text-gray-600 text-sm">
        <span style={{ fontWeight: 'bold' }}>OVERVIEW </span>
        <br /><br />
        This website is operated by <span style={{ fontWeight: 'bold' }}>GEETHA ENTERTAINMENT PRIVATE LIMITED</span> Throughout the site, the terms “we”, “us” and “our” refer to <span style={{ fontWeight: 'bold' }}>GEETHA ENTERTAINMENT PRIVATE LIMITED. GEETHA ENTERTAINMENT PRIVATE LIMITED</span> offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
        <br />By visiting our site and/ or purchasing something from us, you engage in our “Service” and agree to be bound by the following Terms and Conditions . These Terms and Conditions apply  to all users of the site, including without limitation users who are browsers, customers, merchants, and/ or contributors of content.
        <br />
        Please read these Terms and Conditions carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms and Conditions. If you do not agree to all the terms and conditions of this agreement, then you may not access the payment or use any services. 
        <br />
        Any new features or tools which are added to the current store shall also be subject to the terms and conditions. You can review the most current version of the Terms and Conditions at any time on this page. We reserve the right to update, change or replace any part of these Terms and Conditions by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
        <br />
        <span style={{ fontWeight: 'bold' }}>Terms and Conditions</span>
      </p>
      <p className="text-gray-600 text-sm mt-4">
        <span style={{ fontWeight: '500' }}>1. Pricing Policy</span><br />
        All prices displayed on our website are exclusive of applicable taxes and fees.
        <br />
        The total bill will include the following charges:
        <ul>
          <li>CGST , SGST and Handling Fee: 6% (comprising the server costs and service and the maintanence of the website)</li>
        </ul>
        <br />
        <span style={{ fontWeight: '500' }}>2. what do we do with your information </span><br />
        When you purchase something from our theatre, as part of the selling process, we collect the personal information you give us such as your name, phone number, seat number and screen to handle the order to reach you while delivering the item/items.
        <br /><br />
        <span style={{ fontWeight: '500' }}>3. Payee Information</span><br />
        All payments made on this platform are directed to GEETHA ENTERTAINMENT PRIVATE LIMITED.
        <br /><br />
        <span style={{ fontWeight: '500' }}>4. Payment Methods</span><br />
        We use phonepe for processing payments. We/Phonepe do not share your card data to others on their servers. The data is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS) when processing payment. Your purchase transaction data is only used as long as is necessary to complete your purchase transaction. After that is complete, your purchase transaction information is not saved.
        <br />
        Our payment gateway adheres to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, MasterCard, American Express and Discover.
        <br />
        PCI-DSS requirements help ensure the secure handling of credit card information by our store and its service providers.
        <br /><br />
        <span style={{ fontWeight: '500' }}>5. Transaction Confirmation</span><br />
        After a successful transaction, you will receive a confirmation of your order and payment in the webpage itself. Please ensure that the details provided are accurate.
        <br /><br />
        <span style={{ fontWeight: '500' }}>6. Food Items: Health and Safety</span><br />
        All food items listed on this website adhere to strict health and safety standards.
        <br />
        We source food items from trusted suppliers to ensure quality and compliance with food safety regulations.
        <br />
        Customers with specific allergies or dietary restrictions are advised to review item details carefully before placing an order.
        <br /><br />
        <span style={{ fontWeight: '500' }}>7. Ownership of Food Items</span><br />
        The ownership and responsibility for the preparation and quality of food items lie with GEETHA ENTERTAINMENT PRIVATE LIMITED or its associated partners.
        <br />
        Any issues related to food preparation or quality will be addressed by the management of GEETHA ENTERTAINMENT PRIVATE LIMITED.
        <br /><br />
        <span style={{ fontWeight: '500' }}>8. Privacy and Protection of Information</span><br />
        To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
        <br/>
        All personal and payment information provided during the ordering process is handled securely and used solely for the purpose of completing transactions and improving user experience. 
        <br /><br />
        <span style={{ fontWeight: '500' }}>9. Refund and Cancellation Policy</span><br />
        Once an order is placed, it cannot be canceled or refunded( i.e product can’t be returned in any circumstances)
        <br /><br />
        <span style={{ fontWeight: '500' }}>10. shipping/delivery</span><br />
        The items/product ordered we be delivered within 1 hour from the time of order placed.
        <br /><br />
        <span style={{ fontWeight: '500' }}>11. Taxes and Fees</span><br />
        Any additional taxes or fees applicable at the time of purchase will be clearly indicated in your order summary before checkout.
        <br /><br />
        <span style={{ fontWeight: '500' }}>12. Dispute Resolution</span><br />
        For any payment disputes, quality concerns, or queries, please contact our support team. We strive to address all concerns promptly.
        <br /><br />
        <span style={{ fontWeight: '500' }}>13. changes to this privacy policy</span><br />
        We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website. If we make material changes to this policy, we will notify you here that it has been updated, so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we use and/or disclose it.
        <br />
        If our store is acquired or merged with another company, your information may be transferred to the new owners so that we may continue to sell products to you.
        <br /><br />
        <span style={{ fontWeight: '500' }}>14. Acknowledgment</span><br />
        By placing an order and completing the payment, you acknowledge and accept these terms and conditions.
        Contact: 919966992426 <br />
        Email: geethamultiplexnrt@gmail.com <br />
        Address: Geetha Multiplex, Kasu central Mall, ooo GBR Hospital, Near Palnadu Bus Stand, Narasaraopet, Andhra Pradesh 522601, India
        <br />
      </p>
    </div>
    </div>
  );
};

export default TermsAndConditions;
