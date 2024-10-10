import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;
const AppFooter: React.FC = () => {
    return (
        <Layout>
            <Footer className="bg-black text-white ">
                <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Contact Us */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">CONTACT US</h3>
                        <p>Tel: 01647 632006</p>
                        <p>Intl: +44 1647 632006</p>
                        <p>Subside Sports Ltd</p>
                        <p>50-54 The Square</p>
                        <p>Chagford, Devon</p>
                        <p>TQ13 8AH, GB</p>
                        <p className="mt-1">sales@subside.co.uk</p>
                    </div>

                    {/* Help & Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">HELP & INFORMATION</h3>
                        <ul className="space-y-1">
                            <li>FAQs</li>
                            <li>Privacy Policy</li>
                            <li>Customer Service</li>
                            <li>Shipping</li>
                            <li>Size Information</li>
                            <li>Returns</li>
                            <li>Printing</li>
                            <li>Ordering</li>
                            <li>Marketing & Promotions</li>
                            <li>Terms & Conditions</li>
                        </ul>
                    </div>

                    {/* About Subside */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">ABOUT SUBSIDE</h3>
                        <ul className="space-y-1">
                            <li>Our Berlin Shop</li>
                            <li>Subside Sports Worldwide</li>
                            <li>Blog</li>
                        </ul>
                    </div>

                    {/* Payment Methods */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">PAYMENT METHODS</h3>
                        <p className="mb-3">
                            VISA / Mastercard<br />
                            All Major Credit & Debit Cards<br />
                            Klarna Pay Later<br />
                            Cheque / Bank Transfer<br />
                            Paypal
                        </p>

                    </div>
                </div>
                <div className="mt-6 border-t border-gray-600 pt-4 text-center text-sm">
                    <p>© Subside Sports 1994 to 2024. All Rights Reserved</p>
                    <p className="mt-1">
                        <a href="/" className="underline">Sitemap</a>
                    </p>
                </div>
            </Footer>
        </Layout>
    );
};

export default AppFooter;
