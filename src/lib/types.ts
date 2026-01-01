import { DocumentType } from "@prisma/client";

export type DocumentTypeConfig = {
  type: DocumentType;
  label: string;
  description?: string;
};
