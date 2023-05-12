import { ColumnApi, GridApi } from "ag-grid-community";
import { IJsonModel } from "flexlayout-react";

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

export interface ModelContentList {
  data: ModelContentListData[];
  meta: Meta;
}

export interface ModelContentListData {
  id: string;
  entryId: string;
  createdOn: Date;
  savedOn: Date;
  createdBy: string;
  ownedBy: string;
  subsistemaReferencia: string;
}

export interface Meta {
  cursor: null;
  totalCount: number;
}

export interface ModelColName {
  id: string;
  fieldId: string;
  storageId: string;
  type: string;
  label: string;
  placeholderText: string;
  helpText: null;
  predefinedValues: null;
  multipleValues: null;
  renderer: Renderer;
  validation: Validation[];
  listValidation: null;
  settings: null;
  __typename: string;
}

export interface Renderer {
  name: string;
  __typename: string;
}

export interface Validation {
  name: string;
  settings: null;
  message: string;
  __typename: string;
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
  cmp?: WebinyModel;
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
