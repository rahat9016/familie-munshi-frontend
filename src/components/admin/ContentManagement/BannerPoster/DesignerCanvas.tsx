"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Download,
  ArrowLeft,
  Plus,
  ImagePlus,
  RotateCcw,
  PanelRightOpen,
  PanelRightClose,
  MousePointerClick,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize,
  Move,
  Tag,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useImageDrop } from "@/src/hooks/useImageDrop";
import type {
  PosterTemplate,
  TemplateTextElement,
  TemplateShape,
} from "./templates";
import DraggableText from "./DraggableText";
import TextControlPanel from "./TextControlPanel";

interface DesignerCanvasProps {
  template: PosterTemplate;
  onBack: () => void;
}

/** One template image zone that also accepts a dropped image file. */
function ImageZoneDropTarget({
  onFile,
  style,
  children,
}: {
  onFile: (file: File) => void;
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  const { isDragging, dropHandlers } = useImageDrop((files) => onFile(files[0]));

  return (
    <div
      {...dropHandlers}
      className={`absolute overflow-hidden ${
        isDragging ? "ring-2 ring-primary ring-inset" : ""
      }`}
      style={style}
    >
      {children}
    </div>
  );
}

export default function DesignerCanvas({
  template,
  onBack,
}: DesignerCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [textElements, setTextElements] = useState<TemplateTextElement[]>(
    template.textElements
  );
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [imageUploads, setImageUploads] = useState<Record<string, string>>({});
  const [canvasScale, setCanvasScale] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate scale to fit canvas in viewport
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 48; // padding
        const containerHeight = containerRef.current.clientHeight - 48;
        const scaleX = containerWidth / template.canvasWidth;
        const scaleY = containerHeight / template.canvasHeight;
        setCanvasScale(Math.min(scaleX, scaleY, 1));
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [template.canvasWidth, template.canvasHeight]);

  const handleTextPositionChange = useCallback(
    (id: string, x: number, y: number) => {
      setTextElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, x, y } : el))
      );
    },
    []
  );

  const handleTextUpdate = useCallback(
    (id: string, updates: Partial<TemplateTextElement>) => {
      setTextElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
      );
    },
    []
  );

  const handleDeleteText = useCallback((id: string) => {
    setTextElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedTextId(null);
  }, []);

  const handleAddText = useCallback(() => {
    const newEl: TemplateTextElement = {
      id: `text-${Date.now()}`,
      content: "New Text",
      x: 30,
      y: 50,
      fontSize: 24,
      fontWeight: 600,
      color: template.backgroundColor === "#2A2A2A" || template.backgroundColor === "#1A1A2E" || template.backgroundColor === "#0D0D0D" ? "#FFFFFF" : "#1A1A1A",
      rotation: 0,
      textTransform: "none",
    };
    setTextElements((prev) => [...prev, newEl]);
    setSelectedTextId(newEl.id);
    setSelectedZoneId(null);
  }, [template.backgroundColor]);

  const [processingZones, setProcessingZones] = useState<Record<string, boolean>>({});
  const [originalFiles, setOriginalFiles] = useState<Record<string, File>>({});
  const [originalUrls, setOriginalUrls] = useState<Record<string, string>>({});
  const [bgRemovedZones, setBgRemovedZones] = useState<Record<string, boolean>>({});
  const [imagePositions, setImagePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [imageScales, setImageScales] = useState<Record<string, number>>({});
  const [imageFitModes, setImageFitModes] = useState<Record<string, "cover" | "contain" | "fill">>({});

  // Brand overlay state
  const [brandText, setBrandText] = useState("YOUR BRAND");
  const [brandActive, setBrandActive] = useState(false);
  const [brandPosition, setBrandPosition] = useState({ x: 50, y: 50 });
  const [brandFontSize, setBrandFontSize] = useState(48);
  const [brandColor, setBrandColor] = useState("#000000");
  const [brandOpacity, setBrandOpacity] = useState(0.15);

  /** Shared by the file picker and by dropping an image on a zone. */
  const applyImageFile = useCallback((zoneId: string, file: File) => {
      const url = URL.createObjectURL(file);
      setImageUploads((prev) => ({ ...prev, [zoneId]: url }));
      setOriginalFiles((prev) => ({ ...prev, [zoneId]: file }));
      setOriginalUrls((prev) => ({ ...prev, [zoneId]: url }));
      setBgRemovedZones((prev) => ({ ...prev, [zoneId]: false }));
      setImagePositions((prev) => ({ ...prev, [zoneId]: { x: 0, y: 0 } }));
      setImageScales((prev) => ({ ...prev, [zoneId]: 1 }));
      setImageFitModes((prev) => ({ ...prev, [zoneId]: "cover" }));
    },
    []
  );

  const handleImageUpload = useCallback(
    (zoneId: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) applyImageFile(zoneId, file);
      e.target.value = "";
    },
    [applyImageFile]
  );

  const handleZoom = useCallback((zoneId: string, delta: number) => {
    setImageScales((prev) => ({
      ...prev,
      [zoneId]: Math.max(0.3, Math.min(3, (prev[zoneId] || 1) + delta)),
    }));
  }, []);

  const handleCenterImage = useCallback((zoneId: string) => {
    setImagePositions((prev) => ({ ...prev, [zoneId]: { x: 0, y: 0 } }));
  }, []);

  const handleToggleFitMode = useCallback((zoneId: string) => {
    setImageFitModes((prev) => {
      const current = prev[zoneId] || "cover";
      const next = current === "cover" ? "contain" : current === "contain" ? "fill" : "cover";
      return { ...prev, [zoneId]: next };
    });
  }, []);

  const handleToggleBgRemoval = useCallback(
    async (zoneId: string) => {
      if (bgRemovedZones[zoneId]) {
        // Restore original
        if (originalUrls[zoneId]) {
          setImageUploads((prev) => ({ ...prev, [zoneId]: originalUrls[zoneId] }));
          setBgRemovedZones((prev) => ({ ...prev, [zoneId]: false }));
          setImageFitModes((prev) => ({ ...prev, [zoneId]: "cover" }));
          setImagePositions((prev) => ({ ...prev, [zoneId]: { x: 0, y: 0 } }));
        }
        return;
      }

      const file = originalFiles[zoneId];
      if (!file) return;

      setProcessingZones((prev) => ({ ...prev, [zoneId]: true }));
      try {
        const { removeBackground } = await import("@imgly/background-removal");
        const blob = await removeBackground(file, {
          output: { format: "image/png", quality: 1 },
        });
        const processedUrl = URL.createObjectURL(blob);
        setImageUploads((prev) => ({ ...prev, [zoneId]: processedUrl }));
        setBgRemovedZones((prev) => ({ ...prev, [zoneId]: true }));
        // Auto-switch to contain so full subject is visible without clipping
        setImageFitModes((prev) => ({ ...prev, [zoneId]: "contain" }));
        setImagePositions((prev) => ({ ...prev, [zoneId]: { x: 0, y: 0 } }));
        setImageScales((prev) => ({ ...prev, [zoneId]: 1 }));
      } catch (err) {
        console.warn("Background removal failed:", err);
      } finally {
        setProcessingZones((prev) => ({ ...prev, [zoneId]: false }));
      }
    },
    [bgRemovedZones, originalFiles, originalUrls]
  );

  const handleImageDragStart = useCallback(
    (zoneId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setSelectedZoneId(zoneId);
      setSelectedTextId(null);
      const startX = e.clientX;
      const startY = e.clientY;
      const startPos = imagePositions[zoneId] || { x: 0, y: 0 };

      const handleMove = (moveE: MouseEvent) => {
        const dx = moveE.clientX - startX;
        const dy = moveE.clientY - startY;
        setImagePositions((prev) => ({
          ...prev,
          [zoneId]: { x: startPos.x + dx, y: startPos.y + dy },
        }));
      };

      const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [imagePositions]
  );

  const handleBrandDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setSelectedTextId(null);
      setSelectedZoneId(null);
      const startX = e.clientX;
      const startY = e.clientY;
      const startPos = { ...brandPosition };

      const handleMove = (moveE: MouseEvent) => {
        const parent = canvasRef.current;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        const dx = ((moveE.clientX - startX) / rect.width) * 100;
        const dy = ((moveE.clientY - startY) / rect.height) * 100;
        setBrandPosition({
          x: Math.max(0, Math.min(95, startPos.x + dx)),
          y: Math.max(0, Math.min(95, startPos.y + dy)),
        });
      };

      const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [brandPosition]
  );

  const handleResetTemplate = useCallback(() => {
    setTextElements(template.textElements);
    setImageUploads({});
    setSelectedTextId(null);
  }, [template.textElements]);

  // Export as PNG using html2canvas
  const handleExport = useCallback(async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setSelectedTextId(null);

    // Small delay to clear selection visuals
    await new Promise((r) => setTimeout(r, 200));

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2, // 2x for retina quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        width: template.canvasWidth * canvasScale,
        height: template.canvasHeight * canvasScale,
      });

      const link = document.createElement("a");
      link.download = `${template.name.replace(/\s+/g, "-").toLowerCase()}-design.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      // Fallback: open print dialog
      const printWindow = window.open("", "_blank");
      if (printWindow && canvasRef.current) {
        printWindow.document.write(`
          <html>
            <head><title>${template.name} Design</title></head>
            <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f0f0f0;">
              <div style="box-shadow:0 4px 24px rgba(0,0,0,0.15);">
                ${canvasRef.current.outerHTML}
              </div>
              <script>setTimeout(() => window.print(), 500);</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } finally {
      setIsExporting(false);
    }
  }, [template.canvasWidth, template.canvasHeight, template.name, canvasScale]);

  const selectedText = textElements.find((el) => el.id === selectedTextId);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm border border-gray-100 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Templates
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <h2 className="text-sm font-bold text-gray-800">
            {template.name}
          </h2>
          <span className="text-xs text-gray-400">
            {template.canvasWidth}×{template.canvasHeight}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddText}
            className="gap-1.5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Text
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetTemplate}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <Button
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="bg-secondary hover:bg-secondary/90 text-white gap-1.5 text-xs"
          >
            {isExporting ? (
              <>
                <span className="animate-spin h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                Download PNG
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Canvas Area + Control Panel */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Canvas */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center bg-gray-100 rounded-xl overflow-auto p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget || e.target === canvasRef.current) {
              setSelectedTextId(null);
              setSelectedZoneId(null);
            }
          }}
        >
          <div
            ref={canvasRef}
            className="relative overflow-hidden shadow-2xl"
            style={{
              width: template.canvasWidth * canvasScale,
              height: template.canvasHeight * canvasScale,
              background:
                template.backgroundGradient || template.backgroundColor,
              borderRadius: 4,
            }}
            id="design-canvas"
          >
            {/* Decorative Shapes */}
            {template.shapes.map((shape, i) => (
              <ShapeRenderer
                key={i}
                shape={shape}
                canvasWidth={template.canvasWidth * canvasScale}
                canvasHeight={template.canvasHeight * canvasScale}
              />
            ))}

            {/* Image Zones — each one accepts a dropped image. */}
            {template.imageZones.map((zone) => (
              <ImageZoneDropTarget
                key={zone.id}
                onFile={(file) => applyImageFile(zone.id, file)}
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`,
                  clipPath: zone.clipPath || undefined,
                }}
              >
                {imageUploads[zone.id] ? (
                  <div
                    className={`relative w-full h-full cursor-pointer ${
                      selectedZoneId === zone.id ? "ring-2 ring-blue-500 ring-inset" : ""
                    }`}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setSelectedZoneId(zone.id);
                      setSelectedTextId(null);
                    }}
                  >
                    <img
                      src={imageUploads[zone.id]}
                      alt=""
                      className="w-full h-full cursor-move"
                      style={{
                        objectFit: imageFitModes[zone.id] || "cover",
                        transform: `translate(${imagePositions[zone.id]?.x || 0}px, ${imagePositions[zone.id]?.y || 0}px) scale(${imageScales[zone.id] || 1})`,
                      }}
                      onMouseDown={(e) => handleImageDragStart(zone.id, e)}
                      draggable={false}
                    />
                    {/* Processing overlay */}
                    {processingZones[zone.id] && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                        <span className="animate-spin h-6 w-6 border-3 border-white/30 border-t-white rounded-full" />
                        <span className="text-white text-[10px] mt-2 font-medium">Removing BG...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center bg-black/5 border-2 border-dashed border-gray-300/50 cursor-pointer hover:bg-black/10 hover:border-primary/30 transition-all">
                    <ImagePlus
                      className="text-gray-400/60"
                      style={{
                        width: 24 * canvasScale,
                        height: 24 * canvasScale,
                      }}
                    />
                    <span
                      className="text-gray-400/60 mt-1 text-center px-2"
                      style={{ fontSize: `${Math.max(10 * canvasScale, 8)}px` }}
                    >
                      {zone.placeholder}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleImageUpload(zone.id, e)}
                    />
                  </label>
                )}
              </ImageZoneDropTarget>
            ))}

            {/* Text Elements */}
            {textElements.map((el) => (
              <DraggableText
                key={el.id}
                element={el}
                isSelected={selectedTextId === el.id}
                canvasScale={canvasScale}
                onSelect={() => { setSelectedTextId(el.id); setSelectedZoneId(null); }}
                onPositionChange={(x, y) =>
                  handleTextPositionChange(el.id, x, y)
                }
                onDoubleClick={() => { setSelectedTextId(el.id); setSelectedZoneId(null); }}
              />
            ))}

            {/* Social Media Icons */}
            {template.socialMedia?.show && (
              <div
                className="absolute flex items-center gap-1"
                style={{
                  left: `${template.socialMedia.x}%`,
                  top: `${template.socialMedia.y}%`,
                }}
              >
                {template.socialMedia.icons.map((icon) => (
                  <SocialIcon
                    key={icon}
                    name={icon}
                    color={template.socialMedia!.color}
                    size={template.socialMedia!.size * canvasScale}
                  />
                ))}
              </div>
            )}

            {/* Brand Overlay */}
            {brandActive && brandText && (
              <div
                className="absolute cursor-move select-none"
                style={{
                  left: `${brandPosition.x}%`,
                  top: `${brandPosition.y}%`,
                  transform: "translate(-50%, -50%)",
                  opacity: brandOpacity,
                  fontSize: `${brandFontSize * canvasScale}px`,
                  fontWeight: 900,
                  color: brandColor,
                  letterSpacing: `${4 * canvasScale}px`,
                  textTransform: "uppercase" as const,
                  whiteSpace: "nowrap" as const,
                  pointerEvents: "auto" as const,
                  zIndex: 60,
                  userSelect: "none" as const,
                }}
                onMouseDown={handleBrandDragStart}
              >
                {brandText}
              </div>
            )}
          </div>
        </div>

        {/* Control Panel (Always Visible, Collapsible Right Sidebar) */}
        <div
          className={`shrink-0 transition-all duration-300 ease-in-out ${
            isPanelOpen ? "w-72" : "w-10"
          }`}
        >
          {isPanelOpen ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden h-full flex flex-col">
              {/* Panel Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-100 shrink-0">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Controls
                </h4>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                  title="Collapse panel"
                >
                  <PanelRightClose className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {selectedText ? (
                  /* Show controls for selected text */
                  <div className="p-3">
                    <TextControlPanel
                      element={selectedText}
                      onUpdate={(updates) =>
                        handleTextUpdate(selectedText.id, updates)
                      }
                      onDelete={() => handleDeleteText(selectedText.id)}
                      onClose={() => setSelectedTextId(null)}
                    />
                  </div>
                ) : selectedZoneId && imageUploads[selectedZoneId] ? (
                  /* Show controls for selected image zone */
                  <div className="p-3 space-y-4">
                    <div className="flex items-center gap-2">
                      <ImagePlus className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-bold text-gray-800">Image Controls</h4>
                    </div>

                    {/* Zoom */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Zoom: {Math.round((imageScales[selectedZoneId] || 1) * 100)}%
                      </label>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() => handleZoom(selectedZoneId, -0.1)}
                          className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                        >
                          <ZoomOut className="h-3.5 w-3.5 text-gray-600" />
                        </button>
                        <input
                          type="range"
                          min={30}
                          max={300}
                          value={Math.round((imageScales[selectedZoneId] || 1) * 100)}
                          onChange={(e) => setImageScales((prev) => ({ ...prev, [selectedZoneId]: parseInt(e.target.value) / 100 }))}
                          className="flex-1 h-1.5 appearance-none bg-gray-200 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                        <button
                          onClick={() => handleZoom(selectedZoneId, 0.1)}
                          className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                        >
                          <ZoomIn className="h-3.5 w-3.5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Fit Mode */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Fit Mode
                      </label>
                      <div className="flex gap-1 mt-1.5">
                        {(["cover", "contain", "fill"] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setImageFitModes((prev) => ({ ...prev, [selectedZoneId]: mode }))}
                            className={`flex-1 py-2 text-xs rounded-lg capitalize cursor-pointer transition-colors ${
                              (imageFitModes[selectedZoneId] || "cover") === mode
                                ? "bg-secondary text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Center */}
                    <button
                      onClick={() => handleCenterImage(selectedZoneId)}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <Maximize className="h-4 w-4" />
                      Center Image
                    </button>

                    {/* BG Removal Toggle */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Background
                      </label>
                      <button
                        onClick={() => handleToggleBgRemoval(selectedZoneId)}
                        disabled={processingZones[selectedZoneId]}
                        className={`w-full mt-1.5 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          processingZones[selectedZoneId]
                            ? "bg-gray-100 text-gray-400 cursor-wait"
                            : bgRemovedZones[selectedZoneId]
                            ? "bg-green-50 text-green-600 hover:bg-green-100"
                            : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                        }`}
                      >
                        {processingZones[selectedZoneId] ? (
                          <>
                            <span className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full" />
                            Removing...
                          </>
                        ) : bgRemovedZones[selectedZoneId] ? (
                          "✓ Restore Background"
                        ) : (
                          "Remove Background"
                        )}
                      </button>
                    </div>

                    {/* Replace Image */}
                    <label className="w-full flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer">
                      <ImagePlus className="h-4 w-4" />
                      Replace Image
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleImageUpload(selectedZoneId, e)}
                      />
                    </label>

                    {/* Deselect */}
                    <button
                      onClick={() => setSelectedZoneId(null)}
                      className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer w-full text-center mt-1"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  /* Show elements list when nothing selected */
                  <div className="p-3 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400 px-1">
                      <MousePointerClick className="h-3.5 w-3.5" />
                      Click a text or image on canvas to edit
                    </div>
                    <div className="space-y-1">
                      {textElements.map((el) => (
                        <button
                          key={el.id}
                          onClick={() => { setSelectedTextId(el.id); setSelectedZoneId(null); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                        >
                          <div
                            className="w-3 h-3 rounded-sm shrink-0 border border-gray-200"
                            style={{ backgroundColor: el.color }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-gray-700 truncate">
                              {el.content.split("\n")[0]}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {el.fontSize}px • {el.fontWeight}w
                              {el.rotation !== 0 ? ` • ${el.rotation}°` : ""}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    {/* Image zones list */}
                    {template.imageZones.some((z) => imageUploads[z.id]) && (
                      <>
                        <div className="h-px bg-gray-100 my-1" />
                        <div className="space-y-1">
                          {template.imageZones.filter((z) => imageUploads[z.id]).map((zone) => (
                            <button
                              key={zone.id}
                              onClick={() => { setSelectedZoneId(zone.id); setSelectedTextId(null); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                            >
                              <div className="w-6 h-6 rounded overflow-hidden shrink-0 border border-gray-200">
                                <img src={imageUploads[zone.id]} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray-700">{zone.placeholder}</p>
                                <p className="text-[10px] text-gray-400">
                                  {Math.round((imageScales[zone.id] || 1) * 100)}% • {imageFitModes[zone.id] || "cover"}
                                  {bgRemovedZones[zone.id] ? " • BG removed" : ""}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Brand Overlay Controls */}
                    <div className="h-px bg-gray-100 my-1" />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-primary" />
                          Brand Overlay
                        </h4>
                        <button
                          onClick={() => setBrandActive(!brandActive)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                            brandActive ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                              brandActive ? "translate-x-4.5" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>

                      {brandActive && (
                        <div className="space-y-3">
                          {/* Brand Text */}
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Brand Name
                            </label>
                            <input
                              type="text"
                              value={brandText}
                              onChange={(e) => setBrandText(e.target.value)}
                              className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                              placeholder="Enter brand name"
                            />
                          </div>

                          {/* Font Size */}
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Size: {brandFontSize}px
                            </label>
                            <input
                              type="range"
                              min={16}
                              max={120}
                              value={brandFontSize}
                              onChange={(e) => setBrandFontSize(parseInt(e.target.value))}
                              className="w-full mt-1 h-1.5 appearance-none bg-gray-200 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                            />
                          </div>

                          {/* Color */}
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Color
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="color"
                                value={brandColor}
                                onChange={(e) => setBrandColor(e.target.value)}
                                className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer appearance-none p-0"
                              />
                              <input
                                type="text"
                                value={brandColor}
                                onChange={(e) => setBrandColor(e.target.value)}
                                className="flex-1 px-3 py-1.5 text-xs font-mono border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                              />
                            </div>
                          </div>

                          {/* Opacity */}
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Opacity: {Math.round(brandOpacity * 100)}%
                            </label>
                            <input
                              type="range"
                              min={5}
                              max={100}
                              value={Math.round(brandOpacity * 100)}
                              onChange={(e) => setBrandOpacity(parseInt(e.target.value) / 100)}
                              className="w-full mt-1 h-1.5 appearance-none bg-gray-200 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                            />
                          </div>

                          <p className="text-[10px] text-gray-400 text-center">
                            Drag the brand text on the canvas to reposition
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Collapsed state - thin strip with expand button */
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col items-center py-3">
              <button
                onClick={() => setIsPanelOpen(true)}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                title="Expand panel"
              >
                <PanelRightOpen className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================
// Shape Renderer
// =============================================
function ShapeRenderer({
  shape,
  canvasWidth,
  canvasHeight,
}: {
  shape: TemplateShape;
  canvasWidth: number;
  canvasHeight: number;
}) {
  const sx = (shape.x / 100) * canvasWidth;
  const sy = (shape.y / 100) * canvasHeight;
  const sw = (shape.width / 100) * canvasWidth;
  const sh = (shape.height / 100) * canvasHeight;

  if (shape.type === "circle") {
    return (
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: sx,
          top: sy,
          width: sw,
          height: sh,
          backgroundColor: shape.color,
          opacity: shape.opacity ?? 1,
          border: shape.border || undefined,
        }}
      />
    );
  }

  if (shape.type === "rect") {
    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: sx,
          top: sy,
          width: sw,
          height: sh,
          backgroundColor: shape.color,
          opacity: shape.opacity ?? 1,
          borderRadius: shape.borderRadius || 0,
          transform: shape.rotation
            ? `rotate(${shape.rotation}deg)`
            : undefined,
          border: shape.border || undefined,
        }}
      />
    );
  }

  if (shape.type === "dots") {
    const dotSize = Math.max(sw / 8, 2);
    const cols = Math.max(Math.floor(sw / (dotSize * 2)), 3);
    const rows = Math.max(Math.floor(sh / (dotSize * 2)), 3);
    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: sx,
          top: sy,
          width: sw,
          height: sh,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: dotSize * 0.5,
          opacity: shape.opacity ?? 1,
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              backgroundColor: shape.color,
              width: dotSize,
              height: dotSize,
            }}
          />
        ))}
      </div>
    );
  }

  if (shape.type === "line") {
    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: sx,
          top: sy,
          width: sw,
          height: Math.max(sh, 1),
          backgroundColor: shape.color,
          opacity: shape.opacity ?? 1,
          transform: shape.rotation
            ? `rotate(${shape.rotation}deg)`
            : undefined,
          transformOrigin: "left center",
        }}
      />
    );
  }

  if (shape.type === "chevrons") {
    return (
      <div
        className="absolute pointer-events-none flex flex-col gap-0.5"
        style={{
          left: sx,
          top: sy,
          opacity: shape.opacity ?? 1,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 0,
              height: 0,
              borderLeft: `${sw * 0.3}px solid transparent`,
              borderRight: `${sw * 0.3}px solid transparent`,
              borderTop: `${sh * 0.15}px solid ${shape.color}`,
            }}
          />
        ))}
      </div>
    );
  }

  if (shape.type === "triangle") {
    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: sx,
          top: sy,
          width: 0,
          height: 0,
          borderLeft: `${sw / 2}px solid transparent`,
          borderRight: `${sw / 2}px solid transparent`,
          borderBottom: `${sh}px solid ${shape.color}`,
          opacity: shape.opacity ?? 1,
        }}
      />
    );
  }

  return null;
}

// =============================================
// Social Icons
// =============================================
function SocialIcon({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: number;
}) {
  const iconMap: Record<string, string> = {
    facebook:
      "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
    instagram:
      "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z",
    twitter:
      "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
    youtube:
      "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={iconMap[name] || ""} />
    </svg>
  );
}

