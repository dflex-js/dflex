import { siteUrl } from "../../config";

export default (slug) =>
  slug == null ? null : `${siteUrl}/${slug.replace(/^\//, "")}`;
