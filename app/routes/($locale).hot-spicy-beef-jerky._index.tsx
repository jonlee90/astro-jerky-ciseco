import { loadCollectionData } from "~/utils/collectionLoader";
import { CollectionPage } from "~/components/CollectionPage";
import { MetaArgs, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { getSeoMeta } from "@shopify/hydrogen";

export const loader = async (args: LoaderFunctionArgs) =>
  loadCollectionData({ collectionHandle: "hot-spicy-beef-jerky", ...args });


export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default CollectionPage;