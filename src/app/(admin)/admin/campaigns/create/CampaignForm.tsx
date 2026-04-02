"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  campaignSchema,
  type CampaignFormInput,
} from "@/features/campaigns/campaigns.schema";
import { slugify } from "@/lib/utils/slugify";
import {
  AlertCircle,
  CheckCircle,
  X,
  Upload,
  Loader2,
  Calendar,
  DollarSign,
} from "lucide-react";

type CampaignFormProps = {
  defaultValues: CampaignFormInput;
  formAction: string | ((formData: FormData) => void | Promise<void>);
  submitLabel: string;
};

type UploadResponse = {
  success: boolean;
  key?: string;
  url?: string;
  message?: string;
};

export default function CampaignForm({
  defaultValues,
  formAction,
  submitLabel,
}: CampaignFormProps) {
  const [imagePreview, setImagePreview] = useState<string>(
    defaultValues.coverImageUrl || ""
  );
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    defaultValues.galleryImageUrls || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<CampaignFormInput>({
    resolver: zodResolver(campaignSchema),
    defaultValues,
  });

  const titleValue = watch("title");
  const slugValue = watch("slug");
  const coverImageUrlValue = watch("coverImageUrl");

  useEffect(() => {
    if (!slugValue || slugValue === slugify(defaultValues.title || "")) {
      setValue("slug", slugify(titleValue || ""));
    }
  }, [titleValue, slugValue, setValue, defaultValues.title]);

  useEffect(() => {
    setImagePreview(coverImageUrlValue || "");
  }, [coverImageUrlValue]);

  async function uploadSingleFile(file: File): Promise<string> {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const response = await fetch("/api/uploads/image", {
      method: "POST",
      body: uploadFormData,
    });

    const result = (await response.json()) as UploadResponse;

    if (!response.ok || !result.success || !result.url) {
      throw new Error(result.message || "Upload failed");
    }

    return result.url;
  }

  async function handleCoverUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setIsUploadingCover(true);

    try {
      const url = await uploadSingleFile(file);
      setValue("coverImageUrl", url, { shouldValidate: true });
      setImagePreview(url);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Cover image upload failed"
      );
    } finally {
      setIsUploadingCover(false);
      event.target.value = "";
    }
  }

  async function handleGalleryUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploadError("");
    setIsUploadingGallery(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const url = await uploadSingleFile(file);
        uploadedUrls.push(url);
      }

      const currentGallery = getValues("galleryImageUrls") || [];
      const nextGallery = [...currentGallery, ...uploadedUrls];

      setValue("galleryImageUrls", nextGallery, { shouldValidate: true });
      setGalleryPreviews(nextGallery);

      if (!getValues("coverImageUrl") && uploadedUrls[0]) {
        setValue("coverImageUrl", uploadedUrls[0], { shouldValidate: true });
        setImagePreview(uploadedUrls[0]);
      }
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Gallery upload failed"
      );
    } finally {
      setIsUploadingGallery(false);
      event.target.value = "";
    }
  }

  function removeGalleryImage(index: number) {
    const currentGallery = getValues("galleryImageUrls") || [];
    const nextGallery = currentGallery.filter((_, i) => i !== index);
    setValue("galleryImageUrls", nextGallery, { shouldValidate: true });
    setGalleryPreviews(nextGallery);
  }

  const onSubmit = async (data: CampaignFormInput) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "galleryImageUrls") {
          formData.append(key, JSON.stringify(value || []));
          return;
        }

        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (typeof formAction === "function") {
        await formAction(formData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-gray-100 bg-white p-5 shadow-md"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600">
            Campaign Title *
          </label>
          <input
            {...register("title")}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
            placeholder="Enter campaign title"
          />
          {errors.title && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600">
            URL Slug *
          </label>
          <input
            {...register("slug")}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
            placeholder="campaign-url-slug"
          />
          {errors.slug && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.slug.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">Auto-generated from title</p>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">
          Short Description *
        </label>
        <textarea
          {...register("shortDescription")}
          rows={2}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
          placeholder="Brief summary of the campaign..."
        />
        {errors.shortDescription && (
          <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3 w-3" />
            {errors.shortDescription.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">
          Full Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
          placeholder="Detailed description of the campaign..."
        />
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-600">
          Cover Image
        </label>

        <div className="flex gap-2">
          <input
            {...register("coverImageUrl")}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
            placeholder="Cover image URL"
          />

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            {isUploadingCover ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleCoverUpload}
              disabled={isUploadingCover}
            />
          </label>

          {imagePreview && (
            <button
              type="button"
              onClick={() => {
                setValue("coverImageUrl", "");
                setImagePreview("");
              }}
              className="rounded-lg border border-gray-200 px-3 py-2 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {imagePreview && (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <img
              src={imagePreview}
              alt="Cover preview"
              className="h-32 w-full object-cover"
              onError={() => setImagePreview("")}
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-gray-600">
            Gallery Images
          </label>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            {isUploadingGallery ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload Multiple
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleGalleryUpload}
              disabled={isUploadingGallery}
            />
          </label>
        </div>

        <input
          type="hidden"
          {...register("galleryImageUrls")}
        />

        {galleryPreviews.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {galleryPreviews.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="relative overflow-hidden rounded-lg border border-gray-200"
              >
                <img
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  className="h-28 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-red-600 shadow"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
            No gallery images uploaded yet.
          </div>
        )}

        {uploadError ? (
          <p className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3 w-3" />
            {uploadError}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600">
            Goal Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              step="0.01"
              {...register("goalAmount", {
                setValueAs: (v) => (v === "" ? null : Number(v)),
              })}
              className="w-full rounded-lg border border-gray-200 pl-8 pr-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600">
            Sort Order
          </label>
          <input
            type="number"
            {...register("sortOrder", { valueAsNumber: true })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
            placeholder="0"
          />
        </div>

        <div className="flex items-center">
          <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-gray-600">
            <input
              type="checkbox"
              {...register("isFeatured")}
              className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Featured Campaign
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600">
            Start Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              {...register("startDate")}
              className="w-full rounded-lg border border-gray-200 pl-8 pr-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600">
            End Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              {...register("endDate")}
              className="w-full rounded-lg border border-gray-200 pl-8 pr-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
        <Link
          href="/admin/campaigns"
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting || isUploadingCover || isUploadingGallery}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle className="h-3.5 w-3.5" />
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}