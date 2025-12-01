// src/services/ProductService.jsx
import supabase from "../lib/supabaseClient";
import { BRAND_MAP } from "../utils/brandMap";
import { mapProducts } from "../data/ProductMapper";

// =========================
// GET PRODUCT BY BRAND SLUG
// =========================
export async function getProductsByBrandSlug(slug) {
  const brandId = BRAND_MAP[slug];
  if (!brandId) return [];

  const { data, error } = await supabase
    .from("product")
    .select(`
      id,
      name,
      price,
      brand_id,
      brands ( name ),
      product_image ( order, image_url )
    `)
    .eq("brand_id", brandId)
    .order("id", { ascending: true });

  if (error) throw error;
  return mapProducts(data);
}

// =========================
// GET PRODUCT BY MAIN CATEGORY (kategori)
// =========================
export async function getProductsByCategory(main) {
  const { data, error } = await supabase
    .from("product")
    .select(`
      id,
      name,
      price,
      brand_id,
      kategori,
      brands ( name ),
      product_image ( order, image_url )
    `)
    .eq("kategori", main)
    .order("id", { ascending: true });

  if (error) throw error;
  return mapProducts(data);
}

// =========================
// GET PRODUCT BY SUB CATEGORY (subkategori)
// =========================
export async function getProductsBySub(main, sub) {
  const { data, error } = await supabase
    .from("product")
    .select(`
      id,
      name,
      price,
      brand_id,
      kategori,
      subkategori,
      brands ( name ),
      product_image ( order, image_url )
    `)
    .eq("kategori", main)
    .eq("subkategori", sub)
    .order("id", { ascending: true });

  if (error) throw error;
  return mapProducts(data);
}

// =========================
// SEARCH PRODUCTS (LIVE / ENTER)
// =========================
export async function searchProducts(query) {
  const { data, error } = await supabase
    .from("product")
    .select(`
      id,
      name,
      price,
      brand_id,
      brands ( name ),
      product_image ( order, image_url )
    `)
    .ilike("name", `%${query}%`)
    .order("id", { ascending: true });

  if (error) throw error;
  return mapProducts(data);
}

// =========================
// FOR MAIN LANDING PAGE (ROW NIKE / NB)
// =========================
export async function getLandingProducts(brandId) {
  const { data, error } = await supabase
    .from("product")
    .select(`
      id,
      name,
      price,
      brand_id,
      brands ( name ),
      product_image ( order, image_url )
    `)
    .eq("brand_id", brandId)
    .order("id", { ascending: true });

  if (error) throw error;
  return mapProducts(data);
}