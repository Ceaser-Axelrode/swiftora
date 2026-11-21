import LegalContainer from '@/components/LegalContainer';

export default function PrivacyPolicy() {
  return (
    <LegalContainer title="Privacy Policy" lastUpdated="March 2026">
      <section>
        <h2 className="text-xl font-semibold">
          1. Data Controller Information
        </h2>
        <p className="mt-2">
          <strong>Data Controller:</strong> Berlux Transit Solutions
          <br />
          <strong>Registered Address:</strong> 1017HL Amsterdam, The Netherlands
          <br />
          <strong>Company Registration Number:</strong> 1023479-M
          <br />
          <strong>Email:</strong>{' '}
          <a
            href="mailto:support@swiftorasolutions.com"
            className="text-orange-400 underline underline-offset-2 hover:text-orange-300"
          >
            support@swiftorasolutions.com
          </a>
          <br />
          <strong>Office Hours:</strong> Monday – Saturday, 9:00 AM – 5:00 PM
          (UTC)
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          2. Data Protection Officer (DPO)
        </h2>
        <p>
          We have appointed a Data Protection Officer to oversee compliance with
          data protection laws. Contact our DPO at{' '}
          <a
            href="mailto:dpo@swiftorasolutions.com"
            className="text-orange-400 underline underline-offset-2 hover:text-orange-300"
          >
            dpo@swiftorasolutions.com
          </a>{' '}
          for any privacy-related concerns or to exercise your rights.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">3. Information We Collect</h2>
        <p>We collect and process the following categories of personal data:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>
            <strong>Identity Data:</strong> First name, last name
          </li>
          <li>
            <strong>Contact Data:</strong> Email address, phone number
          </li>
          <li>
            <strong>Business Data:</strong> Company name (if provided)
          </li>
          <li>
            <strong>Transaction Data:</strong> Shipment tracking numbers,
            pickup/delivery addresses, shipment type, weight, delivery speed
          </li>
          <li>
            <strong>Technical Data:</strong> IP address, browser type and
            version, time zone setting, browser plug-in types, operating system,
            and platform
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you use our
            website and services
          </li>
          <li>
            <strong>Marketing Data:</strong> Your preferences in receiving
            marketing communications
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">4. Legal Basis for Processing</h2>
        <p>We process your personal data under the following legal bases:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>
            <strong>Contract (GDPR Art. 6(1)(b)):</strong> Processing necessary
            for the performance of our logistics services contract with you,
            including shipment coordination and delivery.
          </li>
          <li>
            <strong>Consent (GDPR Art. 6(1)(a)):</strong> Where you have given
            explicit consent for marketing communications or optional cookies.
          </li>
          <li>
            <strong>Legal Obligation (GDPR Art. 6(1)(c)):</strong> Processing
            necessary to comply with legal and regulatory requirements,
            including tax and customs regulations.
          </li>
          <li>
            <strong>Legitimate Interests (GDPR Art. 6(1)(f)):</strong>{' '}
            Processing necessary for our legitimate business interests,
            including fraud prevention, network security, and service
            improvement, provided these interests do not override your
            fundamental rights.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          5. How We Use Your Information
        </h2>
        <p>We use your personal data for the following purposes:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>
            Providing shipment tracking and logistics coordination services
          </li>
          <li>Processing and managing shipment requests</li>
          <li>Communicating shipment updates and delivery notifications</li>
          <li>Responding to inquiries and providing customer support</li>
          <li>Enhancing website security and preventing fraudulent activity</li>
          <li>Complying with legal, regulatory, and customs requirements</li>
          <li>
            Improving our services and website functionality (with your consent
            for analytics)
          </li>
          <li>
            Sending marketing communications (only with your explicit consent)
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          6. Data Recipients and Third-Party Processors
        </h2>
        <p>
          We may share your data with the following categories of recipients:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>
            <strong>Service Providers:</strong> Supabase (database hosting),
            Zoho (email services), hosting providers
          </li>
          <li>
            <strong>Logistics Partners:</strong> Courier and freight companies
            involved in shipment delivery
          </li>
          <li>
            <strong>Regulatory Authorities:</strong> Customs, tax authorities,
            and other government agencies as required by law
          </li>
          <li>
            <strong>Legal Advisors:</strong> When necessary to establish,
            exercise, or defend legal claims
          </li>
        </ul>
        <p className="mt-2">
          All third-party processors are bound by data processing agreements
          ensuring compliance with GDPR and appropriate security measures.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          7. International Data Transfers
        </h2>
        <p>
          As an international logistics provider, your data may be transferred
          to countries outside the European Economic Area (EEA). When we
          transfer data internationally, we ensure appropriate safeguards are in
          place:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>
            Transfers to countries with adequacy decisions from the European
            Commission
          </li>
          <li>
            Standard Contractual Clauses (SCCs) for transfers to countries
            without adequacy decisions
          </li>
          <li>Binding Corporate Rules where applicable</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">8. Data Retention Periods</h2>
        <p>
          We retain your personal data only as long as necessary for the
          purposes outlined:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>
            <strong>Shipment Data:</strong> 7 years (legal obligation for tax
            and customs records)
          </li>
          <li>
            <strong>Contact Information:</strong> Duration of business
            relationship + 3 years
          </li>
          <li>
            <strong>Marketing Consent Records:</strong> Duration of consent + 2
            years after withdrawal
          </li>
          <li>
            <strong>Website Analytics:</strong> 26 months (with consent)
          </li>
          <li>
            <strong>Cookie Consent Records:</strong> 12 months from consent date
          </li>
        </ul>
        <p className="mt-2">
          After the retention period expires, data is securely deleted or
          anonymized in accordance with our data retention policy.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          9. Your Data Protection Rights
        </h2>
        <p>
          Under GDPR, you have the following rights regarding your personal
          data:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>
            <strong>Right to Access (Art. 15):</strong> Request a copy of your
            personal data we hold.
          </li>
          <li>
            <strong>Right to Rectification (Art. 16):</strong> Request
            correction of inaccurate or incomplete data.
          </li>
          <li>
            <strong>Right to Erasure (Art. 17):</strong> Request deletion of
            your data where legally permitted.
          </li>
          <li>
            <strong>Right to Restrict Processing (Art. 18):</strong> Request
            limitation of processing in certain circumstances.
          </li>
          <li>
            <strong>Right to Data Portability (Art. 20):</strong> Receive your
            data in a structured, machine-readable format.
          </li>
          <li>
            <strong>Right to Object (Art. 21):</strong> Object to processing
            based on legitimate interests or direct marketing.
          </li>
          <li>
            <strong>Right to Withdraw Consent:</strong> Withdraw consent at any
            time without affecting lawfulness of prior processing.
          </li>
        </ul>
        <p className="mt-2">
          <strong>To exercise your rights:</strong> Email{' '}
          <a
            href="mailto:dpo@swiftorasolutions.com"
            className="text-orange-400 underline underline-offset-2 hover:text-orange-300"
          >
            dpo@swiftorasolutions.com
          </a>{' '}
          with your request and proof of identity. We respond within 30 days.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          10. Cookies and Tracking Technologies
        </h2>
        <p>
          We use cookies and similar technologies as described in our{' '}
          <a
            href="/cookie-policy"
            className="text-orange-400 underline underline-offset-2 hover:text-orange-300"
          >
            Cookie Policy
          </a>
          . You can manage your cookie preferences at any time by clicking the
          &quot;Cookie Settings&quot; button at the bottom-left of our website.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">11. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your data:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>SSL/TLS encryption for all data transmissions</li>
          <li>Secure server infrastructure with access controls</li>
          <li>Regular security assessments and penetration testing</li>
          <li>Employee training on data protection</li>
          <li>Incident response procedures for data breaches</li>
        </ul>
        <p className="mt-2">
          While we apply industry-standard safeguards, no digital transmission
          can be guaranteed fully secure. Users are responsible for safeguarding
          tracking numbers and avoiding submission of sensitive data through
          unsecured channels.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          12. Automated Decision-Making and Profiling
        </h2>
        <p>
          We do not use automated decision-making or profiling that produces
          legal effects or similarly significant consequences for individuals.
          All shipment pricing is calculated using transparent, rule-based
          algorithms without discriminatory factors.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">13. Children&apos;s Privacy</h2>
        <p>
          Our services are not intended for individuals under 18 years of age.
          We do not knowingly collect personal data from children. If you
          believe we have inadvertently collected data from a minor, please
          contact us immediately for deletion.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          14. Changes to This Privacy Policy
        </h2>
        <p>
          We may update this Privacy Policy periodically. Significant changes
          will be communicated via email or prominent notice on our website. The
          &quot;Last Updated&quot; date at the top indicates when changes were
          made.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          15. Complaints and Supervisory Authority
        </h2>
        <p>
          If you believe we have violated your data protection rights, you have
          the right to lodge a complaint with the supervisory authority:
        </p>
        <p className="mt-2">
          <strong>Autoriteit Persoonsgegevens (Dutch DPA)</strong>
          <br />
          Bezuidenhoutseweg 30, 2594 AV The Hague
          <br />
          Website:{' '}
          <a
            href="https://autoriteitpersoonsgegevens.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 underline underline-offset-2 hover:text-orange-300"
          >
            autoriteitpersoonsgegevens.nl
          </a>
        </p>
        <p className="mt-2">
          We encourage you to contact us first at{' '}
          <a
            href="mailto:dpo@swiftorasolutions.com"
            className="text-orange-400 underline underline-offset-2 hover:text-orange-300"
          >
            dpo@swiftorasolutions.com
          </a>{' '}
          to resolve any concerns.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">16. Contact Us</h2>
        <p>
          For any questions about this Privacy Policy or our data practices,
          please contact:
        </p>
        <p className="mt-2">
          <strong>Data Protection Officer</strong>
          <br />
          Email:{' '}
          <a
            href="mailto:dpo@swiftorasolutions.com"
            className="text-orange-400 underline underline-offset-2 hover:text-orange-300"
          >
            dpo@swiftorasolutions.com
          </a>
          <br />
          Address: Swiftora Solutions, 1017HL Amsterdam, The Netherlands
        </p>
      </section>
    </LegalContainer>
  );
}
