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

export default function SoupGuide() {
  return (
    <div className="App">
      <SiteHeader />
      <main className="container guide-page" style={{ paddingBottom: '10rem' }}>

        <motion.section
          className="guide-hero-editorial"
          initial="hidden"
          animate="visible"
          variants={stagger}
          style={{
            padding: '8rem 0 6rem',
            textAlign: 'center'
          }}
        >
          <motion.div variants={reveal}>
            <span className="label-upper section-label" style={{ marginBottom: '2rem', justifyContent: 'center' }}>Nutritional Deep-Dive</span>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              lineHeight: 0.9,
              marginBottom: '2.5rem',
              letterSpacing: '-0.03em'
            }}>
              The Ultimate <span>Diabetic</span> <br />Soup Guide
            </h1>
            <p className="hero-subtitle" style={{ maxWidth: '600px', margin: '0 auto 4rem', fontSize: '1.2rem', opacity: 0.7 }}>
              Why soups are the secret weapon for blood sugar management, and how to cook them without the carb spikes.
            </p>
          </motion.div>
        </motion.section>

        <section className="guide-content-body" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Why Soup for Diabetes?</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem', opacity: 0.9 }}>
              Soups are inherently satiating. The combination of liquid and high-fiber solids slows down gastric emptying, which means glucose is released into your bloodstream more gradually. However, not all soups are created equal.
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '3rem', 
            margin: '4rem 0',
            padding: '3rem',
            background: 'var(--canvas-warm)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div>
              <h4 className="label-upper" style={{ color: 'var(--spice)', marginBottom: '1.5rem' }}>The Good: Clear & Legume-Based</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '1rem' }}>✅ <span><strong>Lentil & Bean:</strong> High fiber and protein.</span></li>
                <li style={{ display: 'flex', gap: '1rem' }}>✅ <span><strong>Vegetable Broths:</strong> Low calorie, high volume.</span></li>
                <li style={{ display: 'flex', gap: '1rem' }}>✅ <span><strong>Tomato-Based:</strong> Rich in lycopene.</span></li>
              </ul>
            </div>
            <div>
              <h4 className="label-upper" style={{ color: 'var(--ink)', marginBottom: '1.5rem' }}>The Bad: Thickened & Starchy</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '1rem' }}>❌ <span><strong>Corn Starch:</strong> High GI thickener.</span></li>
                <li style={{ display: 'flex', gap: '1rem' }}>❌ <span><strong>Cream Soups:</strong> High in saturated fats.</span></li>
                <li style={{ display: 'flex', gap: '1rem' }}>❌ <span><strong>White Pasta:</strong> Empty refined carbs.</span></li>
              </ul>
            </div>
          </div>

          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>3 Rules for a Perfect Diabetic Soup</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '1rem' }}>1. The Protein Anchor</h3>
                <p>Every soup needs a protein source—chicken, lean beef, tofu, or lentils—to prevent the meal from being purely carbohydrate-focused.</p>
              </div>
              <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '1rem' }}>2. Fiber Saturation</h3>
                <p>Add "volume" with low-GI vegetables like spinach, zucchini, and celery. They provide nutrients and fiber without adding significant calories or sugar.</p>
              </div>
              <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '1rem' }}>3. Salt Awareness</h3>
                <p>Many diabetics also manage blood pressure. Use fresh herbs (garlic, ginger, coriander) instead of salt-heavy bouillon cubes.</p>
              </div>
            </div>
          </motion.div>

          <section style={{ marginTop: '6rem', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '2rem' }}>Ready to Cook?</h2>
            <Link to="/category/soups-stews" className="cta-button" style={{ background: 'var(--spice)', padding: '1.5rem 3rem' }}>
              View Our 20+ Soup Recipes
            </Link>
          </section>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}
