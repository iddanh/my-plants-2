import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Plant, PlantInput } from '../types';
import { uploadImage } from '../lib/cloudinary';
import { ImageCropper } from './ImageCropper';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  wateringIntervalDays: z.coerce
    .number({ message: 'Enter a number' })
    .int('Whole days only')
    .min(1, 'At least 1 day')
    .max(365, 'Too large'),
  lastWateredDate: z.string().min(1, 'Required'),
  species: z.string().trim().optional(),
  location: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

type FormValues = z.input<typeof schema>;

interface Props {
  initial?: Plant;
  submitLabel: string;
  onSubmit: (input: PlantInput) => Promise<void>;
}

function toDateInputValue(ms: number): string {
  const d = new Date(ms);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function fromDateInputValue(s: string): number {
  return new Date(`${s}T00:00:00`).getTime();
}

const today = toDateInputValue(Date.now());

export function PlantForm({ initial, submitLabel, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? '',
      wateringIntervalDays: initial?.wateringIntervalDays ?? 7,
      lastWateredDate: toDateInputValue(initial?.lastWateredAt ?? Date.now()),
      species: initial?.species ?? '',
      location: initial?.location ?? '',
      notes: initial?.notes ?? '',
    },
  });

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initial?.imageUrl ?? '');
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  function onCropped(b: Blob) {
    setBlob(b);
    setPreviewUrl((prev) => {
      if (prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return URL.createObjectURL(b);
    });
    setCropSrc(null);
    setImageError(null);
  }

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    if (!blob && !initial?.imageUrl) {
      setImageError('Please add a photo');
      return;
    }
    if (blob && !navigator.onLine) {
      setSubmitError("You're offline — saving a new photo needs a connection.");
      return;
    }
    try {
      let imageUrl = initial?.imageUrl ?? '';
      let imagePublicId = initial?.imagePublicId ?? '';
      if (blob) {
        const uploaded = await uploadImage(blob);
        imageUrl = uploaded.url;
        imagePublicId = uploaded.publicId;
      }
      await onSubmit({
        name: values.name.trim(),
        wateringIntervalDays: Number(values.wateringIntervalDays),
        lastWateredAt: fromDateInputValue(values.lastWateredDate),
        species: values.species?.trim() || undefined,
        location: values.location?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
        imageUrl,
        imagePublicId,
      });
    } catch (err) {
      setSubmitError((err as Error).message);
    }
  });

  return (
    <>
      <form onSubmit={submit} className="flex flex-col gap-5">
        {/* Photo */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Photo</label>
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-green-50">
              {previewUrl ? (
                <img src={previewUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl">🪴</div>
              )}
            </div>
            <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              {previewUrl ? 'Change photo' : 'Choose photo'}
              <input type="file" accept="image/*" onChange={onFile} className="hidden" />
            </label>
          </div>
          {imageError && <p className="mt-1 text-sm text-red-600">{imageError}</p>}
        </div>

        <Field label="Name" error={errors.name?.message}>
          <input
            {...register('name')}
            placeholder="Monstera"
            className="input"
            autoComplete="off"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Water every (days)"
            error={errors.wateringIntervalDays?.message}
            className={initial ? undefined : 'col-span-2'}
          >
            <input type="number" min={1} max={365} {...register('wateringIntervalDays')} className="input" />
          </Field>

          {initial && (
            <Field label="Last watered" error={errors.lastWateredDate?.message}>
              <input type="date" max={today} {...register('lastWateredDate')} className="input" />
            </Field>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Species (optional)">
            <input {...register('species')} placeholder="Monstera deliciosa" className="input" />
          </Field>

          <Field label="Location (optional)">
            <input {...register('location')} placeholder="Living room window" className="input" />
          </Field>
        </div>

        <Field label="Notes (optional)">
          <textarea {...register('notes')} rows={3} className="input resize-none" />
        </Field>

        {submitError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </form>

      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          onCancel={() => setCropSrc(null)}
          onCropped={onCropped}
        />
      )}
    </>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
