import { useEffect, useRef } from 'react';

export default function Modal({ title, onClose, children, bodyRef }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-label={title}>
        <button ref={closeRef} type="button" className="close" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        <h2>{title}</h2>
        <div className="modal-body" ref={bodyRef}>{children}</div>
      </div>
    </div>
  );
}
