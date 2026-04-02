import { createCampaignAction } from "../actions";
import CampaignForm from "./CampaignForm";

type CreateCampaignPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function CreateCampaignPage({
  searchParams,
}: CreateCampaignPageProps) {
  const params = (await searchParams) ?? {};

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Create Campaign</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Add a new NGO campaign or initiative.
        </p>
      </div>

      {params.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {params.error}
        </div>
      ) : null}

      <CampaignForm
        defaultValues={{
          title: "",
          slug: "",
          shortDescription: "",
          description: "",
          galleryImageUrls: [],
          coverImageUrl: "",
          goalAmount: null,
          status: "Draft",
          isFeatured: false,
          sortOrder: 0,
          startDate: "",
          endDate: "",
        }}
        formAction={createCampaignAction}
        submitLabel="Create Campaign"
      />
    </section>
  );
}