export function mapProducts(raw) {
  return raw.map((p) => {
    const sorted =
      p.product_image?.sort((a, b) => a.order - b.order) || [];

    return {
      id: Number(p.id),
      name: p.name,
      price: Number(p.price),
      brand: p.brands?.name || "Unknown",
      brand_id: p.brand_id,
      images: sorted.map((img) => img.image_url),
    };
  });
}