"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageField from "@/app/admin/ImageField";
import { shopCategories, type ShopProduct } from "@/lib/shopCatalog";
import { saveShopCatalog } from "./actions";

type ProductDraft = Omit<ShopProduct, "price"> & { price: string };
const input = "w-full rounded-lg border border-line bg-slate-50 px-3 py-2 text-sm text-ink";

export default function ShopCatalogForm({ initial, initialRevision, unavailable }: {
  initial: ShopProduct[];
  initialRevision: string | null;
  unavailable: boolean;
}) {
  const [products, setProducts] = useState<ProductDraft[]>(() => initial.map((product) => ({ ...product, price: String(product.price) })));
  const [selected, setSelected] = useState(initial[0]?.id);
  const [revision, setRevision] = useState(initialRevision);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; error?: boolean } | null>(null);
  const active = products.find((product) => product.id === selected);
  const locked = saving || uploading || unavailable;

  function change(id: string, patch: Partial<ProductDraft>) {
    setProducts((current) => current.map((product) => product.id === id ? { ...product, ...patch } : product));
    setFeedback(null);
  }

  function add() {
    const id = crypto.randomUUID();
    setProducts((current) => [...current, { id, name: "", category: "accessories", price: "", image: "", description: "", specs: "" }]);
    setSelected(id);
    setFeedback(null);
  }

  function remove(id: string) {
    const remaining = products.filter((product) => product.id !== id);
    setProducts(remaining);
    setSelected(remaining[0]?.id);
    setFeedback({ message: "Product removed from this draft. Save shop to publish the change." });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked) return;
    const incomplete = products.find(({ name, price, image }) => !name.trim() || !price.trim() || !image.trim());
    if (incomplete) {
      setSelected(incomplete.id);
      setFeedback({ message: "Enter a product name, price, and image.", error: true });
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      const result = await saveShopCatalog(products.map((product) => ({ ...product, price: Number(product.price) })), revision);
      if (result.ok) {
        setRevision(result.revision);
        setFeedback({ message: "Shop updated." });
      } else {
        setFeedback({ message: result.error, error: true });
      }
    } catch {
      setFeedback({ message: "Could not save the shop catalog.", error: true });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-page p-4 text-ink sm:p-8">
      <form onSubmit={submit} className="mx-auto max-w-5xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/admin" className="text-sm font-medium text-primary hover:underline">Back to admin</Link>
            <h1 className="mt-2 text-2xl font-bold">Shop catalog</h1>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="secondary"><Link href="/shop">View shop</Link></Button>
            <Button type="submit" disabled={locked}>{saving ? "Saving…" : "Save shop"}</Button>
          </div>
        </div>
        {unavailable && <p role="alert" className="text-sm text-red-700">The shop catalog could not be loaded. Reload before making changes.</p>}
        {feedback && <p role={feedback.error ? "alert" : "status"} className={`text-sm ${feedback.error ? "text-red-700" : "text-gray-700"}`}>{feedback.message}</p>}
        <div className="grid gap-4 md:grid-cols-[16rem_minmax(0,1fr)]">
          <div className="self-start rounded-xl border border-line bg-white p-3">
            <Button type="button" variant="secondary" onClick={add} disabled={locked} className="mb-3 w-full"><Plus size={16} /> Add product</Button>
            <ul className="max-h-[55vh] space-y-1 overflow-y-auto">
              {products.map((product) => (
                <li key={product.id}><button type="button" onClick={() => setSelected(product.id)} aria-pressed={selected === product.id} disabled={locked}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50 aria-pressed:bg-primary/10 aria-pressed:font-semibold">
                  {product.name || "New product"}
                </button></li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-line bg-white p-5">
            {active ? (
              <fieldset key={active.id} disabled={saving || unavailable} className="space-y-4">
                <label className="grid gap-1.5 text-sm font-medium">Product name
                  <input className={input} value={active.name} maxLength={160} onChange={(e) => change(active.id, { name: e.target.value })} />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-medium">Price (₹)
                    <input className={input} type="number" min="0" max="1000000" step="0.01" value={active.price} onChange={(e) => change(active.id, { price: e.target.value })} />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium">Category
                    <select className={input} value={active.category} onChange={(e) => change(active.id, { category: e.target.value as ShopProduct["category"] })}>
                      {shopCategories.map((category) => <option key={category} value={category}>{category[0].toUpperCase() + category.slice(1)}</option>)}
                    </select>
                  </label>
                </div>
                <ImageField label="Product image" value={active.image} onChange={(image) => change(active.id, { image })} onUploading={setUploading}
                  className={input} folder="shop" placeholder="Image URL" />
                <label className="grid gap-1.5 text-sm font-medium">Description
                  <textarea className={input} rows={3} value={active.description} maxLength={3000} onChange={(e) => change(active.id, { description: e.target.value })} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">Specifications <span className="text-xs font-normal text-gray-500">One per line</span>
                  <textarea className={input} rows={4} value={active.specs} maxLength={3000} onChange={(e) => change(active.id, { specs: e.target.value })} />
                </label>
                <Button type="button" variant="secondary" onClick={() => remove(active.id)} disabled={locked}>Remove product</Button>
              </fieldset>
            ) : <p className="text-sm text-gray-500">Add a product to start editing the shop.</p>}
          </div>
        </div>
      </form>
    </main>
  );
}
