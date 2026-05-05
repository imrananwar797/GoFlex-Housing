import React, { useEffect, useState } from 'react';

export default function ScrollTop(){
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 240);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button className="scroll-top" aria-label="Scroll to top" onClick={()=> window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
  );
}
