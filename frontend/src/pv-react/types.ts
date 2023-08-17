import { PVGridColDef } from './PVGrid';
import PontusComponent, { PVComponentProps } from './PontusComponent';
import { PVGridColSelectorProps } from './PVGridColSelector';
// import { ComponentSchema, ExtendedComponentSchema } from 'formiojs';
// declare module 'react-formio';

export interface PVFormDataValues {
  label: string;
  value: string;
  selected?: boolean;
}
export interface PVFormData {
  type: string;
  subtype?: string;
  label: string;
  className?: string;
  name?: string;
  access?: boolean | string;
  default?: any;
  requireValidOption?: boolean;
  inline?: boolean;
  multiple?: boolean;
  values?: PVFormDataValues;
  other?: boolean;
  description?: string;
  placeholder?: string;
  value?: string;
  maxlength?: number;
  rows?: number;
  role?: string;
  toggle?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  userData?: string[];
}
export interface PVFormBuilderEditorProps extends PVGridColSelectorProps {
  components: PVFormData[];
  init: any;
  neighbourId?: string;
  dataSettings?: {
    dataType?: string;
    colSettings?: PVGridColDef[];
  };
}

export const scTypes = ['au', 'br', 'de'] as const;
export type Market = typeof scTypes[number];

export const ScoreTypeValues = [
  'Awareness',
  'Children',
  'Consent',
  'DataBreach',
  'DataProtnOfficer',
  'IndividualsRights',
  'InformationYouHold',
  'International',
  'LawfulBasis',
  'PrivacyImpactAssessment',
  'PrivacyNotices',
  'SubjectAccessRequest',
] as const;

export type ScoreType = typeof ScoreTypeValues[number];

export const WidgetTypeValues = [
  'PVGDPRScore',
  'PVGrid',
  'PVDataGraph',
  'PVReportPanel',
  'PVInfraGraph',
  'GremlinQueryEditor',
  'GremlinQueryResults',
  'AwarenessPieChart',
  'PVFormPanel',
] as const;

export type WidgetType = typeof WidgetTypeValues[number];

export interface SimpleOptions {
  namespace: string;
  directUrl?: string;
  serviceUrl?: string;
  gridUrl?: string;
  isNeighbour: boolean;
  neighbourNamespace: string;
  scoreType?: ScoreType;
  showIcon?: boolean;
  showText?: boolean;
  showExplanation?: boolean;
  showGauge?: boolean;
  widgetType: WidgetType;
  dataType?: string;
  colSettings?: PVGridColDef[];
  customFilter?: string;
  filter?: string;
  useAws: boolean;
  awsAccessKeyId?: string;
  awsSecretKeyId?: string;
  dataSettings?: {
    dataType?: string;
    colSettings?: PVGridColDef[];
  };
  templateText?: string;
  components?: any;
  pvFormBuilderEditorProps?: PVFormBuilderEditorProps;
}

export const urlPrefix = `${PontusComponent.getUrlPrefix()}/`;
export const defaults: SimpleOptions = {
  namespace: 'namespace',
  gridUrl: `${urlPrefix}home/agrecords`,
  directUrl: `${urlPrefix}home/gremlin`,
  serviceUrl: urlPrefix,
  isNeighbour: false,
  neighbourNamespace: 'neighbour',
  widgetType: 'PVGrid',
  useAws: false,
  awsAccessKeyId: '',
  awsSecretKeyId: '',
  dataSettings: {
    dataType: 'Person.Organisation',
    colSettings: [
      {
        field: '#Person.Organisation.Name',
        id: '#Person.Organisation.Name',
        name: 'Name',
        sortable: true,
      },
      {
        field: '#Person.Organisation.Type',
        id: '#Person.Organisation.Type',
        name: 'Type',
        sortable: true,
      },
    ],
  },
  templateText: '',
};

export interface PVNamespaceProps extends PVComponentProps {
  url?: string;
  isNeighbour?: boolean;
  neighbourNamespace?: string;
  namespace?: string;
  subNamespace?: string;
}

export interface CmsGetContentModelRes {
  data:       CmsGetContentModel;
  status:     number;
  statusText: string;
  headers:    Headers;
  config:     Config;
  request:    Request;
}

export interface Config {
  transitional:      Transitional;
  adapter:           string[];
  transformRequest:  null[];
  transformResponse: null[];
  timeout:           number;
  xsrfCookieName:    string;
  xsrfHeaderName:    string;
  maxContentLength:  number;
  maxBodyLength:     number;
  env:               Request;
  headers:           ConfigHeaders;
  baseURL:           string;
  method:            string;
  url:               string;
  data:              string;
}

export interface Request {
}

export interface ConfigHeaders {
  Accept:         string;
  "Content-Type": string;
  Authorization:  string;
}

export interface Transitional {
  silentJSONParsing:   boolean;
  forcedJSONParsing:   boolean;
  clarifyTimeoutError: boolean;
}

export interface CmsGetContentModel {
  data: CmsGetContentModelData;
}

export interface CmsGetContentModelData {
  getContentModel: GetContentModel;
}

export interface GetContentModel {
  data:       GetContentModelData;
  error?:      string;
  __typename: string;
}

export interface GetContentModelData {
  name:         string;
  group:        Group;
  description:  string;
  modelId:      string;
  savedOn?:     string;
  titleFieldId: string;
  lockedFields?: any;
  layout:       Array<string[]>;
  fields:       Field[];
  __typename:   string;
}

export interface Field {
  id:               string;
  fieldId:          string;
  storageId:        string;
  type:             string;
  label:            string;
  placeholderText:  string;
  helpText?:         string;
  predefinedValues?: PredefinedValues;
  multipleValues?:   boolean;
  renderer:         Renderer;
  validation?:       Validation[];
  listValidation?:  boolean;
  settings?:         Settings;
  __typename:       FieldTypename;
}

export enum FieldTypename {
  CMSContentModelField = "CmsContentModelField",
}

export interface PredefinedValues {
  enabled:    boolean;
  values:     Value[];
  __typename: string;
}

export interface Value {
  label:      string;
  value:      string;
  selected:   boolean;
  __typename: ValueTypename;
}

export enum ValueTypename {
  CMSPredefinedValue = "CmsPredefinedValue",
}

export interface Renderer {
  name:       string;
  __typename: RendererTypename;
}

export enum RendererTypename {
  CMSFieldRenderer = "CmsFieldRenderer",
}

export interface Settings {
  models?: Model[];
  fields?: Field[];
  type?:   string;
}

export interface Model {
  modelId: string;
}

export interface Validation {
  name:       string;
  settings?:   Settings;
  message:    string;
  __typename: string;
}

export interface Group {
  id:         string;
  name:       string;
  __typename: string;
}

export type Headers = Record<string,string> 

// export interface Headers {
  // "cache-control": string;
  // "content-type":  string;
// }
