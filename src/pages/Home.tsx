import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import PopularLocations from '../components/locations/PopularLocations';
import AutoGallery from '../components/gallery/AutoGallery';
import PropertyCard from '../components/dashboard/PropertyCard';
import PageTransition from '../components/common/PageTransition';
import { fetchTestimonials, fetchFaqs, TestimonialRecord, FaqRecord } from '../services/content.service';
import { integrationService } from '../services/integration.service';
import { PropertyRecord } from '../services/property.service';

const metrics = [
  { value: '20+', label: 'Cities', detail: 'National presence with hyperlocal teams' },
  { value: '120+', label: 'Properties', detail: 'Curated co-living homes & studios' },
  { value: '4.8', label: 'Avg. Rating', detail: 'Residents love the GoFlex experience' },
  { value: '5k+', label: 'Residents', detail: 'Professionals thriving in our communities' }
];

const featureShowcase = [
  {
    title: 'Designer Rooms',
    description: 'Fully furnished suites with natural light, ergonomic furniture, and premium finishes.',
    image: 'https://images.pexels.com/photos/6585756/pexels-photo-6585756.jpeg',
    alt: 'Designer bedroom'
  },
  {
    title: 'All-Inclusive Living',
    description: 'Wi-Fi, utilities, laundry, and housekeeping bundled transparently in a single invoice.',
    image: 'https://images.pexels.com/photos/6489127/pexels-photo-6489127.jpeg',
    alt: 'Shared kitchen'
  },
  {
    title: 'Community Programming',
    description: 'Weekly mixers, workshops, and wellness sessions curated by our community managers.',
    image: 'https://images.pexels.com/photos/7651627/pexels-photo-7651627.jpeg',
    alt: 'Coworking lounge'
  }
];

const conciergeHighlights = [
  {
    title: 'Move-in Concierge',
    detail: 'Personalised onboarding with digital KYC, luggage support, and curated welcome kits.'
  },
  {
    title: 'Smart Facility Ops',
    detail: 'IoT-enabled utilities tracking, predictive maintenance, and instant service tickets.'
  },
  {
    title: 'Resident Success',
    detail: 'Dedicated community managers, city guides, and resident-only events each week.'
  }
];

function withParams(src: string, w: number) {
  const join = src.includes('?') ? '&' : '?';
  return `${src}${join}auto=compress&cs=tinysrgb&w=${w}&dpr=1`;
}

