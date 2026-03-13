import { getImagePreview } from "../../utils/formHelpers";

function ImageUploadField({ label, value, onFileChange, helperText }) {
  const preview = getImagePreview(value);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="text-xs text-slate-400">{helperText}</p>
      </div>

      <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 px-4 py-6 text-slate-300 transition hover:border-cyan-400">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
        <span>Select image</span>
      </label>

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="h-44 w-full rounded-2xl border border-slate-800 object-cover"
        />
      )}
    </div>
  );
}

export default ImageUploadField;
