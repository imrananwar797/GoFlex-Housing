import React from 'react';
import { NavLink } from 'react-router-dom';

const teamMembers = [
  {
    name: 'Priya Sharma',
    role: 'Founder & CEO',
    bio: 'Former real estate entrepreneur with 12+ years of experience in premium residential spaces',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  },
  {
    name: 'Vikram Patel',
    role: 'Chief Operations Officer',
    bio: 'Operations expert with background in hospitality and community management',
    image: 'https://images.pexels.com/photos/416782/pexels-photo-416782.jpeg',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Head of Technology',
    bio: 'Tech innovator specializing in IoT and smart building solutions',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  },
];

const milestones = [
  { year: '2021', event: 'GoFlex founded in Bengaluru' },
  { year: '2022', event: '500+ residents across 5 cities' },
  { year: '2023', event: '20 premium properties launched' },
  { year: '2024', event: 'Expanded to pan-India operations' },
];

export default function About() {
  return (
    <>
      <section className="hero-section about-hero">
        <div className="hero-overlay">
          <div className="hero-layout">
            <article className="hero-intro">
              <span className="section-eyebrow">About GoFlex Housing</span>
              <h1 className="hero-title">Redefining Co-Living for Modern India</h1>
              <p className="hero-lede">
                GoFlex Housing is a Next-Generation Housing Management System that brings together premium spaces, cutting-edge technology, and vibrant communities to create the perfect living experience for high-performance residents.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="content-wrap about-mission">
        <div className="mission-grid">
          <article className="mission-card">
            <div className="mission-icon">🎯</div>
            <h2>Our Mission</h2>
            <p>
              To empower young professionals with thoughtfully designed living spaces that foster community, productivity, and personal growth.
            </p>
          </article>

          <article className="mission-card">
            <div className="mission-icon">✨</div>
            <h2>Our Vision</h2>
            <p>
              To become the most trusted co-living platform in India, setting new standards for residential excellence and community living.
            </p>
          </article>

          <article className="mission-card">
            <div className="mission-icon">💡</div>
            <h2>Our Values</h2>
            <p>
              Authenticity, Innovation, Community, and Excellence guide everything we do - from design to service delivery.
            </p>
          </article>
        </div>
      </section>

      <section className="content-wrap about-story">
        <div className="section-header">
          <span className="section-eyebrow">Our Story</span>
          <h2 className="section-title">From Idea to Reality</h2>
        </div>

        <div className="story-timeline">
          <p>
            GoFlex Housing was born from a simple observation: India's young professionals were underserved in the housing market. High rents, inflexible terms, and isolated communities were the norm. We believed there had to be a better way.
          </p>

          <p>
            Our founders - a diverse team with expertise in real estate, hospitality, and technology - set out to reimagine co-living. The result? Thoughtfully designed residences that combine premium interiors, smart amenities, and genuine community experiences.
          </p>

          <p>
            Today, GoFlex is home to thousands of residents across India's premier cities. But we're just getting started. Our vision is to create a nationwide network of premium co-living spaces where every resident feels at home, inspired, and connected.
          </p>
        </div>
      </section>

      <section className="content-wrap about-team">
        <div className="section-header">
          <span className="section-eyebrow">Leadership</span>
          <h2 className="section-title">Meet Our Founders</h2>
        </div>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <article key={member.name} className="team-card">
              <img src={member.image} alt={member.name} className="team-photo" />
              <div className="team-info">
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-wrap about-milestones">
        <div className="section-header">
          <span className="section-eyebrow">Our Journey</span>
          <h2 className="section-title">Key Milestones</h2>
        </div>

        <div className="milestones-timeline">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="milestone-item">
              <div className="milestone-year">{milestone.year}</div>
              <div className="milestone-event">{milestone.event}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-wrap about-cta">
        <div className="cta-card">
          <h2>Join the GoFlex Community</h2>
          <p>Experience premium co-living designed for your lifestyle</p>
          <div className="cta-actions">
            <NavLink to="/properties" className="btn-cta">Explore Properties</NavLink>
            <a href="mailto:sales@goflex.com" className="btn-ghost">Get in Touch</a>
          </div>
        </div>
      </section>
    </>
  );
}
