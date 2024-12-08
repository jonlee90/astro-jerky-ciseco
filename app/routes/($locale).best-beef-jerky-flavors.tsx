import { loadCollectionData } from "~/utils/collectionLoader";
import { CollectionPage } from "~/components/CollectionPage";
import { type LoaderFunctionArgs } from "@shopify/remix-oxygen";

export const loader = async (args: LoaderFunctionArgs) =>
  loadCollectionData({ collectionHandle: "best-beef-jerky-flavors", ...args });

export default CollectionPage;