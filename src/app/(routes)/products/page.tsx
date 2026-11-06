import { getValidatedSearchParams } from "@/utils/parseSearchParams";
import { redirect } from "next/navigation";

import ProductView from "./_modules/views/product-view";

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const rawSearchParams = await props.searchParams;
  const validatedParams = getValidatedSearchParams(rawSearchParams);

  // Check if we need to redirect due to invalid params
  const rawCategory = typeof rawSearchParams.category === "string" 
    ? rawSearchParams.category 
    : undefined;
  const rawFilter = typeof rawSearchParams.filter === "string"
    ? rawSearchParams.filter
    : undefined;

  const needsRedirect = 
    (rawCategory && rawCategory !== validatedParams.category) ||
    (rawFilter && rawFilter !== validatedParams.filter);

  if (needsRedirect) {
    const newParams = new URLSearchParams();
    newParams.set("category", validatedParams.category);
    newParams.set("filter", validatedParams.filter);
    redirect(`/?${newParams.toString()}`);
  }

  return (
    <div>
      <ProductView
        categoryParam={validatedParams.category}
        filterParam={validatedParams.filter}
      />
    </div>
  );
}