export default function Home() {
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [faqList, setFaqList] = useState<FaqRecord[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    fetchTestimonials(4)
      .then((items) => {
        if (!ignore) {
          setTestimonials(items);
        }
      })
      .catch((error) => {
        console.error('Failed to load testimonials', error);
      });

    fetchFaqs()
      .then((items) => {
        if (!ignore) {
          setFaqList(items);
        }
      })
      .catch((error) => {
        console.error('Failed to load faqs', error);
      });

    // Fetch AI Recommendations
    setRecLoading(true);
    integrationService.getRecommendations()
      .then(data => {
        if (!ignore) setRecommendations(data.recommendations);
      })
      .catch(err => console.error('Failed to load recommendations', err))
      .finally(() => {
        if (!ignore) setRecLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <PageTransition>
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-layout">
            <article className="hero-intro">
              <span className="section-eyebrow">Next-gen co-living</span>
              <h1 className="hero-title">Premium Co-Living Suites for High-Performance Residents</h1>
              <p className="hero-lede">Purpose-built residences that blend elevated interiors, tech-enabled amenities, and a concierge-grade community experience.</p>
              <div className="hero-actions">
                <a className="btn-cta" href="#contact">Book a discovery call</a>
                <NavLink to="/properties" className="btn-ghost">Browse residences</NavLink>
              </div>
              <ul className="hero-points" aria-label="GoFlex assurances">
                <li>✓ Instant digital onboarding</li>
                <li>★ Curated amenities for remote work</li>
                <li>🛡️ Verified partners & secure entrances</li>
              </ul>
              <div className="hero-metrics" aria-label="Key performance indicators">
                {metrics.map((metric) => (
                  <div key={metric.label} className="metric-card">
                    <span className="metric-value">{metric.value}</span>
                    <span className="metric-label">{metric.label}</span>
                    <p className="metric-detail">{metric.detail}</p>
                  </div>
                ))}
              </div>
            </article>
            <aside className="hero-preview">
              <figure className="hero-preview-card">
                <img
                  className="hero-preview-img"
                  loading="lazy"
                  decoding="async"
                  src={withParams('https://images.pexels.com/photos/4874580/pexels-photo-4874580.jpeg', 1920)}
                  srcSet={[
                    `${withParams('https://images.pexels.com/photos/4874580/pexels-photo-4874580.jpeg',1280)} 1280w`,
                    `${withParams('https://images.pexels.com/photos/4874580/pexels-photo-4874580.jpeg',1920)} 1920w`,
                    `${withParams('https://images.pexels.com/photos/4874580/pexels-photo-4874580.jpeg',2560)} 2560w`,
                  ].join(', ')}
                  sizes="(max-width: 640px) 90vw, (max-width: 1100px) 50vw, 520px"
                  alt="Premium co-living exterior"
                />
                <figcaption className="hero-preview-meta">
                  Sky Deck Residency • Bengaluru
                  <span>92% occupancy · Concierge team on-site</span>
                </figcaption>
              </figure>
              <div className="hero-highlight-card">
                <span className="hero-highlight-label">What&apos;s new</span>
                <h3>Executive suites launching in Mumbai</h3>
                <p>Experience larger private studios, personal pantries, and skyline social lounges at Riverview House.</p>
                <NavLink to="/gallery" className="hero-highlight-link">Preview concept gallery →</NavLink>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="content-wrap" aria-labelledby="why">
        <div className="section-header">
          <span id="why" className="section-eyebrow">Signature experience</span>
          <h2 className="section-title">Built for comfort, community, and productivity</h2>
          <p className="section-subtitle">Each GoFlex residence blends thoughtful design with hospitality standards to deliver a matte, refined living canvas that keeps residents inspired.</p>
        </div>
        <div className="feature-showcase">
          {featureShowcase.map((feature) => (
            <article key={feature.title} className="feature-card">
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <img
                className="feature-media"
                loading="lazy"
                decoding="async"
                src={withParams(feature.image, 1280)}
                srcSet={[
                  `${withParams(feature.image,1280)} 1280w`,
                  `${withParams(feature.image,1920)} 1920w`,
                  `${withParams(feature.image,2560)} 2560w`,
                  `${withParams(feature.image,3840)} 3840w`,
                ].join(', ')}
                sizes="(max-width: 640px) 100vw, 360px"
                alt={feature.alt}
              />
            </article>
          ))}
        </div>
        <div className="service-grid">
          {conciergeHighlights.map((item) => (
            <article key={item.title} className="service-card">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-wrap" aria-labelledby="locs">
        <div className="section-header">
          <span id="locs" className="section-eyebrow">Citywide network</span>
          <h2 className="section-title">Explore neighbourhoods that match your rhythm</h2>
          <p className="section-subtitle">Filter by metro, amenities, or occupancy levels to discover residences that fit your lifestyle.</p>
        </div>
        <PopularLocations />
      </section>

      {recommendations.length > 0 && (
        <section className="content-wrap bg-glass py-12" aria-labelledby="recs">
          <div className="section-header">
            <span id="recs" className="section-eyebrow">Personalized AI Picks</span>
            <h2 className="section-title">Recommended for You</h2>
            <p className="section-subtitle">Based on your preferences and browsing history, we think you'll love these residences.</p>
          </div>
          <div className="cards-grid">
            {recommendations.map((rec: any) => (
              <div key={rec.property_id} className="relative">
                <div className="absolute top-4 left-4 z-10 bg-primary text-white text-xs px-2 py-1 rounded">
                  {rec.score * 100}% Match
                </div>
                {/* For demo, we use placeholder data since we don't have full property records here */}
                <PropertyCard property={{
                  id: rec.property_id,
                  name: `Residency ${rec.property_id}`,
                  city: 'Bengaluru',
                  state_iso: 'KA',
                  beds: 'Double',
                  rent: 15000,
                  occupancy: 85,
                  cover_image_url: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg'
                }} />
                <p className="mt-2 text-xs text-secondary italic">"{rec.reason}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="content-wrap" aria-labelledby="gallery">
        <div className="section-header">
          <span id="gallery" className="section-eyebrow">Spaces in motion</span>
          <h2 className="section-title">Take a cinematic walk-through</h2>
          <p className="section-subtitle">From rooftop lounges to dedicated focus rooms, every GoFlex property is staged for productivity and downtime.</p>
        </div>
        <AutoGallery />
      </section>

      <section className="content-wrap" aria-labelledby="testimonials">
        <div className="section-header">
          <span id="testimonials" className="section-eyebrow">Resident stories</span>
          <h2 className="section-title">Communities that feel like home</h2>
          <p className="section-subtitle">Real feedback from residents who balance careers, wellness, and community inside GoFlex spaces.</p>
        </div>
        <div className="testimonials-grid" aria-live="polite">
          {testimonials.map((item) => (
            <figure key={item.id} className="testimonial-card">
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                {item.avatar_url ? (
                  <img className="avatar" src={withParams(item.avatar_url, 256)} alt={item.resident_name} />
                ) : null}
                <div>
                  <strong>{item.resident_name}</strong>
                  {item.city ? <span> · {item.city}</span> : null}
                </div>
              </figcaption>
            </figure>
          ))}
          {testimonials.length === 0 && (
            <p className="empty-state">No stories to display yet. Check back soon.</p>
          )}
        </div>
      </section>

      <section className="content-wrap" aria-labelledby="faq">
        <div className="section-header">
          <span id="faq" className="section-eyebrow">Know before you move</span>
          <h2 className="section-title">Frequently asked questions</h2>
          <p className="section-subtitle">Transparent policies and concierge support help you move in with confidence.</p>
        </div>
        <div className="faq-panel" aria-live="polite">
          {faqList.map((faq) => (
            <details key={faq.id} className="faq-item">
              <summary className="faq-q">{faq.question}</summary>
              <p className="faq-a">{faq.answer}</p>
            </details>
          ))}
          {faqList.length === 0 && (
            <p className="empty-state">We are preparing the most common questions. Please reach out if you need personal assistance.</p>
          )}
        </div>
      </section>

      <section id="contact" className="cta-strip">
        <div className="cta-strip-inner">
          <div>
            <h3 className="cta-strip-title">Ready to design your stay?</h3>
            <p className="cta-strip-sub">Connect with our concierge team for property walkthroughs, availability, and corporate tie-ups.</p>
          </div>
          <a className="btn-cta" href="mailto:sales@example.com">Talk to us</a>
        </div>
      </section>
    </PageTransition>
  );
}
