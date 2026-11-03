import { resolveListingParams } from "@/utils/resolve-listing-params";
import HomepageView from "./_modules/views/homepage-view";

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Unknown ?category= values redirect to the clean "/" URL.
  const { category } = await resolveListingParams(props.searchParams, "/");

  return <HomepageView categoryParam={category} />;
}
