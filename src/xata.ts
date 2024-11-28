// Generated by Xata Codegen 0.30.1. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "categoryTable",
    checkConstraints: {
      categoryTable_xata_id_length_xata_id: {
        name: "categoryTable_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {},
    primaryKey: [],
    uniqueConstraints: {
      _pgroll_new_categoryTable_xata_id_key: {
        name: "_pgroll_new_categoryTable_xata_id_key",
        columns: ["xata_id"],
      },
    },
    columns: [
      {
        name: "name",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
  {
    name: "stockTable",
    checkConstraints: {
      stockTable_xata_id_length_xata_id: {
        name: "stockTable_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {},
    primaryKey: [],
    uniqueConstraints: {
      _pgroll_new_stockTable_xata_id_key: {
        name: "_pgroll_new_stockTable_xata_id_key",
        columns: ["xata_id"],
      },
    },
    columns: [
      {
        name: "category",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "name",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "price",
        type: "int",
        notNull: false,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "quantity",
        type: "int",
        notNull: false,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "sales-quantity",
        type: "int",
        notNull: false,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "salesCount",
        type: "int",
        notNull: false,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "salesQuantity",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type CategoryTable = InferredTypes["categoryTable"];
export type CategoryTableRecord = CategoryTable & XataRecord;

export type StockTable = InferredTypes["stockTable"];
export type StockTableRecord = StockTable & XataRecord;

export type DatabaseSchema = {
  categoryTable: CategoryTableRecord;
  stockTable: StockTableRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL: "https://Imanol-s-workspace-i3tp1f.us-east-1.xata.sh/db/stock",
  apiKey: process.env.XATA_API_KEY, 
  branch: "main",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
