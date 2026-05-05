import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { api } from '../services/api';

// eslint-disable-next-line @typescript-eslint/no-redeclare
interface BlogPostData {
  id: string;
  title: string;
  slug: string;
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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/api/blog/${slug}`);
        setPost(response.data.data);
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <section className="content-wrap">
        <div className="loading-state">Loading article...</div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="content-wrap">
        <div className="empty-state">
          <p>Article not found</p>
          <NavLink to="/blog" className="btn-cta">Back to Blog</NavLink>
        </div>
      </section>
    );
  }

  return (
    <>
      <article className="blog-post-page">
        <div className="blog-post-hero">
          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="blog-post-featured-image"
            />
          )}
        </div>

        <section className="content-wrap blog-post-content">
          <div className="blog-post-header">
            <span className="blog-post-category">{post.category}</span>
            <h1 className="blog-post-title">{post.title}</h1>

            <div className="blog-post-meta">
              {post.avatar_url && (
                <img src={post.avatar_url} alt={post.first_name} className="author-avatar-large" />
              )}
              <div>
                <div className="blog-post-author">
                  By {post.first_name} {post.last_name}
                </div>
                <div className="blog-post-date">
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  · {post.view_count} views
                </div>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="blog-post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-large">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="blog-post-body">
            {post.content.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="blog-post-footer">
            <NavLink to="/blog" className="btn-ghost">← Back to Blog</NavLink>
          </div>
        </section>
      </article>
    </>
  );
}
