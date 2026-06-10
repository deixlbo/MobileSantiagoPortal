import Link from "next/link"

export const metadata = {
  title: "Privacy Policy | Barangay Santiago Portal",
  description: "Privacy policy for Barangay Santiago Portal, covering personal data, cookies, and use of information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/40">
          <div className="mb-8 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Privacy Policy</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Barangay Santiago Management System
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600">
              This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use the Barangay Santiago Portal.
            </p>
          </div>

          <div className="space-y-10 text-slate-700">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Information We Collect</h2>
              <p className="leading-7">
                We collect information you provide directly through the portal, including account details, profile information, document requests, and uploaded verification documents. We also collect technical information from your device to support functionality and security.
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Contact information such as name, email, phone number, and address</li>
                <li>Profile details for residents, officials, and administrators</li>
                <li>Document request data, application status, and upload files</li>
                <li>Authentication and session information</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">How We Use Your Information</h2>
              <p className="leading-7">
                Your information is used to provide, maintain, and improve portal services, respond to inquiries, deliver notifications, and protect the security of the system. We do not sell personal data.
              </p>
              <p className="leading-7">
                We may use your data to:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Process document requests, verification, and approvals</li>
                <li>Send service updates, announcements, and emergency alerts</li>
                <li>Manage user accounts and authenticate access</li>
                <li>Improve service performance and user experience</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Data Sharing and Disclosure</h2>
              <p className="leading-7">
                We only share personal information with authorized personnel and service providers when necessary to deliver services or comply with legal requirements. We require partners to protect data in accordance with applicable privacy laws.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Security</h2>
              <p className="leading-7">
                We use reasonable administrative, technical, and physical safeguards to protect your information. While no system is completely secure, we strive to maintain a secure environment and monitor for unauthorized access.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Cookies and Tracking</h2>
              <p className="leading-7">
                The portal may use cookies and similar technologies to enable essential functionality, remember preferences, and analyze usage patterns. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Your Rights</h2>
              <p className="leading-7">
                You may access, update, or delete your account information where permitted by the portal. For questions about your privacy rights, contact the barangay administration using the details below.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Contact Us</h2>
              <p className="leading-7">
                For questions about this Privacy Policy, please contact the Barangay Santiago administration at{' '}
                <a href="mailto:brgy.santiago.saz@gmail.com" className="text-primary underline hover:text-primary/80">
                  brgy.santiago.saz@gmail.com
                </a>
                .
              </p>
            </section>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>Last updated: June 2026</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/terms-of-service" className="text-primary transition-colors hover:text-primary/80">
                View Terms of Service
              </Link>
              <Link href="/resident/register" className="text-slate-600 transition-colors hover:text-slate-900">
                Return to register
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
