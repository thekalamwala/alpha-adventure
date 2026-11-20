import "server-only";
import fs from "node:fs";
import path from "node:path";
import { shopCatalogKey, shopProductsSchema, type ShopProduct } from "@/lib/shopCatalog";
import { isPublicSupabaseConfigured, publicClient } from "@/lib/seo";

export const shopTemplate = fs.readFileSync(path.join(process.cwd(), "src/data/orig-shop.html"), "utf8");
const gridStart = '<div class="row gy-5 shop-v2-grid" id="shopProductGrid">';
const gridEnd = '<div class="shop-v2-empty" id="shopNoResults"';
const entities: Record<string, string> = { amp: "&", quot: '"', "#39": "'", lt: "<", gt: ">" };
const decode = (text: string) => text.replace(/&(amp|quot|#39|lt|gt);/g, (_, entity) => entities[entity]);
const escape = (text: string) => text.replace(/[&<>"']/g, (char) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

function legacyProducts() {
  return shopProductsSchema.parse(Array.from(shopTemplate.matchAll(/<div class="[^"]*shop-v2-item"([^>]*)>[\s\S]*?<button[^>]*class="shop-add-btn"([^>]*)>/g), ([, card, button]) => {
    const attrs = Object.fromEntries(Array.from((card + button).matchAll(/data-([\w-]+)="([^"]*)"/g), ([, name, value]) => [name, decode(value)]));
    return {
      id: attrs["product-id"], name: attrs.name, category: attrs.category, price: Number(attrs.price),
      image: "/" + attrs["product-image"].replace(/^\/+/, ""), description: attrs.description,
      specs: attrs.specs.replaceAll("|", "\n"),
    };
  }));
}

export async function getShopCatalog() {
  if (!isPublicSupabaseConfigured) {
    return { products: legacyProducts(), revision: null, custom: false, unavailable: true };
  }
  const { data, error } = await publicClient().from("site_settings")
    .select("value,updated_at").eq("key", shopCatalogKey).maybeSingle();
  const parsed = shopProductsSchema.safeParse(data?.value);
  return {
    products: parsed.success ? parsed.data : legacyProducts(),
    revision: data?.updated_at ?? null,
    custom: parsed.success,
    unavailable: !!error,
  };
}

function productCard(product: ShopProduct) {
  const { id, category, price } = product;
  const name = escape(product.name);
  const image = escape(product.image);
  const description = escape(product.description);
  const specs = product.specs.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const priceLabel = `₹${price.toLocaleString("en-IN")}`;
  return `<div class="col-lg-4 col-md-6 shop-v2-item" data-category="${category}" data-name="${name}" data-price="${price}" data-description="${description}" data-specs="${escape(specs.join("|"))}">
    <div class="product-card">
      <div class="product-card-img-wrap"><div class="product-card-img"><img src="${image}" alt="${name}"></div></div>
      <div class="product-card-content">
        <div class="product-card-title-row"><h6>${name}</h6><span>${priceLabel}</span></div>
        ${description ? `<p class="product-card-desc">${description}</p>` : ""}
        ${specs.length ? `<ul class="product-card-specs">${specs.map((line) => `<li>${escape(line)}</li>`).join("")}</ul>` : ""}
        <div class="product-card-actions">
          <button type="button" class="shop-add-btn" data-product-id="${id}" data-product-name="${name}" data-product-price="${price}" data-product-image="${image}">View details</button>
        </div>
      </div>
    </div>
  </div>`;
}

export function renderShopCatalog(products: ShopProduct[]) {
  const start = shopTemplate.indexOf(gridStart);
  const end = shopTemplate.indexOf(gridEnd, start);
  if (start < 0 || end < 0) return shopTemplate;
  return shopTemplate.slice(0, start + gridStart.length)
    + products.map(productCard).join("")
    + "</div>" + shopTemplate.slice(end);
}
