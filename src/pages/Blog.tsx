import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { api } from '../services/api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string[];
  view_count: number;
  published_at: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Lifestyle', 'Guide', 'Community', 'News'];

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = { limit: '12' };
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/api/blog', { params });
      setPosts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchTerm]);

  return (
    <>
      <section className="hero-section blog-hero">
        <div className="hero-overlay">
          <div className="hero-layout">
            <article className="hero-intro">
              <span className="section-eyebrow">GoFlex Insights</span>
              <h1 className="hero-title">Discover Stories, Tips & Insights</h1>
              <p className="hero-lede">Learn from our community and stay updated with trends in co-living, lifestyle, and community living.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="content-wrap blog-filters">
        <div className="filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="city-search"
            />
          </div>

          <div className="category-filters">
            <button
              className={selectedCategory === '' ? 'state-chip active' : 'state-chip'}
              onClick={() => setSelectedCategory('')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={selectedCategory === cat ? 'state-chip active' : 'state-chip'}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="content-wrap blog-grid">
        {loading ? (
          <div className="loading-state">Loading articles...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>No articles found. Check back soon!</p>
          </div>
        ) : (
          <div className="blog-cards-grid">
            {posts.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="blog-image-wrapper">
                  <img
                    src={post.featured_image || 'https://via.placeholder.com/400x250'}
                    alt={post.title}
                    className="blog-image"
                  />
                  <span className="blog-category">{post.category}</span>
                </div>

                <div className="blog-content">
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt || post.content.substring(0, 150)}...</p>

                  <div className="blog-meta">
                    {post.avatar_url && (
                      <img src={post.avatar_url} alt={post.first_name} className="author-avatar" />
                    )}
                    <div className="author-info">
                      <span className="author-name">
                        {post.first_name} {post.last_name}
                      </span>
                      <span className="publish-date">
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="blog-tags">
                    {post.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <NavLink to={`/blog/${post.slug}`} className="read-more">
                    Read Article →
                  </NavLink>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="content-wrap blog-newsletter">
        <div className="newsletter-card">
          <h2>Subscribe to GoFlex Insights</h2>
          <p>Get the latest articles, community stories, and co-living tips delivered to your inbox</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="city-search"
              required
            />
            <button type="submit" className="btn-cta">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}
