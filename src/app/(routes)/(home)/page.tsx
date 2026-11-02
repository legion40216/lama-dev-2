import HomepageView from "./_modules/views/homepage-view";
import { getValidatedSearchParams } from "@/utils/parseSearchParams";
import { redirect } from "next/navigation";

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. Await the params (Next.js 15 Requirement)
  const rawSearchParams = await props.searchParams;

  // 2. Run the validation
  // If raw is "red", validated.category will be "all" (or your first category)
  const validatedParams = getValidatedSearchParams(rawSearchParams);

  // 3. CHECK FOR REDIRECT
  // We check if the raw parameter matches the valid one.
  // We use safe access (?) because rawSearchParams.category might be undefined or an array.
  const rawCategory = typeof rawSearchParams.category === "string" 
    ? rawSearchParams.category 
    : undefined;

  // If there is a raw value (e.g. "red") AND it doesn't match the valid one ("all")
  if (rawCategory && rawCategory !== validatedParams.category) {
    const newParams = new URLSearchParams();
    
    // Reconstruct the valid URL
    newParams.set("category", validatedParams.category);
    
    // Redirect the browser to the clean URL
    redirect(`/?${newParams.toString()}`);
  }

  return (
    <div>
      <HomepageView categoryParam={validatedParams.category} />
    </div>
  );
}