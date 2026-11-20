import { requireAdmin } from "@/app/admin/data";
import { getShopCatalog } from "@/lib/shopCatalogServer";
import ShopCatalogForm from "./ShopCatalogForm";

export const metadata = { title: "Edit shop", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminShopPage() {
  await requireAdmin();
  const catalog = await getShopCatalog();
  return <ShopCatalogForm initial={catalog.products} initialRevision={catalog.revision} unavailable={catalog.unavailable} />;
}
