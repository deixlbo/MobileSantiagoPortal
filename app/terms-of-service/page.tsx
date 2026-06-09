import Link from "next/link"

export const metadata = {
  title: "Terms of Service | Barangay Santiago Portal",
  description: "Terms of service for Barangay Santiago Portal, including acceptable use, account responsibilities, and service availability.",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/40">
          <div className="mb-8 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Terms of Service</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Barangay Santiago Portal Terms
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600">
              These Terms of Service govern your use of the Barangay Santiago Portal. By accessing the portal, you agree to follow the rules below.
            </p>
          </div>

          <div className="space-y-10 text-slate-700">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Acceptable Use</h2>
              <p className="leading-7">
                Use the portal lawfully and respectfully. Do not attempt to access unauthorized sections, disrupt services, or misuse the site for fraudulent or abusive purposes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Account Responsibilities</h2>
              <p className="leading-7">
                You are responsible for maintaining the confidentiality of your login details. Notify the barangay administration immediately if you suspect unauthorized access.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Service Availability</h2>
              <p className="leading-7">
                The portal is provided as a public service to residents and officials. We strive to keep it available, but access may be interrupted for maintenance, upgrades, or emergencies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">User Content</h2>
              <p className="leading-7">
                Any content you submit through the portal must be accurate and lawful. The barangay may remove or reject submissions that violate policies or are inappropriate.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Privacy</h2>
              <p className="leading-7">
                Your use of the portal is also governed by our Privacy Policy, which explains how personal data is collected and processed.
              </p>
              <Link href="/privacy-policy" className="text-primary underline hover:text-primary/80">
                Read the Privacy Policy
              </Link>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Changes to Terms</h2>
              <p className="leading-7">
                We may update these Terms to reflect changes in the portal or legal requirements. Continued use after updates means you accept the revised terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-900">Contact Information</h2>
              <p className="leading-7">
                If you have questions about these Terms, contact the Barangay Santiago administration at{' '}
                <a href="mailto:brgy.santiago.saz@gmail.com" className="text-primary underline hover:text-primary/80">
                  brgy.santiago.saz@gmail.com
                </a>
                .
              </p>
            </section>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>Effective date: June 2026</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy-policy" className="text-primary transition-colors hover:text-primary/80">
                Privacy Policy
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
