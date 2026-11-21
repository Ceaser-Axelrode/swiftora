import LegalContainer from '@/components/LegalContainer';

export default function CookiePolicy() {
  return (
    <LegalContainer title="Cookie Policy" lastUpdated="March 2026">
      <section>
        <h2 className="text-xl font-semibold">1. What Are Cookies</h2>
        <p>
          Cookies are small text files stored on your device when you visit
          websites. They help us provide and improve our services by remembering
          your preferences, understanding how you use our site, and enabling
          certain functionality.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">2. How We Use Cookies</h2>
        <p>We use cookies for the following purposes:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>
            <strong>Essential:</strong> Required for the website to function
            properly
          </li>
          <li>
            <strong>Analytics:</strong> Help us understand website usage and
            improve our services
          </li>
          <li>
            <strong>Marketing:</strong> Enable personalized advertising and
            promotional content
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">3. Types of Cookies We Use</h2>

        <div className="mt-4 space-y-4">
          <div className="overflow-x-auto rounded-xl border border-border bg-muted/40 p-4">
            <h3 className="font-semibold">Essential Cookies (Always Active)</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              These cookies are necessary for the website to function and cannot
              be disabled. They enable core functionality such as security,
              network management, and accessibility.
            </p>
            <table className="mt-3 w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Cookie Name</th>
                  <th className="text-left py-2">Purpose</th>
                  <th className="text-left py-2">Duration</th>
                  <th className="text-left py-2">Provider</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">cookie_consent_v2</td>
                  <td>Stores your cookie preferences</td>
                  <td>12 months</td>
                  <td>Swiftora Solutions</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">next-auth.session-token</td>
                  <td>Maintains admin session</td>
                  <td>Session</td>
                  <td>Swiftora Solutions</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-muted/40 p-4">
            <h3 className="font-semibold">Analytics Cookies (Optional)</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              These cookies help us understand how visitors interact with our
              website by collecting and reporting information anonymously.
            </p>
            <table className="mt-3 w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Cookie Name</th>
                  <th className="text-left py-2">Purpose</th>
                  <th className="text-left py-2">Duration</th>
                  <th className="text-left py-2">Provider</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">_ga</td>
                  <td>Google Analytics - distinguishes users</td>
                  <td>26 months</td>
                  <td>Google</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">_gid</td>
                  <td>Google Analytics - distinguishes users</td>
                  <td>24 hours</td>
                  <td>Google</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">_gat</td>
                  <td>Google Analytics - throttles request rate</td>
                  <td>1 minute</td>
                  <td>Google</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-muted/40 p-4">
            <h3 className="font-semibold">Marketing Cookies (Optional)</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              These cookies are used to deliver advertisements more relevant to
              you and your interests. They are also used to limit the number of
              times you see an advertisement.
            </p>
            <table className="mt-3 w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Cookie Name</th>
                  <th className="text-left py-2">Purpose</th>
                  <th className="text-left py-2">Duration</th>
                  <th className="text-left py-2">Provider</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">_fbp</td>
                  <td>Facebook Pixel - stores unique user ID</td>
                  <td>3 months</td>
                  <td>Meta/Facebook</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">fr</td>
                  <td>Facebook Pixel - advertising delivery</td>
                  <td>3 months</td>
                  <td>Meta/Facebook</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">IDE</td>
                  <td>Google DoubleClick - advertising</td>
                  <td>13 months</td>
                  <td>Google</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          4. Managing Your Cookie Preferences
        </h2>
        <p className="mt-2">
          You can manage your cookie preferences at any time by clicking the{' '}
          <strong>&quot;Cookie Settings&quot;</strong> button located at the
          bottom-left corner of our website. You can:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Accept all cookies</li>
          <li>Reject all optional cookies (analytics and marketing)</li>
          <li>Customize which optional cookie categories you accept</li>
          <li>Change your preferences at any time</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">5. Browser Cookie Controls</h2>
        <p className="mt-2">
          You can also control cookies through your browser settings. Most
          browsers allow you to:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>View cookies stored on your device</li>
          <li>Delete individual cookies or all cookies</li>
          <li>Block cookies from specific websites or all websites</li>
          <li>Receive alerts when a website wants to place a cookie</li>
        </ul>
        <p className="mt-2">
          Please note that blocking or deleting cookies may impact your
          experience on our website and prevent certain features from working
          properly.
        </p>
        <p className="mt-2">Learn how to manage cookies in your browser:</p>
        <ul className="list-disc ml-6 mt-1 space-y-1">
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 underline underline-offset-2 hover:text-orange-300"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 underline underline-offset-2 hover:text-orange-300"
            >
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 underline underline-offset-2 hover:text-orange-300"
            >
              Safari
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-4617-94e3f7c95f50"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 underline underline-offset-2 hover:text-orange-300"
            >
              Microsoft Edge
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">6. Third-Party Cookies</h2>
        <p>
          Some cookies are placed by third-party services that appear on our
          pages. We use third-party services for:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>
            <strong>Analytics:</strong> Google Analytics for website usage
            analysis
          </li>
          <li>
            <strong>Maps:</strong> Map services for shipment tracking
            visualization
          </li>
          <li>
            <strong>Social Media:</strong> Integration with social platforms
          </li>
        </ul>
        <p className="mt-2">
          These third parties may use cookies, web beacons, and similar
          technologies to collect information about your online activities. We
          recommend reviewing their respective privacy policies for more
          information.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          7. Changes to This Cookie Policy
        </h2>
        <p>
          We may update this Cookie Policy periodically to reflect changes in
          the cookies we use or for operational, legal, or regulatory reasons.
          The &quot;Last Updated&quot; date at the top of this page indicates
          when the policy was last revised.
        </p>
        <p className="mt-2">
          Any significant changes will be communicated through a prominent
          notice on our website or via email if you have provided consent for
          marketing communications.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">8. Contact Us</h2>
        <p>
          If you have any questions about our use of cookies or this Cookie
          Policy, please contact us:
        </p>
        <p className="mt-2">
          <strong>Email:</strong>{' '}
          <a
            href="mailto:dpo@swiftorasolutions.com"
            className="text-orange-400 underline underline-offset-2 hover:text-orange-300"
          >
            dpo@swiftorasolutions.com
          </a>
          <br />
          <strong>Address:</strong> Swiftora Solutions, 1017HL Amsterdam, The
          Netherlands
        </p>
      </section>
    </LegalContainer>
  );
}
