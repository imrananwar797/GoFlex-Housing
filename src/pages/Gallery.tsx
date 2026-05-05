import React, { useMemo, useState } from 'react';
import Modal from '../components/common/Modal';

const IMAGES: { src: string; alt: string; tag: 'Rooms'|'Common'|'Exterior'|'Community' }[] = [
  { src: 'https://images.pexels.com/photos/4907205/pexels-photo-4907205.jpeg', alt: 'Modern hostel bunk beds', tag: 'Rooms' },
  { src: 'https://images.pexels.com/photos/6489127/pexels-photo-6489127.jpeg', alt: 'Sleek shared kitchen', tag: 'Common' },
  { src: 'https://images.pexels.com/photos/4874580/pexels-photo-4874580.jpeg', alt: 'Apartment building facade', tag: 'Exterior' },
  { src: 'https://images.pexels.com/photos/7651627/pexels-photo-7651627.jpeg', alt: 'Coworking lounge', tag: 'Common' },
  { src: 'https://images.pexels.com/photos/32982365/pexels-photo-32982365.jpeg', alt: 'Student housing exterior', tag: 'Exterior' }
];

function withParams(src: string, w: number) {
  const join = src.includes('?') ? '&' : '?';
  return `${src}${join}auto=compress&cs=tinysrgb&w=${w}&dpr=1`;
}

const TABS: Array<{label: string; value: 'All'|'Rooms'|'Common'|'Exterior'|'Community'}> = [
  { label: 'All', value: 'All' },
  { label: 'Rooms', value: 'Rooms' },
  { label: 'Common Areas', value: 'Common' },
  { label: 'Exteriors', value: 'Exterior' },
  { label: 'Community', value: 'Community' }
];

export default function Gallery() {
  const [tab, setTab] = useState<'All'|'Rooms'|'Common'|'Exterior'|'Community'>('All');
  const [active, setActive] = useState<{src:string;alt:string}|null>(null);
  const list = useMemo(() => tab==='All'? IMAGES : IMAGES.filter(i=>i.tag===tab), [tab]);

  return (
    <section className="content-wrap">
      <h1 className="page-title">Gallery</h1>
      <div className="filter-bar">
        {TABS.map(t => (
          <button key={t.value} className={tab===t.value? 'chip active':'chip'} onClick={()=>setTab(t.value)}>{t.label}</button>
        ))}
      </div>
      <div className="gallery-grid">
        {list.map((img)=> (
          <figure key={img.src} className="image-card" onClick={()=>setActive(img)}>
            <img
              loading="lazy"
              decoding="async"
              src={withParams(img.src, 1280)}
              srcSet={[
                `${withParams(img.src,1280)} 1280w`,
                `${withParams(img.src,1920)} 1920w`,
                `${withParams(img.src,2560)} 2560w`,
                `${withParams(img.src,3840)} 3840w`,
              ].join(', ')}
              sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
              alt={img.alt}
            />
            <figcaption>{img.alt}</figcaption>
          </figure>
        ))}
      </div>

      <Modal open={!!active} onClose={()=>setActive(null)}>
        {active && (
          <div className="lightbox">
            <img
              decoding="async"
              src={withParams(active.src, 3840)}
              srcSet={[
                `${withParams(active.src,1920)} 1920w`,
                `${withParams(active.src,2560)} 2560w`,
                `${withParams(active.src,3840)} 3840w`,
              ].join(', ')}
              sizes="100vw"
              alt={active.alt}
            />
            <div className="lightbox-caption">{active.alt}</div>
          </div>
        )}
      </Modal>
    </section>
  );
}
