import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Main Dishes', 'Desserts', 'Beverages', 'Soups & Stews',
  'Salads', 'Breakfast', 'Sides', 'Snacks & Breads', 'Sauces & Dressings'
];

function PageLayout({ title, children }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="legal-page">
      <nav className="breadcrumb container" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{title}</span>
      </nav>
      <article className="legal-content container">
        <h1>{title}</h1>
        {children}
      </article>
    </div>
  );
}

function TabButton({ active, onClick, children, id, controls }) {
  return (
    <button
      id={id}
      role="tab"
      aria-selected={active}
      aria-controls={controls}
      className={`tab-btn ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const errs = {};
    if (!data.get('name')?.trim()) errs.name = 'Name is required';
    if (!data.get('email')?.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get('email'))) errs.email = 'Enter a valid email';
    if (!data.get('message')?.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('submitting');
    try {
      const res = await fetch(form.action, { method: 'POST', body: data });
      if (res.ok) {
        setSubmitted(true);
        setStatus('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (submitted) {
    return (
      <motion.div className="form-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="success-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <circle cx="24" cy="24" r="22" stroke="var(--sage)" strokeWidth="2" />
            <path d="M14 24l7 7 13-14" stroke="var(--sage)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3>Message sent!</h3>
        <p>Thank you for reaching out. We typically respond within 1–2 business days.</p>
        <button className="cta-button" onClick={() => { setSubmitted(false); setErrors({}); }}>Send another message</button>
      </motion.div>
    );
  }

  return (
    <form
      action="https://formsubmit.co/your@email.com"
      method="POST"
      onSubmit={handleSubmit}
      noValidate
      className="contact-form"
    >
      <input type="hidden" name="_subject" value="New message from VidaSazón" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      <div className="form-group">
        <label htmlFor="contact-name">Your name <span className="required">*</span></label>
        <input
          type="text"
          id="contact-name"
          name="name"
          placeholder="e.g., Maria García"
          autoComplete="name"
          aria-required="true"
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="field-error" role="alert">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="contact-email">Email address <span className="required">*</span></label>
        <input
          type="email"
          id="contact-email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-required="true"
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="field-error" role="alert">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="contact-subject">Subject</label>
        <select id="contact-subject" name="subject">
          <option value="general">General inquiry</option>
          <option value="recipe">Recipe feedback</option>
          <option value="suggestion">Recipe suggestion</option>
          <option value="bug">Report a bug</option>
          <option value="partnership">Partnership</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="contact-message">Message <span className="required">*</span></label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          placeholder="Tell us what's on your mind..."
          aria-required="true"
          className={errors.message ? 'error' : ''}
        />
        {errors.message && <span className="field-error" role="alert">{errors.message}</span>}
      </div>

      {status === 'error' && (
        <div className="form-error-banner" role="alert">
          Something went wrong. Please try again or email us directly.
        </div>
      )}

      <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

function RecipeForm() {
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState({ ingredients: 0, steps: 0 });

  const validate = (data) => {
    const errs = {};
    if (!data.get('recipe_name')?.trim()) errs.recipe_name = 'Recipe name is required';
    if (!data.get('category')) errs.category = 'Please select a category';
    if (!data.get('ingredients')?.trim()) errs.ingredients = 'Ingredients are required';
    if (!data.get('steps')?.trim()) errs.steps = 'Directions are required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('submitting');
    try {
      const res = await fetch(form.action, { method: 'POST', body: data });
      if (res.ok) {
        setSubmitted(true);
        setStatus('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleIngredientChange = (e) => setCharCount(c => ({ ...c, ingredients: e.target.value.length }));
  const handleStepsChange = (e) => setCharCount(c => ({ ...c, steps: e.target.value.length }));

  if (submitted) {
    return (
      <motion.div className="form-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="success-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <circle cx="24" cy="24" r="22" stroke="var(--sage)" strokeWidth="2" />
            <path d="M14 24l7 7 13-14" stroke="var(--sage)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3>Recipe submitted!</h3>
        <p>Thank you for sharing your recipe with VidaSazón. Our nutrition team will review it and may feature it in our collection.</p>
        <button className="cta-button" onClick={() => { setSubmitted(false); setErrors({}); setCharCount({ ingredients: 0, steps: 0 }); }}>Submit another recipe</button>
      </motion.div>
    );
  }

  return (
    <form
      action="https://formsubmit.co/your@email.com"
      method="POST"
      onSubmit={handleSubmit}
      noValidate
      className="contact-form recipe-form"
    >
      <input type="hidden" name="_subject" value="New recipe submission from VidaSazón" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
      <input type="hidden" name="submission_type" value="recipe" />

      <div className="form-group">
        <label htmlFor="recipe-name">Recipe name <span className="required">*</span></label>
        <input
          type="text"
          id="recipe-name"
          name="recipe_name"
          placeholder="e.g., Mediterranean Chickpea Salad"
          aria-required="true"
          className={errors.recipe_name ? 'error' : ''}
        />
        {errors.recipe_name && <span className="field-error" role="alert">{errors.recipe_name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="recipe-category">Category <span className="required">*</span></label>
        <select id="recipe-category" name="category" aria-required="true" className={errors.category ? 'error' : ''}>
          <option value="">Select a category...</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <span className="field-error" role="alert">{errors.category}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="recipe-ingredients">
          Ingredients <span className="required">*</span>
          <span className="field-hint">One ingredient per line</span>
        </label>
        <textarea
          id="recipe-ingredients"
          name="ingredients"
          rows={8}
          placeholder={`500g chicken breast\n2 cloves garlic\n1 tablespoon olive oil\n...\n`}
          aria-required="true"
          onChange={handleIngredientChange}
          className={errors.ingredients ? 'error' : ''}
        />
        <span className="char-count" aria-live="polite">{charCount.ingredients} characters</span>
        {errors.ingredients && <span className="field-error" role="alert">{errors.ingredients}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="recipe-steps">
          Directions <span className="required">*</span>
          <span className="field-hint">One step per line</span>
        </label>
        <textarea
          id="recipe-steps"
          name="steps"
          rows={8}
          placeholder={`Preheat oven to 180°C.\nSeason the chicken with salt and pepper.\n...\n`}
          aria-required="true"
          onChange={handleStepsChange}
          className={errors.steps ? 'error' : ''}
        />
        <span className="char-count" aria-live="polite">{charCount.steps} characters</span>
        {errors.steps && <span className="field-error" role="alert">{errors.steps}</span>}
      </div>

      <div className="form-divider">
        <span>Optional — Get credited!</span>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="recipe-author">Your name</label>
          <input
            type="text"
            id="recipe-author"
            name="author_name"
            placeholder="Your name or alias"
            autoComplete="name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="recipe-email">Your email</label>
          <input
            type="email"
            id="recipe-email"
            name="author_email"
            placeholder="For credit attribution"
            autoComplete="email"
          />
        </div>
      </div>

      {status === 'error' && (
        <div className="form-error-banner" role="alert">
          Something went wrong. Please try again or email your recipe directly.
        </div>
      )}

      <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting...' : 'Submit Recipe'}
      </button>
    </form>
  );
}

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <div className="contact-page">
      <PageLayout title="Get in Touch">
        <div className="contact-layout">
          {/* Left: Info */}
          <div className="contact-info">
            <div className="contact-hero-text">
              <p className="contact-lead">
                Have a recipe to share, a question about diabetic-friendly cooking, or just want to say hello? We'd love to hear from you.
              </p>
            </div>

            <div className="contact-details">
              <div className="contact-detail-item">
                <div className="detail-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 4h14a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M2 5l8 7 8-7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <strong>Email us</strong>
                  <p>Use the form to send a message or submit your recipe. We respond within 1–2 business days.</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="detail-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <strong>Response time</strong>
                  <p>We aim to respond within 1–2 business days. Recipe submissions are reviewed by our nutrition team.</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="detail-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 4h12v12H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M7 8h6M7 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <strong>Recipe submissions</strong>
                  <p>Share your diabetic-friendly recipes with our community. All submissions are reviewed by registered dietitians at Durban University of Technology before being considered for the collection.</p>
                </div>
              </div>
            </div>

            <div className="contact-attribution">
              <p className="footer-attribution" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Recipe data on VidaSazón is sourced from the{' '}
                <a href="https://huggingface.co/datasets/Ashikan/diabetic-friendly-recipes" target="_blank" rel="noopener noreferrer">DUT Diabetic Friendly Recipes</a>{' '}
                dataset by Prof. Ashika Naicker et al., Durban University of Technology.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="contact-form-section">
            {/* Tabs */}
            <div className="form-tabs" role="tablist" aria-label="Contact form options">
              <TabButton
                id="tab-contact"
                controls="panel-contact"
                active={activeTab === 'contact'}
                onClick={() => setActiveTab('contact')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ marginRight: 6, verticalAlign: 'middle' }}>
                  <path d="M2 3h12a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M1 3l7 5 7-5" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
                Contact Us
              </TabButton>
              <TabButton
                id="tab-recipe"
                controls="panel-recipe"
                active={activeTab === 'recipe'}
                onClick={() => setActiveTab('recipe')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ marginRight: 6, verticalAlign: 'middle' }}>
                  <path d="M8 2c-3.31 0-6 2.69-6 6 0 4 6 8 6 8s6-4 6-8c0-3.31-2.69-6-6-6z" stroke="currentColor" strokeWidth="1.3"/>
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
                Submit a Recipe
              </TabButton>
            </div>

            {/* Tab Panels */}
            <div className="tab-panels">
              <AnimatePresence mode="wait">
                {activeTab === 'contact' && (
                  <div id="panel-contact" role="tabpanel" aria-labelledby="tab-contact">
                    <ContactForm />
                  </div>
                )}
                {activeTab === 'recipe' && (
                  <div id="panel-recipe" role="tabpanel" aria-labelledby="tab-recipe">
                    <div className="recipe-submit-intro">
                      <p>Share your diabetic-friendly recipe with our community. Fill in the details below — our nutrition team will review it and may feature it in the VidaSazón collection.</p>
                    </div>
                    <RecipeForm />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}