'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import styles from './page.module.css';
import { LogIn, Shield, FileText, Bell, AlertCircle, Users, Zap, Phone, Heart, Clock, MapPin } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>◼</div>
            <span>Barangay Santiago Saz</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </div>
          <div className={styles.navAuth}>
            <button onClick={() => router.push('/login')} className={styles.residentLogin}>
              <LogIn size={18} /> Resident Login
            </button>
            <button onClick={() => router.push('/login')} className={styles.officialLogin}>
              <Shield size={18} /> Official Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Zap size={16} /> AI-ASSISTED PORTAL
          </div>
          <h1>Barangay Santiago Saz</h1>
          <p className={styles.subtitle}>Resident & Official Portal</p>
          <p className={styles.description}>
            Smart Document Processing and Resident Service Automation for Barangay Santiago, San Antonio, Zambales
          </p>
          <div className={styles.heroCta}>
            <button onClick={() => router.push('/login')} className={styles.ctaButton + ' ' + styles.primary}>
              <LogIn size={20} /> Resident Login
            </button>
            <button onClick={() => router.push('/login')} className={styles.ctaButton + ' ' + styles.secondary}>
              <Shield size={20} /> Official Login
            </button>
          </div>
        </div>
      </section>

      {/* Residents Section */}
      <section id="services" className={styles.section}>
        <div className={styles.sectionLabel}>FOR RESIDENTS</div>
        <h2>Easy Access to Barangay Services</h2>
        <p className={styles.sectionDescription}>
          Request documents, file reports, view announcements, and participate in community programs — all from one convenient portal.
        </p>

        <div className={styles.cardsGrid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>📋</div>
            <h3>Request Documents</h3>
            <p>Clearance, Certificate of Residency, Indigency & more</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>📢</div>
            <h3>View Announcements</h3>
            <p>Stay updated with barangay news and important alerts</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>📁</div>
            <h3>File Blotter Reports</h3>
            <p>Report incidents and track case status online</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🎯</div>
            <h3>Join Programs</h3>
            <p>Participate in community projects and activities</p>
          </div>
        </div>
      </section>

      {/* Officials Section */}
      <section className={styles.section + ' ' + styles.officialSection}>
        <div className={styles.sectionLabel}>FOR OFFICIALS</div>
        <h2>Powerful Administrative Tools</h2>
        <p className={styles.sectionDescription}>
          Efficiently manage resident services, documents, announcements, and community programs with AI-assisted tools.
        </p>

        <div className={styles.cardsGrid + ' ' + styles.sixColumns}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>📄</div>
            <h3>Manage Document Requests</h3>
            <p>Approve, reject, and process barangay clearances, certificates, and permits.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>📣</div>
            <h3>Post Announcements</h3>
            <p>Share important updates, alerts, and notices to all residents in the barangay.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>📋</div>
            <h3>Blotter Management</h3>
            <p>Record, review, and update incident reports with status tracking.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>👥</div>
            <h3>Resident Records</h3>
            <p>View and manage resident profiles, demographics, and contact information.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🏢</div>
            <h3>Projects & Programs</h3>
            <p>Organize barangay events, outreach programs, and community activities.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>⚡</div>
            <h3>AI-Assisted Processing</h3>
            <p>Faster document verification and smart severity classification for incidents.</p>
          </div>
        </div>
      </section>

      {/* Community Info Section */}
      <section id="contact" className={styles.section}>
        <div className={styles.sectionLabel}>COMMUNITY</div>
        <h2>Important Information</h2>
        <p className={styles.sectionDescription}>Emergency contacts and barangay information</p>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Phone size={24} />
            </div>
            <h3>Emergency Hotlines</h3>
            <div className={styles.infoContent}>
              <p><strong>Barangay Office:</strong> 0912-345-6789</p>
              <p><strong>Police (PNP):</strong> 911</p>
              <p><strong>Fire Department:</strong> 160</p>
              <p><strong>Medical Emergency:</strong> 143</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Heart size={24} />
            </div>
            <h3>Health Center</h3>
            <div className={styles.infoContent}>
              <p><strong>Brgy. Santiago Health Center</strong></p>
              <p>Contact: 0923-456-7890</p>
              <p>Hours: Mon-Fri 8AM-5PM</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Clock size={24} />
            </div>
            <h3>Office Hours</h3>
            <div className={styles.infoContent}>
              <p><strong>Monday–Friday:</strong> 8 AM – 5 PM</p>
              <p><strong>Saturday:</strong> 8 AM – 12 PM</p>
              <p><strong>Sunday:</strong> Closed</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <MapPin size={24} />
            </div>
            <h3>Location</h3>
            <div className={styles.infoContent}>
              <p><strong>Barangay Santiago Hall</strong></p>
              <p>San Antonio, Zambales</p>
              <p>Province of Zambales</p>
              <p className={styles.nearCourt}>📍 Near Covered Court</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>◼</div>
            <h3>Barangay Santiago Saz</h3>
          </div>
          <p>Republic of the Philippines | Province of Zambales | Municipality of San Antonio</p>
          <p className={styles.copyright}>© 2026 Barangay Santiago Saz Portal. AI-Assisted Smart Document Processing.</p>
        </div>
      </footer>
    </div>
  );
}
