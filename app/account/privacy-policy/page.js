import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyCard() {
  return (
    <div className="w-full mx-auto md:ring-1 md:rounded-lg ring-gray-200 md:shadow-md">
      <Card className="w-full md:p-6">
        <CardHeader className="md:pb-2">
          <CardTitle className="text-xl font-semibold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="md:space-y-6 space-y-3">
          {/* Information We Collect */}
          <div>
            <h3 className="text-teal-700 font-semibold mb-2">Information We Collect</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-semibold">Account Details:</span> Name, email, phone number, and address when you
                sign up.
              </li>
              <li>
                <span className="font-semibold">Order & Payment Info:</span> Details of your purchases (payments are
                processed securely via third-party providers).
              </li>
              <li>
                <span className="font-semibold">Usage Data:</span> App interactions and preferences to improve your
                experience.
              </li>
            </ul>
          </div>

          {/* How We Use Your Information */}
          <div>
            <h3 className="text-teal-700 font-semibold mb-2">How We Use Your Information</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>To process orders and provide seamless shopping.</li>
              <li>To send order updates and promotional offers (you can opt out anytime).</li>
              <li>To enhance app functionality and customer support.</li>
            </ul>
          </div>

          {/* Data Protection */}
          <div>
            <h3 className="text-teal-700 font-semibold mb-2">Data Protection</h3>
            <p className="text-sm">
             {` We implement strict security measures to safeguard your data. We do not sell or share your personal
              information with third parties except for order fulfillment and legal compliance.`}
            </p>
          </div>

          {/* Your Rights */}
          <div>
            <h3 className="text-teal-700 font-semibold mb-2">Your Rights</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Access, update, or delete your account information.</li>
              <li>Opt out of marketing communications.</li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-teal-700 font-semibold mb-2">Contact Us</h3>
            <p className=" text-sm">{`For any questions, email us at [support@brindah.com].`}</p>
            <p className="mt-2 text-sm">
             {` By using Brindah Buyer App, you agree to this Privacy Policy. We may update it from time to time, and
              changes will be posted here.`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

