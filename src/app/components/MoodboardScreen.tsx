import React, { useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { X, Download, Share2, ArrowLeft } from "lucide-react";

interface MoodboardData {
  palette: { hex: string; name: string }[];
  mood_words: string[];
  materials: string[];
  ambience: string;
  design_principles: string[];
}

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  image_url: string;
  description?: string;
}

interface MoodboardScreenProps {
  lookName: string;
  roomName: string;
  styleName: string;
  lookImage: string;
  moodboardData: MoodboardData;
  products: Product[];
  onClose: () => void;
  onProductClick?: (product: Product) => void;
  onBookVisit?: () => void;
  onSave?: () => void;
  isDesktop?: boolean;
}

export function MoodboardScreen({
  lookName,
  roomName,
  styleName,
  lookImage,
  moodboardData,
  products,
  onClose,
  onProductClick,
  onBookVisit,
  onSave,
  isDesktop = false,
}: MoodboardScreenProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const palette = moodboardData.palette ?? [];
  const moodWords = moodboardData.mood_words ?? [];
  const materials = moodboardData.materials ?? [];
  const ambience = moodboardData.ambience ?? "";

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    onProductClick?.(product);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--card)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
          padding: isDesktop ? "20px 32px" : "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: 0,
            color: "var(--foreground)",
          }}
        >
          <ArrowLeft size={20} />
          <span
            style={{
              fontFamily: "var(--font-gilroy)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            Back
          </span>
        </button>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => console.log("Download moodboard")}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--muted)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--foreground)",
            }}
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => console.log("Share moodboard")}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--muted)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--foreground)",
            }}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: isDesktop ? "32px 64px 64px" : "24px 20px 80px",
        }}
      >
        {/* Title Section */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "var(--font-gilroy)",
              fontSize: isDesktop ? "var(--text-2xl)" : "var(--text-xl)",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--foreground)",
              marginBottom: 8,
            }}
          >
            {lookName}
          </h1>
          <div
            style={{
              fontFamily: "var(--font-roboto)",
              fontSize: "var(--text-sm)",
              color: "var(--muted-foreground)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>{roomName}</span>
            <span>•</span>
            <span>{styleName}</span>
          </div>
        </div>

        {/* Color Palette */}
        {palette.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                fontFamily: "var(--font-gilroy)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--foreground)",
                marginBottom: 16,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Color Palette
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {palette.map((color, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: isDesktop ? 80 : 60,
                      height: isDesktop ? 80 : 60,
                      borderRadius: "50%",
                      background: color.hex,
                      border: "3px solid var(--card)",
                      boxShadow: "var(--elevation-sm)",
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "var(--font-roboto)",
                      fontSize: "10px",
                      color: "var(--muted-foreground)",
                      textAlign: "center",
                    }}
                  >
                    {color.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "9px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {color.hex}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ambience Quote */}
        {ambience && (
          <div
            style={{
              marginBottom: 32,
              padding: "20px 24px",
              background: "var(--muted)",
              borderRadius: "var(--radius)",
              borderLeft: "4px solid var(--primary)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-roboto)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--primary)",
                marginBottom: 8,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Ambience
            </div>
            <p
              style={{
                fontFamily: "var(--font-roboto)",
                fontSize: "var(--text-base)",
                color: "var(--foreground)",
                lineHeight: 1.6,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              "{ambience}"
            </p>
          </div>
        )}

        {/* Inspiration Images */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontFamily: "var(--font-gilroy)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--foreground)",
              marginBottom: 16,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Inspiration
          </div>
          <div
            style={{
              width: "100%",
              height: isDesktop ? 400 : 240,
              borderRadius: "var(--radius)",
              overflow: "hidden",
            }}
          >
            <img
              src={lookImage}
              alt={lookName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        {/* Materials & Mood */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
            gap: 24,
            marginBottom: 32,
          }}
        >
          {/* Materials */}
          {materials.length > 0 && (
            <div>
              <div
                style={{
                  fontFamily: "var(--font-gilroy)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--foreground)",
                  marginBottom: 12,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Materials
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {materials.map((material, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px 16px",
                      background: "var(--muted)",
                      borderRadius: "var(--radius-md)",
                      fontFamily: "var(--font-roboto)",
                      fontSize: "var(--text-sm)",
                      color: "var(--foreground)",
                      textTransform: "capitalize",
                    }}
                  >
                    {material}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mood Words */}
          {moodWords.length > 0 && (
            <div>
              <div
                style={{
                  fontFamily: "var(--font-gilroy)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--foreground)",
                  marginBottom: 12,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Mood
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {moodWords.map((word, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "8px 16px",
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                      borderRadius: "9999px",
                      fontFamily: "var(--font-roboto)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-medium)",
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Collage */}
        {products.length > 0 && (
          <div>
            <div
              style={{
                fontFamily: "var(--font-gilroy)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--foreground)",
                marginBottom: 16,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Products ({products.length})
            </div>
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 2, 768: 3, 1024: 4 }}
            >
              <Masonry gutter={isDesktop ? "16px" : "12px"}>
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    style={{
                      cursor: "pointer",
                      borderRadius: "var(--radius)",
                      overflow: "hidden",
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "var(--elevation-sm)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {product.image_url && (
                      <div
                        style={{
                          width: "100%",
                          paddingTop: "100%",
                          position: "relative",
                          background: "var(--muted)",
                        }}
                      >
                        <img
                          src={product.image_url}
                          alt={product.name}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                    <div style={{ padding: 12 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-gilroy)",
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-semibold)",
                          color: "var(--foreground)",
                          marginBottom: 4,
                          lineHeight: 1.3,
                        }}
                      >
                        {product.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-roboto)",
                          fontSize: "12px",
                          color: "var(--muted-foreground)",
                          marginBottom: 8,
                        }}
                      >
                        {product.brand}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-gilroy)",
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-bold)",
                          color: "var(--primary)",
                        }}
                      >
                        ₹{product.price.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </div>
        )}
      </div>

      {/* Bottom CTA Bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "var(--card)",
          borderTop: "1px solid var(--border)",
          padding: isDesktop ? "20px 64px" : "16px 20px",
          display: "flex",
          gap: 12,
          boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <button
          onClick={onSave}
          style={{
            flex: 1,
            height: 48,
            background: "var(--muted)",
            color: "var(--foreground)",
            border: "none",
            borderRadius: "9999px",
            fontFamily: "var(--font-gilroy)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-semibold)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          ♡ Save Moodboard
        </button>
        <button
          onClick={onBookVisit}
          style={{
            flex: 2,
            height: 48,
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            border: "none",
            borderRadius: "9999px",
            fontFamily: "var(--font-gilroy)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-semibold)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          📋 Book Design Visit
        </button>
      </div>
    </div>
  );
}
