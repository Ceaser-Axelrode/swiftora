import LegalContainer from '@/components/LegalContainer';

export default function TermsOfService() {
  return (
    <LegalContainer title="Terms of Service" lastUpdated="March 2026">
      <section>
        <h2 className="text-xl font-semibold">1. Company Information</h2>
        <p className="mt-2">
          <strong>Company Name:</strong> Swiftora Solutions
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
          <strong>Website:</strong> www.swiftorasolutions.com
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">2. Service Description</h2>
        <p>
          Swiftora Solutions provides shipment tracking and logistics
          coordination services. Information provided through our platform is
          operational in nature and may be subject to delays or changes due to
          factors beyond our control, including but not limited to customs
          procedures, aviation routing, weather conditions, regulatory
          inspections, or operational constraints.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          3. Eligibility and Age Restriction
        </h2>
        <p>By using our services, you represent and warrant that:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>
            You are at least 18 years of age or the age of legal majority in
            your jurisdiction
          </li>
          <li>You have the legal capacity to enter into binding contracts</li>
          <li>
            You are not prohibited from receiving services under applicable laws
          </li>
          <li>
            If using on behalf of an organization, you have authority to bind
            that organization
          </li>
        </ul>
        <p className="mt-2">
          We do not knowingly collect information from or provide services to
          individuals under 18.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          4. Account and User Responsibilities
        </h2>
        <p>You are responsible for:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>
            Maintaining the confidentiality of your tracking numbers and
            shipment information
          </li>
          <li>
            Ensuring all information provided is accurate, complete, and current
          </li>
          <li>All activities that occur under your use of our services</li>
          <li>Compliance with all applicable laws and regulations</li>
          <li>
            Not using our services for any illegal or unauthorized purpose
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">5. Accuracy Disclaimer</h2>
        <p>
          Shipment updates may be affected by customs procedures, aviation
          routing, weather conditions, regulatory inspections, or operational
          constraints. While we strive for accuracy, estimated delivery dates
          are projections and not guaranteed unless explicitly stated in a
          signed service agreement.
        </p>
        <p className="mt-2">
          You should verify critical shipment information directly with carriers
          and avoid submitting confidential financial or sensitive
          identification data through tracking input fields or general inquiry
          forms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">6. Prohibited Use</h2>
        <p>You may not:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>
            Attempt to breach system security or access unauthorized areas
          </li>
          <li>Manipulate, falsify, or interfere with tracking data</li>
          <li>Submit fraudulent information or use false identities</li>
          <li>
            Use automated systems (bots, scrapers) to access our services
            without permission
          </li>
          <li>
            Reverse engineer, decompile, or disassemble any portion of our
            systems
          </li>
          <li>Interfere with other users&apos; access to the platform</li>
          <li>Use our services to transmit malicious code or spam</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">7. Intellectual Property</h2>
        <p>
          All content, features, and functionality of our website and services,
          including but not limited to text, graphics, logos, icons, images,
          audio clips, and software, are the exclusive property of Swiftora
          Solutions and are protected by international copyright, trademark,
          patent, trade secret, and other intellectual property laws.
        </p>
        <p className="mt-2">
          You are granted a limited, non-exclusive, non-transferable license to
          access and use our services for their intended purpose. This license
          does not permit resale, commercial use, or creation of derivative
          works.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">8. Payment and Fees</h2>
        <p>
          Pricing for our services is calculated based on shipment weight,
          delivery speed, destination, and other factors. All prices are
          displayed in USD unless otherwise stated and do not include applicable
          taxes unless specified.
        </p>
        <p className="mt-2">
          Payment terms are net due upon service request unless alternative
          arrangements have been agreed upon in writing. Failure to pay may
          result in service suspension and additional fees.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">9. Limitation of Liability</h2>
        <p>To the maximum extent permitted by applicable law:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>
            Swiftora Solutions shall not be liable for indirect, incidental,
            special, consequential, or punitive damages, including loss of
            profits, revenue, data, or business opportunities
          </li>
          <li>
            Our total liability shall not exceed the amount paid by you for the
            specific logistics service giving rise to the liability, or €500,
            whichever is less
          </li>
          <li>
            We are not liable for delays or failures caused by events beyond our
            reasonable control, including acts of God, war, terrorism, labor
            disputes, government actions, or Internet service failures
          </li>
        </ul>
        <p className="mt-2">
          Services are provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;
          without warranties of any kind, either express or implied, including
          but not limited to implied warranties of merchantability, fitness for
          a particular purpose, or non-infringement.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">10. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Berlux Transit
          Solutions, its officers, directors, employees, agents, and affiliates
          from and against any claims, liabilities, damages, losses, and
          expenses (including reasonable legal fees) arising out of or in any
          way connected with:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Your access to or use of our services</li>
          <li>Your violation of these Terms of Service</li>
          <li>
            Your violation of any third-party right, including intellectual
            property or privacy rights
          </li>
          <li>Any shipment content that violates applicable laws</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">11. Termination</h2>
        <p>
          We may terminate or suspend your access to our services immediately,
          without prior notice or liability, for any reason, including breach of
          these Terms.
        </p>
        <p className="mt-2">
          Upon termination, your right to use our services will immediately
          cease. All provisions which by their nature should survive termination
          shall survive, including ownership provisions, warranty disclaimers,
          indemnity, and limitations of liability.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          12. Governing Law and Jurisdiction
        </h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the Netherlands, without regard to its conflict of law
          provisions.
        </p>
        <p className="mt-2">
          Any dispute arising out of or relating to these Terms or our services
          shall be subject to the exclusive jurisdiction of the courts of
          Amsterdam, the Netherlands. You agree to submit to the personal
          jurisdiction of these courts for the purpose of litigating any such
          claims.
        </p>
        <p className="mt-2">
          Before initiating legal proceedings, we encourage you to contact us at{' '}
          <a
            href="mailto:support@swiftorasolutions.com"
            className="text-orange-400 underline underline-offset-2 hover:text-orange-300"
          >
            support@swiftorasolutions.com
          </a>{' '}
          to attempt to resolve the dispute informally.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">13. Dispute Resolution</h2>
        <p>
          Any controversy or claim arising out of or relating to these Terms
          shall first be attempted to be resolved through good faith
          negotiation. If the dispute cannot be resolved through negotiation
          within 30 days, either party may pursue formal legal remedies as
          provided in Section 12.
        </p>
        <p className="mt-2">
          Nothing in this section shall prevent either party from seeking
          injunctive relief in a court of competent jurisdiction to prevent
          irreparable harm.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">14. Force Majeure</h2>
        <p>
          We shall not be liable for any failure or delay in performing our
          obligations where such failure or delay results from circumstances
          beyond our reasonable control, including but not limited to: acts of
          God, natural disasters, war, terrorism, riots, embargoes, acts of
          civil or military authorities, fire, floods, accidents, strikes, or
          shortages of transportation, facilities, fuel, energy, labor, or
          materials.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">15. Changes to These Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Changes will
          be effective immediately upon posting the updated Terms on our
          website. Your continued use of our services after any changes
          constitutes your acceptance of the revised Terms.
        </p>
        <p className="mt-2">
          For significant changes, we will provide notice through:
        </p>
        <ul className="list-disc ml-6 mt-1 space-y-1">
          <li>Email notification to registered users</li>
          <li>Prominent notice on our website</li>
          <li>Update to the &quot;Last Updated&quot; date</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">16. Severability</h2>
        <p>
          If any provision of these Terms is found to be unenforceable or
          invalid, that provision shall be limited or eliminated to the minimum
          extent necessary so that these Terms shall otherwise remain in full
          force and effect and enforceable.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">17. Entire Agreement</h2>
        <p>
          These Terms, together with our Privacy Policy, Cookie Policy, and
          Disclaimer, constitute the entire agreement between you and Berlux
          Transit Solutions regarding the use of our services and supersede all
          prior agreements and understandings.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">18. Contact Information</h2>
        <p>For questions about these Terms of Service, please contact us:</p>
        <p className="mt-2">
          <strong>Swiftora Solutions</strong>
          <br />
          Email:{' '}
          <a
            href="mailto:support@swiftorasolutions.com"
            className="text-orange-400 underline underline-offset-2 hover:text-orange-300"
          >
            support@swiftorasolutions.com
          </a>
          <br />
          Address: 1017HL Amsterdam, The Netherlands
          <br />
          Business Hours: Monday – Saturday, 9:00 AM – 5:00 PM (UTC)
        </p>
      </section>
    </LegalContainer>
  );
}
