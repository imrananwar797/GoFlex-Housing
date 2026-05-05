import React from 'react';

import { useEffect, useMemo, useState } from 'react';
import { fetchGalleryPhotos } from '../../services/content.service';

function withParams(src: string, w: number) {
  const join = src.includes('?') ? '&' : '?';
  return `${src}${join}auto=compress&cs=tinysrgb&w=${w}&dpr=1`;
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
          <figure key={`${photo.id}-${index}`} className="gallery-item">
            <img
              loading="lazy"
              decoding="async"
              src={withParams(photo.image_url, 1280)}
              srcSet={[
                `${withParams(photo.image_url,1280)} 1280w`,
                `${withParams(photo.image_url,1920)} 1920w`,
                `${withParams(photo.image_url,2560)} 2560w`,
                `${withParams(photo.image_url,3840)} 3840w`,
              ].join(', ')}
              sizes="(max-width: 640px) 80vw, (max-width: 1100px) 40vw, 33vw"
              alt={photo.alt || 'Coliving space'}
            />
            <figcaption>{photo.alt || 'Coliving space'}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
