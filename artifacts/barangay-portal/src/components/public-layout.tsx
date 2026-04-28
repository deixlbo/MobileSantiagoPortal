import { Link } from "wouter";
import { Leaf, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/#officials", label: "Officials" },
    { href: "/#announcements", label: "Announcements" },
    { href: "/#ordinances", label: "Ordinances" },
    { href: "/documents", label: "Documents" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <Leaf className="h-6 w-6" />
            <span>Barangay Santiago</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Resident Portal</Button>
            </Link>
          </div>

          {/* Mobile Nav */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="h-px bg-border my-4" />
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full justify-start text-primary border-primary hover:bg-primary/10">Sign In (Admin)</Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full justify-start mt-2">Resident Portal</Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t bg-muted/40 text-muted-foreground py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-primary mb-4">
              <Leaf className="h-6 w-6" />
              <span>Barangay Santiago</span>
            </div>
            <p className="text-sm max-w-xs">
              The official portal of Barangay Santiago, San Antonio, Zambales. Serving the community with transparency and dedication.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact & Office Hours</h3>
            <ul className="space-y-2 text-sm">
              <li>Monday - Friday: 8:00 AM - 5:00 PM</li>
              <li>Barangay Hall, Purok 1, Santiago</li>
              <li>San Antonio, Zambales 2206</li>
              <li>contact@santiago.gov.ph</li>
              <li>+63 (047) 123-4567</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/documents" className="hover:text-primary transition-colors">Request Documents</Link></li>
              <li><Link href="/#ordinances" className="hover:text-primary transition-colors">Local Ordinances</Link></li>
              <li><Link href="/#announcements" className="hover:text-primary transition-colors">Announcements & Events</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Official Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border text-xs text-center">
          &copy; {new Date().getFullYear()} Barangay Santiago, San Antonio, Zambales. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
