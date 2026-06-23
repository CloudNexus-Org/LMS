import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Check } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

async function generateCroppedImage(imageSrc, { scale, offsetX, offsetY, viewportW, viewportH, shape, aspect }) {
  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = imageSrc;
  });

  const outW = shape === "circle" ? 512 : 1200;
  const outH = shape === "circle" ? 512 : Math.round(outW / aspect);
  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");

  const cropW = viewportW / scale;
  const cropH = viewportH / scale;
  const centerX = (viewportW / 2 - offsetX) / scale;
  const centerY = (viewportH / 2 - offsetY) / scale;
  const sx = Math.max(0, Math.min(img.width - cropW, centerX - cropW / 2));
  const sy = Math.max(0, Math.min(img.height - cropH, centerY - cropH / 2));

  if (shape === "circle") {
    ctx.beginPath();
    ctx.arc(outW / 2, outH / 2, outW / 2, 0, Math.PI * 2);
    ctx.clip();
  }

  ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, outW, outH);
  return canvas.toDataURL("image/jpeg", 0.9);
}

export default function ImageCropperModal({
  open,
  imageSrc,
  title = "Crop image",
  shape = "circle",
  aspect = 4,
  onClose,
  onComplete,
}) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [saving, setSaving] = useState(false);

  const viewportW = shape === "circle" ? 280 : 320;
  const viewportH = shape === "circle" ? 280 : Math.round(320 / aspect);

  useEffect(() => {
    if (!open || !imageSrc) return;
    const img = new Image();
    img.onload = () => {
      setImgSize({ w: img.width, h: img.height });
      const fitScale = Math.max(viewportW / img.width, viewportH / img.height) * 1.1;
      setScale(fitScale);
      setOffset({
        x: (viewportW - img.width * fitScale) / 2,
        y: (viewportH - img.height * fitScale) / 2,
      });
    };
    img.src = imageSrc;
  }, [open, imageSrc, viewportW, viewportH]);

  const onPointerDown = useCallback(
    (e) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    },
    [offset]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!dragging) return;
      setOffset({
        x: dragStart.current.ox + (e.clientX - dragStart.current.x),
        y: dragStart.current.oy + (e.clientY - dragStart.current.y),
      });
    },
    [dragging]
  );

  const onPointerUp = useCallback(() => setDragging(false), []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await generateCroppedImage(imageSrc, {
        scale,
        offsetX: offset.x,
        offsetY: offset.y,
        viewportW,
        viewportH,
        shape,
        aspect,
      });
      onComplete(result);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="image-cropper-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="image-cropper-modal"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="image-cropper-header">
              <h3>{title}</h3>
              <button type="button" onClick={onClose} aria-label="Close" className="image-cropper-close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="image-cropper-hint">Drag to reposition · Use slider to zoom</p>

            <div
              className={`image-cropper-viewport image-cropper-viewport--${shape}`}
              style={{ width: viewportW, height: viewportH }}
            >
              <div
                className="image-cropper-canvas"
                style={{ width: viewportW, height: viewportH }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                {imageSrc && imgSize.w > 0 && (
                  <img
                    src={imageSrc}
                    alt=""
                    draggable={false}
                    className="image-cropper-source"
                    style={{
                      width: imgSize.w * scale,
                      height: imgSize.h * scale,
                      transform: `translate(${offset.x}px, ${offset.y}px)`,
                    }}
                  />
                )}
              </div>
              <div className={`image-cropper-mask image-cropper-mask--${shape}`} aria-hidden />
            </div>

            <div className="image-cropper-controls">
              <button type="button" onClick={() => setScale((s) => Math.max(0.2, s - 0.08))} aria-label="Zoom out">
                <ZoomOut className="h-4 w-4" />
              </button>
              <input
                type="range"
                min="0.2"
                max="4"
                step="0.02"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="image-cropper-slider"
                aria-label="Zoom"
              />
              <button type="button" onClick={() => setScale((s) => Math.min(4, s + 0.08))} aria-label="Zoom in">
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            <div className="image-cropper-footer">
              <button type="button" className="image-cropper-btn image-cropper-btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="image-cropper-btn image-cropper-btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                <Check className="h-4 w-4" />
                {saving ? "Saving…" : "Apply"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
