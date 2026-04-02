"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { deleteCampaignAction } from "./actions";

type DeleteButtonProps = {
  campaignId: string;
  campaignTitle: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Trash2 className="h-3.5 w-3.5" />
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

export default function DeleteButton({ campaignId, campaignTitle }: DeleteButtonProps) {
  const handleDelete = async (formData: FormData) => {
    if (confirm(`Are you sure you want to delete "${campaignTitle}"? This action cannot be undone.`)) {
      await deleteCampaignAction(formData);
    }
  };

  return (
    <form action={handleDelete}>
      <input type="hidden" name="campaignId" value={campaignId} />
      <SubmitButton />
    </form>
  );
}