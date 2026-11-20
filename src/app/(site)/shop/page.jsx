import fs from "fs";
import path from "path";
import ShopScripts from "@/components/ShopScripts";
import { getShopCatalog, renderShopCatalog, shopTemplate } from "@/lib/shopCatalogServer";
const shopInit = fs.readFileSync(
  path.join(process.cwd(), "src/data/shop-init.js"),
  "utf8"
);

export const metadata = { title: "Trail Store" };
export const revalidate = 300;

export default async function ShopPage() {
  const catalog = await getShopCatalog();
  const shopHtml = catalog.custom ? renderShopCatalog(catalog.products) : shopTemplate;
  return (
    <>
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: shopHtml }}
      />
      <ShopScripts initCode={shopInit} />
    </>
  );
}
