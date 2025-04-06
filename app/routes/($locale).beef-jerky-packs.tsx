import { loadCollectionData } from "~/utils/collectionLoader";
import { MetaArgs, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { getSeoMeta } from "@shopify/hydrogen";
import { PacksPage } from "~/components/PacksPage";

export const loader = async (args: LoaderFunctionArgs) =>
  loadCollectionData({ collectionHandle: "beef-jerky-packs", ...args });


export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default PacksPage;