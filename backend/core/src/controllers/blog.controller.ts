import { Request, Response } from 'express';
import prisma from '../utils/db.client';

export const getAllPosts = async (req: Request, res: Response) => {
  const { category, search } = req.query;
  try {
    const where: any = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { excerpt: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: { author: { select: { full_name: true, username: true } } },
      orderBy: { published_at: 'desc' }
    });
    res.json({ data: posts });
  } catch (error) {
    res.status(500).json({ detail: 'Error fetching blog posts' });
  }
};

export const getPostBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: slug as string },
      include: { author: { select: { full_name: true, username: true } } }
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    // Increment view count (fire and forget)
    prisma.blogPost.update({
      where: { id: post.id },
      data: { view_count: { increment: 1 } }
    }).catch(e => console.error('Error updating view count:', e));

    res.json(post);
  } catch (error) {
    res.status(500).json({ detail: 'Internal server error' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { title, slug, excerpt, content, featured_image, category, tags } = req.body;
  const author_id = (req as any).user.user_id;

  try {
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featured_image,
        category,
        tags,
        author_id
      }
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ detail: 'Error creating blog post' });
  }
};
