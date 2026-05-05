import React, { useEffect } from 'react';

export default function Modal({ open, onClose, children }: { open: boolean; onClose: ()=>void; children: React.ReactNode }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent){ if(e.key==='Escape') onClose(); }
    if(open){ document.addEventListener('keydown', onKey); }
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if(!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-panel" onClick={(e)=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
