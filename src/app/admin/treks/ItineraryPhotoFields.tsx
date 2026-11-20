import ImageField from "@/app/admin/ImageField";

export default function ItineraryPhotoFields({ photo1, photo2, onChange, onUploading, inputClass }: {
  photo1: string;
  photo2: string;
  onChange: (field: "image" | "secondImage", url: string) => void;
  onUploading: (uploading: boolean) => void;
  inputClass: string;
}) {
  const photos = [{ field: "image", value: photo1 }, { field: "secondImage", value: photo2 }] as const;

  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-xs font-semibold text-ink">Photos <span className="font-normal text-gray-400">· up to 2 per day</span></legend>
      <div className="grid items-start gap-3 sm:grid-cols-2">
        {photos.map(({ field, value }, index) => (
          <div key={field} className="min-w-0 rounded-xl border border-line bg-white p-3">
            <ImageField label={`Photo ${index + 1}`} className={inputClass} value={value}
              onChange={(url) => onChange(field, url)} onUploading={onUploading}
              folder="treks/itinerary" placeholder="Image URL"
              previewClassName="mt-3 h-28 w-full rounded-lg border border-line bg-slate-50 object-cover" />
          </div>
        ))}
      </div>
    </fieldset>
  );
}
