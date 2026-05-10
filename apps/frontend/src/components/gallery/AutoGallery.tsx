import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchGalleryPhotos } from '../../services/content.service';

function withParams(src: string, w: number) {
  const join = src.includes('?') ? '&' : '?';
  return `${src}${join}auto=format,compress&q=80&w=${w}&dpr=1`;
}

export default function AutoGallery() {
  const [photos, setPhotos] = useState<Awaited<ReturnType<typeof fetchGalleryPhotos>>>([]);

  useEffect(() => {
    let ignore = false;

    fetchGalleryPhotos(12)
      .then((items) => {
        if (!ignore) {
          setPhotos(items);
        }
      })
      .catch((error) => {
        console.error('Failed to load gallery photos', error);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const duplicated = useMemo(() => photos.concat(photos), [photos]);

  return (
    <div className="gallery-scroller" aria-label="Sample housing images">
      <div className="gallery-track">
        {duplicated.map((photo, index) => (
          <motion.figure 
            key={`${photo.id}-${index}`} 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="gallery-item group relative overflow-hidden rounded-2xl"
          >
            <img
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              src={withParams(photo.image_url, 800)}
              srcSet={[
                `${withParams(photo.image_url, 800)} 800w`,
                `${withParams(photo.image_url, 1280)} 1280w`,
                `${withParams(photo.image_url, 1920)} 1920w`,
                `${withParams(photo.image_url, 2560)} 2560w`,
              ].join(', ')}
              sizes="(max-width: 640px) 80vw, (max-width: 1100px) 40vw, 33vw"
              alt={photo.alt || 'Coliving space'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.figcaption 
              className="absolute bottom-4 left-4 text-white text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0"
            >
              {photo.alt || 'Coliving space'}
            </motion.figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}
