import React from "react";
// import i18next from 'i18next';
// import { useTranslation } from 'react-i18next';
import i18next, { getDefaultLang } from "./i18n";
// let d3 = window.d3;
import PubSub from "pubsub-js";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from "axios";
import { PVSigV4Utils } from "./PVSigV4Utils";
import Keycloak from "keycloak-js";
import { CmsGetContentModelRes, GetContentModel, Field } from "./types";

// import * as d3 from "d3";

export interface PubSubCallback extends Function {
  (topic: string, data: any): void;
}

export interface PVComponentProps {
  url?: string | undefined;
  isNeighbour?: boolean;
  neighbourNamespace?: string;
  namespace?: string;
  subNamespace?: string;
  mountedSuccess?: boolean;
  awsSecretKeyId?: string;
  awsAccessKeyId?: string;
  auth?: any;
}

// const { t, i18n } = useTranslation();

class PontusComponent<
  T extends PVComponentProps,
  S
> extends React.PureComponent<T, S> {
  static kc?: Keycloak.KeycloakInstance;
  static counter = 0;
  protected url: string;
  protected req: CancelTokenSource | undefined;
  protected request: any;
  protected errorCounter: number;
  protected hRequest?: NodeJS.Timeout;
  protected oauth: any;

  // static getColorScale(minVal, maxVal)
  // {
  //   return scaleLinear.linear()
  //     .domain([minVal, (maxVal - minVal) / 2, maxVal])
  //     .range(['green', 'orange', 'red']);
  // }
  private topics: Record<string, number> = {};
  //
  private callbacksPerTopic: Record<string, PubSubCallback[]> = {};

  constructor(props: Readonly<any>) {
    super(props);
    this.errorCounter = 0;
    this.url = PontusComponent.getGraphURL(props);
  }

  static webinyApi = axios.create({
    baseURL: `https://d2ekewy9aiz800.cloudfront.net/`,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_WEBINY_API_TOKEN}`,
    },
  });

  static listModel = async (modelId: string, fields: Field[]) => {
    const refInputField = fields.filter(
      (el) => el.renderer.name === "ref-input"
    );

    const arrMap = await Promise.all(
      fields.map(async (field: Field) => {
        const findRefModel = (field: Field): string | undefined => {
          return field.settings?.models?.find((model) => model?.modelId)
            ?.modelId;
        };
        const objFields = field?.settings?.fields;

        const refModelVal = findRefModel(field);
        if (refModelVal) {
          const refModel = await PontusComponent.cmsGetContentModel(
            refModelVal
          );

          return `${field.fieldId}{${refModel.data.data.data.getContentModel.data.titleFieldId}}`;
        } else if (objFields) {
          console.log({ objFields });
          const objFieldsIds = await Promise.all(
            objFields.map(async (el) => {
              const refModelEl = findRefModel(el);
              if (refModelEl) {
                const objFieldRefModel =
                  await PontusComponent.cmsGetContentModel(refModelEl);
                return `${el.fieldId}{${objFieldRefModel.data.data.data.getContentModel.data.titleFieldId}}`;
              }
              return `${el.fieldId}`;
            })
          );
          return `${field.fieldId}{${objFieldsIds}}`;
        } else {
          return field.fieldId;
        }
      })
    );

    const modelIdFormatted =
      modelId[modelId.length - 1] !== "s" ? modelId + "s" : modelId;

    const res = await PontusComponent.webinyApi.post("cms/read/en-US", {
      query: `
  {
    list${PontusComponent.capitalizeFirstLetter(modelIdFormatted)} {
      data {
        id
        entryId
        createdOn
        savedOn
        createdBy {
          displayName
        }
        ownedBy {
          displayName
        } 
        ${arrMap}
      }
    }
  }
  `,
    });
    return res.data.data[
      `list${PontusComponent.capitalizeFirstLetter(modelIdFormatted)}`
    ].data;
  };

  static getContentModel = async (
    modelId?: string
  ): Promise<GetContentModel> => {
    if (!modelId) throw Error("Missing Model Id");
    const res = await PontusComponent.webinyApi.post("cms/read/en-US", {
      query: `{
    getContentModel (modelId: "${modelId}" ){
    
        data {
  titleFieldId    
        modelId
        fields {
          fieldId
          id 
          storageId
          label
          helpText
          placeholderText
          type
          multipleValues
          settings
          predefinedValues {
            enabled
            values{
              label
              value
              selected
            }
          }
          renderer{
            name
          }
          validation {
            name
            message
            settings
          }
          listValidation {
            name
            message
            settings
          }
          
        }
      }
    }
  }
  `,
    });
    const { data } = res.data.data.getContentModel;
    console.log(data);
    return data;
    // listModel(modelId, fields);
  };

  static cmsGetContentModel = async (
    modelId: string
  ): Promise<AxiosResponse<CmsGetContentModelRes, any>> => {
    // modelId = modelId[modelId.length-1] === "s" ? modelId.slice(0,-1) : modelId
    console.log(modelId);

    const data = PontusComponent.webinyApi.post("cms/manage/en-US", {
      query: `query CmsGetContentModel($modelId: ID!) {
    getContentModel(modelId: $modelId) {
      data {
        name
        group {
          id
          name
          __typename
        }
        description
        modelId
        savedOn
        titleFieldId
        lockedFields
        layout
        fields {
          id
          fieldId
          storageId
          type
          label
          placeholderText
          helpText
          predefinedValues {
            enabled
            values {
              label
              value
              selected
              __typename
            }
            __typename
          }
          multipleValues
          renderer {
            name
            __typename
          }
          validation {
            name
            settings
            message
            __typename
          }
          listValidation {
            name
            settings
            message
            __typename
          }
          settings
          __typename
        }
        __typename
      }
      error {
        message
        code
        data
        __typename
      }
      __typename
    }
  }`,
      variables: {
        modelId,
      },
    });

    return data;
  };

  static getModels = async () => {
    const data = PontusComponent.webinyApi.post("cms/read/en-US", {
      query: `{
    listContentModels {
      data {
        name
        modelId
        group {
          name
          id
        }
      }
    }
  }`,
    });
    return data;
  };

  static capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static recursiveSplitTranslateJoin(
    itemToSplit: string,
    splitArrayPattern: string[]
  ): string {
    const localSplitArrayPattern = Array.from(splitArrayPattern);
    const splitPattern = localSplitArrayPattern.shift();
    if (!splitPattern) {
      return i18next.t(itemToSplit);
    }

    const splitItem = itemToSplit.split(splitPattern ? splitPattern : "");
    for (let i = 0; i < splitItem.length; i++) {
      splitItem[i] = PontusComponent.recursiveSplitTranslateJoin(
        splitItem[i],
        localSplitArrayPattern
      );
    }

    const rejoined = splitItem.join(splitPattern);

    return PontusComponent.recursiveSplitTranslateJoin(
      rejoined,
      localSplitArrayPattern
    );
  }

  static t(
    str: string,
    conf: string[] | undefined = undefined
  ): string | undefined {
    if (!conf) {
      return i18next.t(str);
    } else {
      return PontusComponent.recursiveSplitTranslateJoin(str, conf);
    }
  }

  static decode = (str: string): string =>
    Buffer.from(str, "base64").toString("binary");

  static b64DecodeUnicode(str: string): string {
    return decodeURIComponent(
      Array.prototype.map
        .call(PontusComponent.decode(str), (c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }

  static escapeHTML(unsafeText: string): string {
    const div = document.createElement("div");
    div.innerText = unsafeText;
    let retVal = PontusComponent.replaceAll("<br>", "<br/>", div.innerHTML);
    retVal = PontusComponent.replaceAll('\\"', "'", retVal);
    retVal = PontusComponent.replaceAll("\\r\\n", "<br/>", retVal);
    retVal = PontusComponent.replaceAll("\\n", "<br/>", retVal);
    retVal = PontusComponent.replaceAll("\\t", "  ", retVal);
    retVal = PontusComponent.replaceAll('"[', "[", retVal);
    retVal = PontusComponent.replaceAll(']"', "]", retVal);
    retVal = PontusComponent.replaceAll("&nbsp;", " ", retVal);
    // retVal = retVal.replace(/(&#(\d+);)/g, function (match, capture, charCode)
    // {
    //   return String.fromCharCode(charCode);
    // });

    return retVal;
  }

  static replaceAll(
    searchString: string,
    replaceString: string,
    str: string
  ): string {
    if (str.split) {
      return str.split(searchString).join(replaceString);
    }
    return str;
  }

  static getGraphURL(props: any): string {
    // if (props.url)
    // {
    //   return props.url;
    // }
    // else if (props.baseURI)
    // {
    //   if (props.ownerDocument && props.ownerDocument.origin)
    //   {
    //     let uri = props.baseURI;
    //     let pvgdprGuiIndex = uri.indexOf('pvgdpr_gui');
    //
    //     if (pvgdprGuiIndex > 0)
    //     {
    //
    //       let originLen = props.ownerDocument.origin.length();
    //       let retVal = uri.substr(originLen, pvgdprGuiIndex);
    //
    //       retVal.concat('pvgdpr_graph');
    //
    //       return retVal;
    //     }
    //   }
    // }
    // return "/gateway/sandbox/pvgdpr_graph";
    return PontusComponent.getURLGeneric(props, "home/gremlin");
  }

  static getRestEdgeLabelsURL(props: any): string {
    return PontusComponent.getURLGeneric(props, `home/edge_labels`);
  }

  static isLocalhost(): boolean {
    return (
      window?.location?.hostname === "localhost" ||
      window?.location?.hostname === "127.0.0.1"
    );
  }

  static getRestVertexLabelsURL(props: any): string {
    return PontusComponent.getURLGeneric(props, `home/vertex_labels`);
  }

  static getRestNodePropertyNamesURL(props: any): string {
    return PontusComponent.getURLGeneric(props, "home/node_property_names");
  }

  static getRestTemplateRenderURL(props: any): string {
    return PontusComponent.getURLGeneric(props, "home/report/template/render");
  }

  static getRestReportRenderURL(props: any): string {
    return PontusComponent.getURLGeneric(props, "home/report/render");
  }

  static getRestPdfReportRenderURL(props: any): string {
    return PontusComponent.getURLGeneric(props, "home/report/pdf/render");
  }
  static getFormDataURL(props: any): string {
    return PontusComponent.getURLGeneric(props, "home/form/data");
  }
  static getRestURL(props: any): string {
    return PontusComponent.getURLGeneric(props, "home/records");
  }

  static getRestUrlAg(props: any): string {
    return PontusComponent.getURLGeneric(props, "home/agrecords");
  }

  static getURLGeneric(props: any, defaultSuffix: string): string {
    const pvgdprGuiStr = "pvgdpr_gui";
    if (props.url && props.url.length > 0) {
      return props.url;
    } else if (window.location && window.location.pathname) {
      const pvgdprGuiIndex = window.location.pathname.indexOf(pvgdprGuiStr);
      if (pvgdprGuiIndex > 0) {
        const retVal = window.location.pathname.substr(0, pvgdprGuiIndex);
        return retVal.concat(
          `${
            PontusComponent.isLocalhost() ? "pvgdpr_server/" : ""
          }${defaultSuffix}`
        );
      }
    }
    // else if (props.baseURI) {
    //   if (props.ownerDocument && props.ownerDocument.origin) {
    //     const uri = props.baseURI;
    //     const pvgdprGuiIndex = uri.indexOf(pvgdprGuiStr);
    //
    //     if (pvgdprGuiIndex > 0) {
    //       const originLen = props.ownerDocument.origin.length();
    //       const retVal = uri.substr(originLen, pvgdprGuiIndex);
    //
    //       return retVal.concat(`${PontusComponent.isLocalhost() ? 'pvgdpr_server/' : ''}${defaultSuffix}`);
    //     } else {
    //       return uri;
    //     }
    //   }
    // }
    return `${PontusComponent.getUrlPrefix()}/${defaultSuffix}`;
  }

  static getUrlPrefix(addMiddle = true): string {
    const proto = `${window.location.protocol || "http:"}//`;
    const portStr = window.location.port;
    const port = portStr ? `:${portStr}` : "";

    const host = `${window.location.hostname || "localhost"}`;
    const prefix = `${proto}${host}${port}`;
    const middle = `${
      PontusComponent.isLocalhost() && addMiddle
        ? "/gateway/sandbox/pvgdpr_server"
        : ""
    }`;

    return `${prefix}${middle}`;
  }

  static setItem(key: string, val: any) {
    localStorage.setItem(getDefaultLang() + key, val);
  }

  static getItem(
    key: string,
    defVal: any | undefined = undefined
  ): string | null {
    let retVal = localStorage.getItem(getDefaultLang() + key);
    if (!retVal && defVal) {
      PontusComponent.setItem(key, defVal);
      retVal = defVal;
    }
    return retVal;
  }

  static async getKeyCloak(): Promise<Keycloak.KeycloakInstance | undefined> {
    let err: any | undefined;
    let kc;
    // @ts-ignore
    if (!window.top.keycloakInstance) {
      try {
        PontusComponent.counter++;

        if (PontusComponent.counter === 1) {
          kc = Keycloak({
            // url: `${PontusComponent.getUrlPrefix(false)}/auth`,
            url: `/auth`,
            clientId: "test",
            realm: "pontus",
          });
          // kc.responseType = 'code id_token token';
          // kc.flow = 'standard';
          const inProgress = PontusComponent.getItem(
            "pv-keycloak-in-progress",
            "false"
          );

          let authenticated;
          if (inProgress !== "true") {
            PontusComponent.setItem("pv-keycloak-in-progress", "true");
            authenticated = await kc.init({
              adapter: "default",
              onLoad: "check-sso",
              enableLogging: true,
              messageReceiveTimeout: 100000,
              silentCheckSsoRedirectUri:
                PontusComponent.getUrlPrefix() +
                "/pv/silent_keycloak_sso_iframe",
              silentCheckSsoFallback: true,
              flow: "standard",

              // responseMode: 'code id_token token'
            });
            if (!authenticated) {
              await kc.login({
                prompt: "login",
              });

              await kc.loadUserInfo();
            }
            // PontusComponent.setItem('pv-keycloak-in-progress', 'false');

            authenticated = true;
          }
          if (authenticated) {
            // @ts-ignore
            window.top.keycloakInstance = kc;
            PontusComponent.setItem("pv-keycloak-in-progress", "false");

            // @ts-ignore
            return window.top.keycloakInstance;
          }
        }
        let retries = 10;
        // @ts-ignore
        while (!window.top.keycloakInstance && retries >= 0) {
          retries--;
          await new Promise((r) => setTimeout(r, 2000));
        }
      } catch (e) {
        if (kc) {
          await kc.login({
            prompt: "login",
          });

          // @ts-ignore
          window.top.keycloakInstance = kc;
          PontusComponent.setItem("pv-keycloak-in-progress", "false");
        } else {
          PontusComponent.kc = undefined;
          PontusComponent.counter = 0;
          if (e) {
            console.error(e);
            err = e;
          }
        }

        // @ts-ignore
      }
      if (err?.message) {
        PontusComponent.setItem("pv-keycloak-in-progress", "false");
        return undefined;
      }
    }

    // @ts-ignore
    return window.top.keycloakInstance;
  }

  static async initKeycloak(): Promise<string | undefined> {
    // @ts-ignore
    const kc =
      window.top.keycloakInstance || (await PontusComponent.getKeyCloak());
    if (kc) {
      // axios.interceptors.request.use(async (config) => {
      try {
        if (kc.isTokenExpired(5)) {
          await kc.updateToken(5);
        }
        // config.headers.Authorization = 'Bearer ' + kc.idToken;
        return `Bearer ${kc.idToken}`;
      } catch (e) {
        kc.login();
      }
      // });
      // try {
      //   const success = await kc.updateToken(5);
      //
      //   if (success) {
      //     return 'Bearer ' + kc.idToken;
      //   }
      // } catch (e) {
      //   console.log(e);
      // }
    }
    return undefined;
  }

  ensureData = (id1: any, id2?: any) => {
    if (this.req) {
      this.req.cancel();
    }

    let url = this.url;
    if (this.hRequest) {
      clearTimeout(this.hRequest);
    }

    let self = this;

    this.hRequest = setTimeout(() => {
      let CancelToken = axios.CancelToken;
      self.req = CancelToken.source();

      // http.post(url)
      self
        .post(url, self.getQuery(id1, id2), {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          cancelToken: self.req.token,
        })
        .then(this.onSuccess)
        .catch((thrown) => {
          if (axios.isCancel(thrown)) {
            console.log("Request canceled", thrown.message);
          } else {
            this.onError(undefined, thrown);
          }
        });
    }, 50);
  };

  onSuccess = (resp: any) => {};

  onError = (event: any, thrown: Error) => {};

  on(topic: string, callback: PubSubCallback) {
    if (!this.topics[topic]) {
      this.topics[topic] = 0;
    }
    if (!this.callbacksPerTopic[topic]) {
      this.callbacksPerTopic[topic] = [];
    }
    if (
      !this.callbacksPerTopic[topic].some(
        (currCallback) => currCallback === callback
      )
    ) {
      PubSub.subscribe(topic, callback);
      this.callbacksPerTopic[topic].push(callback);
      this.topics[topic]++;
    }
  }

  off(topic: string, callback: PubSubCallback) {
    if (!this.topics[topic]) {
      return;
    }

    const found = this.callbacksPerTopic[topic].findIndex(
      (currCallback) => currCallback === callback
    );
    if (found === -1) {
      return;
    }

    PubSub.unsubscribe(callback);

    this.callbacksPerTopic[topic].splice(found, 1);

    this.topics[topic]--;
  }

  emit(topic: string, data: any) {
    PubSub.publish(topic, data);
  }

  getColorBasedOnLabel = (vLabel: string) => {
    if (vLabel.toUpperCase().startsWith("P")) {
      return "#440000";
    }

    if (vLabel.toUpperCase().startsWith("O")) {
      return "#0099cc";
    }
    if (vLabel.toUpperCase().startsWith("L")) {
      return "#ffaa00";
    }

    if (vLabel.toUpperCase().startsWith("E")) {
      return "#004433";
    }

    return "#595959";
  };

  stringify = (obj: object) => {
    let cache: any[] = [];

    const stringifyFilter = (key: string, value: any) => {
      if (key === "chartInstance" || key === "canvas" || key === "chart") {
        return;
      }

      if (typeof value === "object" && value !== null) {
        if (cache && cache.indexOf(value) !== -1) {
          // Duplicate reference found
          try {
            // If this value does not reference a parent it can be deduped
            return JSON.parse(JSON.stringify(value));
          } catch (error) {
            // discard key if value cannot be deduped
            return;
          }
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    };

    const state = JSON.stringify(obj, stringifyFilter);
    cache = [];

    return state;
  };

  async post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R> {
    if (
      (this.props as unknown as any)?.awsAccessKeyId &&
      (this.props as unknown as any)?.awsSecretKeyId
    ) {
      const props = this.props as unknown as PVComponentProps;
      config = PVSigV4Utils.getRequestConfig(
        {
          AccessKeyId: props.awsAccessKeyId!,
          SecretAccessKey: props.awsSecretKeyId!,
        },
        config!
      );
    } else if (
      (
        this
          .props as unknown as /* PanelOptionsEditorProps<PVComponentProps> */ any
      )?.context?.options?.awsAccessKeyId &&
      (
        this
          .props as unknown as /* PanelOptionsEditorProps<PVComponentProps> */ any
      )?.context?.options?.awsSecretKeyId
    ) {
      const props = this.props as unknown as any;
      config = PVSigV4Utils.getRequestConfig(
        {
          AccessKeyId: props.context.options.awsAccessKeyId!,
          SecretAccessKey: props.context.options.awsSecretKeyId!,
        },
        config!
      );
    }

    if (config) {
      try {
        const authHeader = await PontusComponent.initKeycloak();
        if (authHeader) {
          config!.headers = {
            Authorization: authHeader,
            ...config!.headers,
          };
        }
      } catch (e) {
        console.error(e);
        delete config!.headers["Authorization"];
      }
    }

    return axios.post<T, R>(url, data, config);

    // const srv = getBackendSrv();
    // const resp = await srv
    //   .fetch({
    //     url: url,
    //     data: data,
    //     method: 'POST',
    //     credentials: 'same-origin',
    //     responseType: 'json',
    //     headers: config?.headers as Record<string, any>,
    //     showErrorAlert: true,
    //     showSuccessAlert: true,
    //     hideFromInspector: false,
    //     params: config?.params,
    //     retry: 5,
    //   })
    //   .toPromise();
    //
    // const finalResp: AxiosResponse<any> = {
    //   data: resp.data,
    //   status: resp.status,
    //   statusText: resp.statusText,
    //   headers: resp.headers,
    //   config: config!,
    //   request: '',
    // };
    // return finalResp as unknown as R;
  }

  protected getQuery = (
    eventId: any,
    id2?: any
  ):
    | { bindings: Record<string, any>; gremlin: string }
    | { refEntryId: string; templateId: string } => {
    return { bindings: { hello: "world" }, gremlin: "" };
  };
}

// PontusComponent.initKeycloak()
//   .then(() => console.log(`Keycloak Initialised`))
//   .catch((e) => {
//     console.log(e);
//     console.log(`error: ${e.message}`);
//   });

export default PontusComponent;
