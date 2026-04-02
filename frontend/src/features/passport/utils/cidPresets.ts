import type { CidComposerFormField } from "../components/CidComposer";

export type CidPresetAccent = "sky" | "orange" | "emerald" | "rose";
export type CidPresetKey = "passport" | "asset" | "stamp" | "reason" | "policy" | "schema";

export type CidPreset = {
  accent: CidPresetAccent;
  defaultPayload: Record<string, unknown>;
  description: string;
  fieldKey: string;
  fileName: string;
  formFields: CidComposerFormField[];
  key: CidPresetKey;
  label: string;
  targetLabel: string;
  usage: string;
};

export const CID_PRESETS: CidPreset[] = [
  {
    accent: "emerald",
    defaultPayload: {
      name: "",
      description: "",
      issuer: "",
      image: "",
      attributes: [],
    },
    description: "Use this for the passport-level display card, summary, issuer, and media.",
    fieldKey: "global_passport_metadata",
    fileName: "passport-metadata.json",
    formFields: [
      { key: "name", label: "Name", placeholder: "Digital Product Passport" },
      {
        key: "description",
        label: "Description",
        placeholder: "Summarize the passport's purpose and display context.",
        type: "textarea",
      },
      { key: "issuer", label: "Issuer", placeholder: "DeProof Lab" },
      { key: "image", label: "Image URL", placeholder: "https://... or ipfs://..." },
      {
        helper: "Enter one attribute per line, for example material: recycled aluminum",
        key: "attributes",
        label: "Attributes",
        placeholder: "material: recycled aluminum\norigin: Shenzhen",
        type: "list",
      },
    ],
    key: "passport",
    label: "Passport Metadata",
    targetLabel: "passportMetadataCID",
    usage: "Usually used for passportMetadataCID.",
  },
  {
    accent: "emerald",
    defaultPayload: {
      serialNumber: "",
      category: "",
      manufacturer: "",
      attachments: [],
    },
    description: "Use this for asset parameters, serial numbers, manufacturer data, and attachments.",
    fieldKey: "global_asset_metadata",
    fileName: "asset-metadata.json",
    formFields: [
      { key: "serialNumber", label: "Serial Number", placeholder: "SN-2026-0001" },
      { key: "category", label: "Category", placeholder: "Battery Pack" },
      { key: "manufacturer", label: "Manufacturer", placeholder: "ACME Manufacturing" },
      {
        helper: "Enter one attachment per line. PDF, image, IPFS, and HTTPS links all work.",
        key: "attachments",
        label: "Attachments",
        placeholder: "ipfs://...\nhttps://...",
        type: "list",
      },
    ],
    key: "asset",
    label: "Asset Metadata",
    targetLabel: "assetMetadataCID",
    usage: "Usually used for assetMetadataCID.",
  },
  {
    accent: "orange",
    defaultPayload: {
      summary: "",
      details: "",
      attachments: [],
      operator: "",
    },
    description: "Use this for maintenance, inspection, certification, and other stamp issuance details.",
    fieldKey: "global_stamp_metadata",
    fileName: "stamp-metadata.json",
    formFields: [
      { key: "summary", label: "Summary", placeholder: "Describe this record in one sentence." },
      {
        key: "details",
        label: "Details",
        placeholder: "Add process notes, findings, and supporting evidence.",
        type: "textarea",
      },
      { key: "operator", label: "Operator", placeholder: "Inspector Team A" },
      {
        helper: "Enter one attachment or reference per line.",
        key: "attachments",
        label: "Attachments",
        placeholder: "ipfs://...\nhttps://...",
        type: "list",
      },
    ],
    key: "stamp",
    label: "Stamp Metadata",
    targetLabel: "metadataCID",
    usage: "Usually used for metadataCID during issuance.",
  },
  {
    accent: "rose",
    defaultPayload: {
      summary: "",
      reason: "",
      evidence: [],
      operator: "",
    },
    description: "Use this for revocation reasons, case notes, evidence, and operator attribution.",
    fieldKey: "global_revocation_reason",
    fileName: "stamp-revocation.json",
    formFields: [
      { key: "summary", label: "Summary", placeholder: "Why is this stamp being revoked?" },
      {
        key: "reason",
        label: "Reason Details",
        placeholder: "Add the detailed revocation rationale and incident context.",
        type: "textarea",
      },
      { key: "operator", label: "Operator", placeholder: "Revocation Desk A" },
      {
        helper: "Enter one evidence or reference link per line.",
        key: "evidence",
        label: "Evidence",
        placeholder: "ipfs://...\nhttps://...",
        type: "list",
      },
    ],
    key: "reason",
    label: "Revocation Reason",
    targetLabel: "reasonCID",
    usage: "Usually used for reasonCID during revocation.",
  },
  {
    accent: "sky",
    defaultPayload: {
      summary: "",
      rules: [],
      references: [],
      owner: "",
    },
    description: "Use this for issuer rules, policy explanations, and supporting references.",
    fieldKey: "global_policy_metadata",
    fileName: "issuer-policy.json",
    formFields: [
      { key: "summary", label: "Policy Summary", placeholder: "Summarize the policy in one sentence." },
      {
        helper: "Enter one rule per line, for example passportType must be vehicle",
        key: "rules",
        label: "Rules",
        placeholder: "passportType must be vehicle\nissuer must be verified",
        type: "list",
      },
      {
        helper: "Enter one supporting document or link per line.",
        key: "references",
        label: "References",
        placeholder: "ipfs://...\nhttps://...",
        type: "list",
      },
      { key: "owner", label: "Owner", placeholder: "Policy Committee" },
    ],
    key: "policy",
    label: "Policy Document",
    targetLabel: "policyCID",
    usage: "Usually used for policyCID.",
  },
  {
    accent: "sky",
    defaultPayload: {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      title: "",
      type: "object",
      properties: {},
      required: [],
    },
    description: "Use this for stamp type schema definitions and other structured validation rules.",
    fieldKey: "global_schema_metadata",
    fileName: "stamp-type-schema.json",
    formFields: [
      { key: "$schema", label: "$schema", placeholder: "https://json-schema.org/..." },
      { key: "title", label: "Schema Title", placeholder: "Inspection Stamp Schema" },
      { key: "type", label: "Root Type", placeholder: "object" },
      {
        key: "properties",
        label: "properties",
        placeholder: "Switch to JSON mode when you need to edit a full properties object.",
        type: "textarea",
      },
      {
        helper: "Enter one required field name per line.",
        key: "required",
        label: "required",
        placeholder: "fieldA\nfieldB",
        type: "list",
      },
    ],
    key: "schema",
    label: "Schema Document",
    targetLabel: "schemaCID",
    usage: "Simple fields work in form mode. Use JSON mode for full schemas.",
  },
];

export const CID_PRESET_BY_KEY = CID_PRESETS.reduce<Record<CidPresetKey, CidPreset>>(
  (accumulator, preset) => {
    accumulator[preset.key] = preset;
    return accumulator;
  },
  {} as Record<CidPresetKey, CidPreset>,
);
