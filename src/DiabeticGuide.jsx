import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SiteHeader, SiteFooter } from './App.jsx';

const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } }
};

export default function DiabeticGuide() {
  return (
    <div className="App">
      <SiteHeader />
      <main className="container guide-page" style={{ paddingBottom: '10rem' }}>

        {/* ── Editorial Hero ── */}
        <motion.section
          className="guide-hero-editorial"
          initial="hidden"
          animate="visible"
          variants={stagger}
          style={{
            padding: '8rem 0 6rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <motion.div variants={reveal} style={{ position: 'relative', zIndex: 2 }}>
            <span className="label-upper section-label" style={{ marginBottom: '2rem' }}>Medical & Nutrition Insight</span>
            <h1 style={{
              fontSize: 'clamp(3rem, 10vw, 6.5rem)',
              lineHeight: 0.9,
              marginBottom: '2.5rem',
              letterSpacing: '-0.03em'
            }}>
              The <span>Modern</span> <br />Diabetic Protocol
            </h1>
            <p className="hero-subtitle" style={{ maxWidth: '540px', margin: '0 auto 4rem', fontSize: '1.2rem', opacity: 0.7 }}>
              Scientific eating reimagined. Discover the culinary bridge between clinical nutrition and the joy of Latin flavor.
            </p>
          </motion.div>

          {/* Decorative grain/background element */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(196, 83, 58, 0.04) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 1
          }} />
        </motion.section>

        {/* ── Asymmetric Principles Grid ── */}
        <section className="principles-magazine-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '2rem',
          marginBottom: '12rem',
          alignItems: 'center'
        }}>
          <motion.div
            className="principle-content"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ gridColumn: '1 / span 5', zIndex: 5 }}
          >
            <h2 style={{ fontSize: '3rem', marginBottom: '2rem', fontFamily: 'Playfair Display' }}>01. The Low GI <br />Manifesto</h2>
            <div style={{ padding: '3rem', background: 'var(--canvas-warm)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-dramatic)' }}>
              <p style={{ lineHeight: 1.8, marginBottom: '2rem', color: 'var(--text-main)' }}>
                Glycemic Index isn&apos;t just a number—it&apos;s a roadmap to energy stability. By prioritizing foods that release glucose slowly, we eliminate the inflammatory spikes that challenge diabetic management.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ borderLeft: '3px solid var(--spice)', paddingLeft: '1.5rem' }}>
                  <h4 className="label-upper" style={{ fontSize: '0.7rem', color: 'var(--spice)' }}>Fiber Saturation</h4>
                  <p style={{ fontSize: '0.9rem' }}>Slowing absorption through structural plant fiber.</p>
                </div>
                <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1.5rem' }}>
                  <h4 className="label-upper" style={{ fontSize: '0.7rem', color: 'var(--gold)' }}>Lean Satiety</h4>
                  <p style={{ fontSize: '0.9rem' }}>Proteins that protect muscle mass without cholesterol impact.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="principle-image-wrapper"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              gridColumn: '6 / span 7',
              position: 'relative',
              height: '700px'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1600"
              alt="High-contrast vegetable composition"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 'var(--radius-md)',
                filter: 'grayscale(0.2) contrast(1.1)'
              }}
            />
            {/* Floating Badge */}
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              background: 'var(--ink)',
              color: 'var(--canvas)',
              padding: '2.5rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-dramatic)',
              maxWidth: '240px'
            }}>
              <span className="label-upper" style={{ color: 'var(--gold)', display: 'block', marginBottom: '0.5rem' }}>Stat-Check</span>
              <p style={{ fontSize: '1.4rem', fontFamily: 'Playfair Display', fontStyle: 'italic', marginBottom: '0' }}>
                &quot;Nutrition is the most powerful tool in your medical arsenal.&quot;
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── The Knowledge Hub (Responsive Cards) ── */}
        <section className="guide-hub">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span className="label-upper section-label" style={{ justifyContent: 'center' }}>Knowledge Vertical</span>
            <h2 style={{ fontSize: '3.5rem' }}>Culinary Strategy</h2>
          </div>

          <div className="guide-grid-layout" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem'
          }}>
            <motion.div variants={reveal} className="hub-card-modern">
              <div style={{
                height: '240px',
                background: 'var(--ink-deep)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600" alt="Salad detail" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <h3 style={{ color: 'white', fontSize: '2rem', textAlign: 'center' }}>Salad <br />Dynamics</h3>
                </div>
              </div>
              <p style={{ marginBottom: '2rem', opacity: 0.8, lineHeight: 1.6 }}>
                Revolutionizing leafy greens through healthy emulsions. Ditch sugary dressings for cold-pressed oils and high-acidity vinegars that blunt glucose response.
              </p>
              <Link to="/category/salads" className="cta-button" style={{ width: '100%', justifyContent: 'center' }}>The Salad Index</Link>
            </motion.div>

            <motion.div variants={reveal} className="hub-card-modern">
              <div style={{
                height: '240px',
                background: 'var(--spice)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=600" alt="Soup detail" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <h3 style={{ color: 'white', fontSize: '2rem', textAlign: 'center' }}>Symptomatic <br />Soups</h3>
                </div>
              </div>
              <p style={{ marginBottom: '2rem', opacity: 0.8, lineHeight: 1.6 }}>
                Liquid nutrition for insulin resistance. High-fiber legumes and mineral-rich broths provide comfort without the carbohydrate load of traditional stews.
              </p>
              <Link to="/category/soups-stews" className="cta-button" style={{ width: '100%', justifyContent: 'center' }}>The Soup Library</Link>
            </motion.div>

            <motion.div variants={reveal} className="hub-card-modern">
              <div style={{
                height: '240px',
                background: 'var(--gold)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600" alt="Side dish detail" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <h3 style={{ color: 'white', fontSize: '2rem', textAlign: 'center' }}>Strategic <br />Sides</h3>
                </div>
              </div>
              <p style={{ marginBottom: '2rem', opacity: 0.8, lineHeight: 1.6 }}>
                Engineering the plate. Swapping starchy grains for roasted brassicas and complex pulses to balance your macronutrient profile at every meal.
              </p>
              <Link to="/category/sides" className="cta-button" style={{ width: '100%', justifyContent: 'center' }}>The Side Archive</Link>
            </motion.div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section style={{ marginTop: '10rem', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              background: 'var(--canvas-warm)',
              padding: '6rem 2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(26, 47, 35, 0.08)'
            }}
          >
            <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Flavor is the <span>Best</span> Medicine</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 3.5rem', opacity: 0.7 }}>
              Ready to explore 718 recipes reviewed by the Durban University of Technology? Your health journey starts in the kitchen.
            </p>
            <Link to="/" className="cta-button" style={{ background: 'var(--spice)', fontSize: '1rem', padding: '1.4rem 4rem' }}>
              Explore the Full Cookbook
            </Link>
          </motion.div>
        </section>

      </main>
      <SiteFooter />
      {/* Responsive Styles Injection */}
      <style>{`
        @media (max-width: 1024px) {
          .principles-magazine-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 4rem !important;
          }
          .principle-content { width: 100% !important; }
          .principle-image-wrapper { height: 450px !important; width: 100% !important; }
          .guide-hero-editorial h1 { font-size: 4rem !important; }
        }
        @media (max-width: 768px) {
          .guide-page { padding-bottom: 5rem !important; }
          .guide-hero-editorial { padding: 4rem 0 !important; }
          .guide-hero-editorial h1 { font-size: 3rem !important; }
        }
      `}</style>
    </div>
  );
}
