import supabase from "../../../lib/supabaseClient";

//
// GET PRODUCT (ambil produk lengkap)
//
export async function getProducts() {
  const { data, error } = await supabase
    .from("product")
    .select(`
      id,
      name,
      price,
      brand_id,
      grades,
      description,
      brands(name),
      product_categories(
        category_id,
        categories(name)
      ),
      product_image(order, image_url),
      stock_variants(size, stock)
    `)
    .order("id", { ascending: true });

  if (error) throw error;
  return data;
}

// 
// GET PRODUCT (SINGLE)
// 
export async function getProductById(id) {
  const { data, error } = await supabase
    .from("product")
    .select(`
      id,
      name,
      price,
      brand_id,
      grades,
      description,
      product_categories (
        category_id,
        categories(name)
      ),
      product_image (
        order,
        image_url
      ),
      stock_variants (
        size,
        stock
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

//
// INSERT PRODUCT
//
export async function insertProduct(form, img1, img2, brandId, categoryIds) {
  // 1. Insert produk utama
  const { data: product, error: err1 } = await supabase
    .from("product")
    .insert([
      {
        name: form.nama,
        price: form.harga,
        brand_id: brandId,
        description: form.deskripsi,
        grades: form.grade
      }
    ])
    .select()
    .single();

  if (err1) throw err1;

  const productId = product.id;

  // 2. Insert gambar
  await supabase.from("product_image").insert([
    { product_id: productId, image_url: img1, order: 1 },
    { product_id: productId, image_url: img2, order: 2 }
  ]);

  // 3. Insert multi kategori
  if (categoryIds.length > 0) {
    const mapping = categoryIds.map((cat) => ({
      product_id: productId,
      category_id: cat
    }));

    await supabase.from("product_categories").insert(mapping);
  }

  // 4. Insert size + stok
  await supabase.from("stock_variants").insert([
    {
      product_id: productId,
      size: form.size,
      stock: form.stok
    }
  ]);

  return product;
}

//
// DELETE PRODUCT
//
export async function deleteProduct(id) {
  // 1. Ambil data image untuk dapatkan path file
  const { data: images } = await supabase
    .from("product_image")
    .select("image_url")
    .eq("product_id", id);

  if (images && images.length > 0) {
    for (const img of images) {
      // 2. Convert public URL → path dalam bucket
      const url = img.image_url;
      const path = url.split("/product_image/")[1]; 
      // contoh: "products/xxx.jpg"

      if (path) {
        // 3. Hapus dari storage
        await supabase.storage
          .from("product_image")
          .remove([path]);
      }
    }
  }

  // 4. Hapus semua relasi
  await supabase.from("product_image").delete().eq("product_id", id);
  await supabase.from("product_categories").delete().eq("product_id", id);
  await supabase.from("stock_variants").delete().eq("product_id", id);

  // 5. Hapus produk utama
  const { error } = await supabase.from("product").delete().eq("id", id);
  if (error) throw error;
}

//
// Update
// 
export async function updateProduct(productId, form, newImg1, newImg2, brandId, categoryIds) {
  // 1. Ambil gambar lama dari DB
  const { data: oldImages } = await supabase
    .from("product_image")
    .select("id, image_url, order")
    .eq("product_id", productId);

  // 2. Hapus gambar lama jika admin mengganti gambar
  const imagesToDelete = [];

  if (newImg1 && oldImages[0]) {
    const path = oldImages[0].image_url.split("/product_image/")[1];
    if (path) imagesToDelete.push(path);
  }

  if (newImg2 && oldImages[1]) {
    const path = oldImages[1].image_url.split("/product_image/")[1];
    if (path) imagesToDelete.push(path);
  }

  if (imagesToDelete.length > 0) {
    await supabase.storage.from("product_image").remove(imagesToDelete);
  }

  // 3. Update gambar baru (kalau ada)
  if (newImg1) {
    await supabase
      .from("product_image")
      .update({ image_url: newImg1 })
      .eq("product_id", productId)
      .eq("order", 1);
  }

  if (newImg2) {
    await supabase
      .from("product_image")
      .update({ image_url: newImg2 })
      .eq("product_id", productId)
      .eq("order", 2);
  }

  // 4. Update tabel product utama
  await supabase
    .from("product")
    .update({
      name: form.nama,
      price: form.harga,
      brand_id: brandId,
      grades: form.grade,
      description: form.deskripsi
    })
    .eq("id", productId);

  // 5. Update kategori (replace semua)
  if (categoryIds.length > 0) {
    await supabase.from("product_categories").delete().eq("product_id", productId);

    const mapping = categoryIds.map((cat) => ({
      product_id: productId,
      category_id: cat
    }));

    await supabase.from("product_categories").insert(mapping);
  }

  // 6. Update stok + size
  await supabase
    .from("stock_variants")
    .update({
      size: form.size,
      stock: form.stok
    })
    .eq("product_id", productId);

  return true;
}
