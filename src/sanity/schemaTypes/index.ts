import { type SchemaTypeDefinition } from "sanity";

import { blockContent } from "./blockContent";
import { category } from "./category";
import { blog } from "./blog";
import { author } from "./author";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blog, author, category, blockContent],
};
