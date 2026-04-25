import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ─── Shared Legal Page Layout ─── */
function LegalPage({ title, children }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${title} | VidaSazón`;
    return () => {
      document.title = 'VidaSazón | Healthy Diabetic-Friendly Recipes';
    };
  }, [title]);

  return (
    <div className="legal-page">
      <nav className="breadcrumb container" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{title}</span>
      </nav>
      <article className="legal-content container">
        <h1>{title}</h1>
        <p className="legal-updated">Last updated: April 24, 2026</p>
        {children}
      </article>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Privacy Policy
   ═══════════════════════════════════════════ */
export function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy">
      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to VidaSazón ("we," "our," or "us"). We are committed to protecting your privacy
          and ensuring the security of your personal information. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you visit our website.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <h3>2.1 Automatically Collected Information</h3>
        <p>When you visit our website, we may automatically collect certain information, including:</p>
        <ul>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>IP address (anonymized)</li>
          <li>Pages visited and time spent on each page</li>
          <li>Referring website address</li>
          <li>Device type (desktop, mobile, tablet)</li>
        </ul>

        <h3>2.2 Cookies and Tracking Technologies</h3>
        <p>
          We use cookies and similar tracking technologies to enhance your browsing experience and
          analyze website traffic. These may include:
        </p>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for the website to function properly.</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
          <li><strong>Advertising Cookies:</strong> Used by third-party advertising partners to serve relevant ads.</li>
        </ul>
        <p>
          You can control cookie preferences through your browser settings. Note that disabling cookies
          may affect some features of the website.
        </p>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        <ul>
          <li>To operate and maintain the website</li>
          <li>To improve user experience and website performance</li>
          <li>To analyze usage patterns and trends</li>
          <li>To serve relevant advertisements through third-party ad networks</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section>
        <h2>4. Third-Party Advertising</h2>
        <p>
          We may use third-party advertising companies (such as Google AdSense) to serve ads when you
          visit our website. These companies may use information about your visits to this and other
          websites to provide advertisements about goods and services of interest to you. These
          third-party ad servers use cookies and other technologies to measure the effectiveness of
          their ads and to personalize advertising content.
        </p>
        <p>
          For more information about Google's advertising practices, visit:{' '}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
            Google Advertising Policies
          </a>
        </p>
      </section>

      <section>
        <h2>5. Data Sharing</h2>
        <p>We do not sell your personal information. We may share anonymized, aggregated data with:</p>
        <ul>
          <li>Analytics providers (e.g., Google Analytics)</li>
          <li>Advertising networks (e.g., Google AdSense)</li>
          <li>Law enforcement agencies when required by law</li>
        </ul>
      </section>

      <section>
        <h2>6. Data Retention</h2>
        <p>
          We retain automatically collected data for a maximum of 26 months. Anonymized analytics data
          may be retained indefinitely for trend analysis purposes.
        </p>
      </section>

      <section>
        <h2>7. Your Rights</h2>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt out of personalized advertising</li>
          <li>Withdraw consent for data processing</li>
        </ul>
      </section>

      <section>
        <h2>8. Children's Privacy</h2>
        <p>
          Our website is not directed at children under 13 years of age. We do not knowingly collect
          personal information from children. If you believe a child has provided us with personal
          information, please contact us immediately.
        </p>
      </section>

      <section>
        <h2>9. Changes to This Policy</h2>
        <p>
          We reserve the right to update this Privacy Policy at any time. Changes will be posted on
          this page with an updated "Last Updated" date. Your continued use of the website after any
          changes constitutes acceptance of the revised policy.
        </p>
      </section>

      <section>
        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:{' '}
          <strong>privacy@vidasazon.com</strong>
        </p>
      </section>
    </LegalPage>
  );
}

/* ═══════════════════════════════════════════
   Terms & Conditions
   ═══════════════════════════════════════════ */
export function TermsAndConditions() {
  return (
    <LegalPage title="Terms & Conditions">
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using VidaSazón ("the Website"), you agree to be bound by these Terms &
          Conditions. If you do not agree with any part of these terms, you must not use the Website.
        </p>
      </section>

      <section>
        <h2>2. Description of Service</h2>
        <p>
          VidaSazón is a recipe platform that provides diabetic-friendly recipes for informational
          and educational purposes. The Website features 718 nutritionist-approved recipes designed
          for people with type 2 diabetes.
        </p>
      </section>

      <section>
        <h2>3. Medical Disclaimer</h2>
        <div className="legal-warning">
          <p>
            <strong>⚠️ Important:</strong> The content on VidaSazón is for informational purposes only
            and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always
            seek the advice of your physician, registered dietitian, or other qualified healthcare
            provider with any questions you may have regarding a medical condition or dietary needs.
          </p>
          <p>
            Never disregard professional medical advice or delay seeking treatment because of
            something you have read on this Website. If you have or suspect you have a medical
            problem, promptly contact your healthcare provider.
          </p>
        </div>
      </section>

      <section>
        <h2>4. Recipe Data Attribution</h2>
        <p>
          The recipe data featured on VidaSazón is sourced from the{' '}
          <strong>DUT Diabetic Friendly Recipes dataset</strong>, created by:
        </p>
        <blockquote>
          Prof. Ashika Naicker, Mr. Shaylin Chetty, Ms. Riashnie Thaver, Ms. Anjellah Reddy,
          Dr. Evonne Shanita Singh, Dr. Imana Pal, Dr. Lisebo Mothepu — Durban University of
          Technology, Faculty of Applied Sciences, Department of Food and Nutrition, Durban,
          South Africa.
        </blockquote>
        <p>
          The dataset is licensed under the{' '}
          <a href="https://opensource.org/licenses/AFL-3.0" target="_blank" rel="noopener noreferrer">
            Academic Free License v3.0 (AFL-3.0)
          </a>
          , which permits commercial use with attribution.
        </p>
      </section>

      <section>
        <h2>5. Intellectual Property</h2>
        <p>
          The VidaSazón brand, logo, design, and original content (excluding recipe data attributed
          above) are the property of VidaSazón. You may not reproduce, distribute, or create
          derivative works from our original content without prior written consent.
        </p>
        <p>
          Recipe data is used under the AFL-3.0 license and remains the intellectual property of
          the original authors at Durban University of Technology.
        </p>
      </section>

      <section>
        <h2>6. User Conduct</h2>
        <p>When using the Website, you agree not to:</p>
        <ul>
          <li>Use the Website for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with the proper functioning of the Website</li>
          <li>Scrape or harvest data from the Website using automated tools without permission</li>
          <li>Misrepresent your identity or affiliation</li>
        </ul>
      </section>

      <section>
        <h2>7. Advertising</h2>
        <p>
          The Website may display third-party advertisements. We are not responsible for the
          content, accuracy, or practices of third-party advertisers. Clicking on advertisements
          may redirect you to external websites governed by their own terms and privacy policies.
        </p>
      </section>

      <section>
        <h2>8. Limitation of Liability</h2>
        <p>
          VidaSazón and its contributors shall not be liable for any direct, indirect, incidental,
          special, or consequential damages arising from your use of the Website or reliance on any
          recipe, nutritional information, or content provided herein.
        </p>
        <p>
          Recipes are provided "as is" without warranty of any kind. Individual results may vary
          based on portion sizes, ingredient substitutions, and individual health conditions.
        </p>
      </section>

      <section>
        <h2>9. External Links</h2>
        <p>
          The Website may contain links to third-party websites. We are not responsible for the
          content or privacy practices of these external sites. Accessing linked websites is at
          your own risk.
        </p>
      </section>

      <section>
        <h2>10. Modifications</h2>
        <p>
          We reserve the right to modify these Terms & Conditions at any time. Changes will be
          effective immediately upon posting. Your continued use of the Website constitutes
          acceptance of the revised terms.
        </p>
      </section>

      <section>
        <h2>11. Governing Law</h2>
        <p>
          These Terms & Conditions shall be governed by and construed in accordance with applicable
          laws. Any disputes arising from these terms shall be resolved through appropriate legal
          channels.
        </p>
      </section>

      <section>
        <h2>12. Contact</h2>
        <p>
          For questions about these Terms & Conditions, contact us at:{' '}
          <strong>legal@vidasazon.com</strong>
        </p>
      </section>
    </LegalPage>
  );
}

/* ═══════════════════════════════════════════
   About Page
   ═══════════════════════════════════════════ */
export function AboutPage() {
  return (
    <LegalPage title="About VidaSazón">
      <section>
        <h2>1. Our Mission</h2>
        <p>
          VidaSazón — "Life with Flavor" — is a recipe platform dedicated to proving that
          managing type 2 diabetes does not mean sacrificing taste. We believe everyone
          deserves to enjoy delicious, nutritious meals without compromise.
        </p>
        <p>
          With 718 nutritionist-approved recipes, our platform brings together the science
          of blood sugar management with the joy of cooking, empowering people with
          type 2 diabetes to take control of their health through food.
        </p>
      </section>

      <section>
        <h2>2. Recipe Dataset &amp; Attribution</h2>
        <p>
          All recipes featured on VidaSazón are sourced from the{' '}
          <strong>DUT Diabetic Friendly Recipes dataset</strong>, developed by researchers
          at Durban University of Technology, South Africa.
        </p>
        <p>
          Each recipe is designed around <strong>low glycemic index (GI) ingredients</strong>,
          balanced macronutrients, and blood sugar-friendly cooking principles.
        </p>
        <p>
          The dataset was created by:{' '}
          <strong>Prof. Ashika Naicker</strong>, <strong>Mr. Shaylin Chetty</strong>,{' '}
          <strong>Ms. Riashnie Thaver</strong>, <strong>Ms. Anjellah Reddy</strong>,{' '}
          <strong>Dr. Evonne Shanita Singh</strong>, <strong>Dr. Imana Pal</strong>,{' '}
          <strong>Dr. Lisebo Mothepu</strong> — Durban University of Technology, Faculty of
          Applied Sciences, Department of Food and Nutrition, Durban, South Africa.
        </p>
        <p>
          The dataset is licensed under{' '}
          <a href="https://opensource.org/licenses/AFL-3.0" target="_blank" rel="noopener noreferrer">
            Academic Free License v3.0 (AFL-3.0)
          </a>
          {' '}and available on{' '}
          <a href="https://huggingface.co/datasets/Ashikan/diabetic-friendly-recipes" target="_blank" rel="noopener noreferrer">
            Hugging Face
          </a>.
        </p>
      </section>

      <section>
        <h2>3. Recipe Categories</h2>
        <p>
          Browse 718 recipes across 9 categories, all designed for people managing
          type 2 diabetes:
        </p>
        <ul>
          <li><strong>Main Dishes</strong> — Complete meals, entrees, and protein-rich dishes</li>
          <li><strong>Desserts</strong> — Diabetic-friendly sweets using low GI sweeteners</li>
          <li><strong>Breakfast</strong> — Morning meals optimized for blood sugar management</li>
          <li><strong>Soups & Stews</strong> — Warm, comforting liquid-based dishes</li>
          <li><strong>Salads</strong> — Fresh vegetable-based dishes with light dressings</li>
          <li><strong>Sides</strong> — Accompaniments to complement your meals</li>
          <li><strong>Snacks & Breads</strong> — Quick bites and baked goods</li>
          <li><strong>Beverages</strong> — Healthy drinks and smoothies</li>
          <li><strong>Sauces & Dressings</strong> — Flavor enhancers for every dish</li>
        </ul>
      </section>

      <section>
        <h2>4. Medical Disclaimer</h2>
        <div className="legal-warning">
          <p>
            <strong>⚠️ Important:</strong> VidaSazón recipes are for informational and
            educational purposes only. They are NOT a substitute for professional
            medical advice, diagnosis, or treatment.
          </p>
          <p>
            Always consult your physician, registered dietitian, or qualified healthcare
            provider before making dietary changes, especially if you have diabetes or
            other medical conditions. Individual nutritional needs vary. Do not disregard
            professional medical advice.
          </p>
        </div>
      </section>

      <section>
        <h2>5. Contact</h2>
        <p>
          Have a question or want to share feedback?{' '}
          <Link to="/contact">Get in touch</Link>
        </p>
      </section>
    </LegalPage>
  );
}
