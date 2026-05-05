import React from 'react';

export default function Placeholder({ title }: { title: string }) {
  return (
    <section className="content-wrap">
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">This section will be built with content and galleries.</p>
    </section>
  );
}
