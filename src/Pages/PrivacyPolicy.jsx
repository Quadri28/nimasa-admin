import React from "react";

const PrivacyPolicy = () => {
  const policies = [
    {
      id: 1,
      term: "When you use the UCP App, we may collect the following types of information:",
      no: "1",
      title: "Information we collect",
      menuTitle: "Personal Information",
      menu: [
        "Full Name",
        "Phone Number",
        "Email Address",
        "Cooperative Membership ID",
        "BVN (where applicable)",
        "Bank Account Details",
        "Identification documents (NIN, voter’s card, etc.)",
      ],
      menuTitle2: "Usage Information",
      menu2: [
        "Log-in timestamps",
        "Device type and model",
        "App usage analytics",
        "IP address",
        "Location data (optional)",
        "Transaction Information",
        "Savings and loan transactions",
      ],
      menuTitle3: "Transaction Information",
      menu3: [
        "Savings and loan transactions",
        "Contribution records",
        "Payment history",
        "Wallet balance and activity",
      ],
    },
    {
      id: 2,
      term: "We use the information we collect to:",
      no: "2",
      title: "How We Use Your Information",
      menu: [
        "Provide access to cooperative services (savings, loans, contributions)",
        "Authenticate and verify member identity",
        "Maintain accurate cooperative records",
        "Facilitate transactions and withdrawals",
        "Send alerts, updates, and push notifications",
        "Improve app functionality and security",
        "Comply with legal and regulatory requirements",
      ],
    },
    {
      id: 3,
      term: "We do not sell or trade your personal information. However, we may share data with:",
      no: "3",
      title: "Data Sharing and Disclosure",
      menu: [
        'Cooperative management and administrators',
        'Authorized third-party service providers (e.g., payment gateways, KYC services)',
        'Regulatory authorities (upon legal request or compliance requirements)',
        'Cloud storage and IT infrastructure partners (under strict data protection agreements)'
     ],
    },
    {
      id: 4,
      term: "We implement industry-standard security measures to protect your data, including:",
      no: "4",
      title: "Data Security",
      menu:[
        'End-to-end encryption','Secure login and two-factor authentication','Role-based access control', 'Regular security audits and updates'
      ]
    },
    {
      id: 5,
      term: "You have the right to:",
      no: "5",
      title: "Your Rights and Choices",
      menu: [
       'Access and update your personal information','Request deletion of your data (subject to legal obligations)','Withdraw consent for optional data uses','Disable location or push notification access via your device settings',
      ],
    },
    {
      id: 6,
      term: "UCP may use cookies or similar tracking technologies to enhance user experience. You can manage cookie preferences via your device or browser settings.",
      no: "6",
      title: "Cookies and Tracking",
    },
    {
      id: 7,
      term: "The UCP app is not intended for individuals under the age of 18. We do not knowingly collect personal data from minors without parental consent.",
      no: "7",
      title: "Children's Privacy",
    },
    {
      id: 8,
      term: "We may update this Privacy Policy from time to time. Users will be notified of significant changes via in-app alerts or email.",
      no: "7",
      title: "Changes to this Privacy Policy",
    },
    {
      id: 9,
      term: "If you have questions or concerns about this policy or how your data is handled, please contact:",
      no: "7",
      title: "Contact us",
      menu: ['UCP Support Team','Email: support.ucp@cwg-plc.com','Phone: +234-816-868-3046'],
    },
  ];
  return (
    <div style={{ backgroundColor: "#EDF4FF" }}>
      <div className="container d-flex flex-column">
        <div
          className="text-center py-3 rounded-2 w-100 mt-5"
          style={{ backgroundColor: "#0452C8" }}
        >
          <h2
            className="text-white"
            style={{ fontWeight: "700", fontSize: "20px" }}
          >
            Privacy Policy
          </h2>
        </div>
        <div className="container">
          <div>
            <h3 className="text-center mt-3">Welcome to UCP!</h3>
            <p>
              At Unified Cooperative Platform (UCP), we are committed to
              protecting the privacy and personal information of our users. This
              Privacy Policy outlines how we collect, use, disclose, and
              safeguard your data when you use our mobile application and
              related services.{" "}
            </p>
          </div>
        </div>
        <div>
          {policies.map((item) => (
            <div className="d-flex flex-column gap-2" key={item.id}>
              <div
                style={{ backgroundColor: "#CDE1FE" }}
                className="rounded-2 p-2"
              >
                {item.no}. {item.title}
              </div>
              <div>{item.term}</div>
              <div>
                <div>{item.menuTitle}</div>
                <ul className="d-flex flex-column gap-2">
                  {item?.menu?.map((menu, i) => (
                    <li key={i}>{menu}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-3">{item.menuTitle2}</div>
                <ul className="d-flex flex-column gap-2">
                  {item?.menu2?.map((menu, i) => (
                    <li key={i}>{menu}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-3">{item.menuTitle3}</div>
                <ul className="d-flex flex-column gap-2">
                  {item?.menu3?.map((menu, i) => (
                    <li key={i}>{menu}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <p className="text-center">
            By using UCP, you agree to the terms outlined in this Privacy
            Policy. Thank you for trusting us to be your cooperative platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
