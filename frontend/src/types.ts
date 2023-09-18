import { ColumnApi, GridApi } from 'ag-grid-community';
import { IJsonModel } from 'flexlayout-react';
import { P } from 'vitest/dist/types-5872e574';
import { Table } from './pontus-api/typescript-fetch-client-generated';

export interface AgGrigFirstDataRenderedEvent<TData = any, TContext = any> {
  // Index of the first rendered row
  firstRow: number;
  // Index of the last rendered row
  lastRow: number;
  // The grid api.
  api: GridApi<TData>;
  // The column api.
  columnApi: ColumnApi;
  // Application context as set on `gridOptions.context`.
  context: TContext;
  // Event identifier
  type: string;
}

export interface IListModelResponse {
  data: IListModelResponseData[];
  meta: Meta;
}

export interface IListModelResponseData {
  id: string;
  entryId: string;
  createdOn: string;
  savedOn: string;
  createdBy: {
    displayName: string;
  };
  ownedBy: {
    displayName: string;
  };
  [key: string]: unknown;
}

export interface UnknownKey {
  [key: string]: unknown;
}

export interface Meta {
  cursor: null;
  totalCount: number;
}

// export interface ModelColName {
//   id: string;
//   fieldId: string;
//   storageId: string;
//   type: string;
//   label: string;
//   placeholderText: string;
//   helpText: null;
//   predefinedValues: null;
//   multipleValues: null;
//   renderer: Renderer;
//   validation?: Validation[];
//   listValidation: null;
//   settings: null;
//   __typename: string;
// }
export interface DataRoot {
    id:       string;
    name:     string;
    type:     string;
    path:     string;
    children: Child[];
}

export interface Child {
    id:        string;
    name:      string;
    type:      string;
    path:       string;
    children?: Child[];
}

export interface Renderer {
  name: string;
  __typename: string;
}

export interface Validation {
  name: string;
  settings?: ValidationSettings;
  message: string;
  __typename: string;
}

export interface ValidationSettings {
  flags: boolean;
  preset: string;
  regex?: boolean;
}

export interface CmsEntriesList {
  content: CmsEntriesListContent;
}

export interface CmsEntriesListContent {
  data: CmsEntriesListContentData[];
  meta: CmsEntriesListContentMeta;
  error: null;
  __typename: string;
}

export interface CmsEntriesListContentData {
  id: string;
  savedOn: Date;
  meta: CmsEntriesListContentDataMeta;
  basesLegaisReferencia: string;
  __typename: string;
}

export interface CmsEntriesListContentDataMeta {
  title: string;
  publishedOn: Date;
  version: number;
  locked: boolean;
  status: string;
  __typename: string;
}

export interface CmsEntriesListContentMeta {
  cursor: null;
  hasMoreItems: boolean;
  totalCount: number;
  __typename: string;
}

export interface FlexLayoutCmp {
  componentName: string;
  cmp?: Table;
}

export interface WebinyRefInput {
  modelId: string;
  id: string;
}

export interface WebinyModel {
  name: string;
  modelId: string;
  group: WebinyModelGroup;
}

export interface WebinyModelGroup {
  name: string;
  id: string;
}

export interface Dashboard {
  gridState: IJsonModel;
  id: string;
  name: string;
}

export interface ICmsGetContentModel {
  data: ICmsGetContentModelData;
  error: null;
  __typename: string;
}

export interface ICmsGetContentModelData {
  name: string;
  group: ICmsGetContentModelDataGroup;
  description: string;
  modelId: string;
  savedOn: null;
  titleFieldId: string;
  lockedFields: null;
  layout: Array<string[]>;
  fields: ICmsGetContentModelDataField[];
  __typename: string;
}

export interface ICmsGetContentModelDataField {
  id: string;
  fieldId: string;
  storageId: string;
  type: string;
  label: string;
  placeholderText: null | string;
  helpText: null | string;
  predefinedValues: ICmsGetContentModelFieldPredefinedValues | null;
  multipleValues: null;
  renderer: Renderer;
  validation?: Validation[];
  listValidation: null;
  settings?: {
    models?: {
      modelId: string;
    }[];
    fields?: ICmsGetContentModelDataField[];
  };
  __typename: string;
}

export interface ICmsGetContentModelFieldPredefinedValues {
  enabled: boolean;
  values: Value[];
  __typename: string;
}

export interface Value {
  label: string;
  value: string;
  selected: null;
  __typename: Typename;
}

export enum Typename {
  CMSPredefinedValue = 'CmsPredefinedValue',
}

export interface Renderer {
  name: string;
  __typename: string;
}

export interface ICmsGetContentModelDataFieldValidation {
  name: string;
  settings: ICmsGetContentModelDataFieldSettings | null;
  message: string;
  __typename: string;
}

export interface ICmsGetContentModelDataFieldSettings {
  flags?: boolean;
  preset: string;
  regex: boolean | string;
}

export interface ICmsGetContentModelDataGroup {
  id: string;
  name: string;
  __typename: string;
}
