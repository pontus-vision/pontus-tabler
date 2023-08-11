import axios, { AxiosResponse } from 'axios';

// @ts-ignore
import $ from 'jquery';
import React, { createRef } from 'react';
import PontusComponent, { PubSubCallback } from './PontusComponent';
import { PVFormData, PVNamespaceProps } from './types';
import { PVGridColDef } from './PVGrid';
import { Button } from 'semantic-ui-react';
// @ts-ignore

window.jQuery = $;
// @ts-ignore
window.$ = $;
require('jquery-ui-sortable');
require('formBuilder');
require('formBuilder/dist/form-render.min');
import ReactResizeDetector from 'react-resize-detector';

// require('formRender');

// import './FormBuilder.scss';
// import 'formiojs/dist/formio.form.min.css';
// import 'formiojs/dist/formio.embed.css';
// import 'formiojs/dist/formio.full.min.css';
// import './formBuilder.css';

export interface PVFormBuilderProps extends PVNamespaceProps {
  components: PVFormData[];
  init?: any;
  neighbourId?: string;
  columnDefs?: PVGridColDef[];
  dataType?: string;
  height?: any;
  width?: any;
}

export interface PVFormBuilderState extends PVFormBuilderProps {
  operation?: 'create' | 'read' | 'update' | 'delete';
}

export class PVFormPanel extends PontusComponent<PVFormBuilderProps, PVFormBuilderState> {
  fb = createRef();
  formRender: any;
  private h_request: any;

  constructor(props: Readonly<PVFormBuilderProps>) {
    super(props);
    this.url = PontusComponent.getFormDataURL(props);
    this.state = { ...this.props };
  }

  createSubscriptions = (props: Readonly<PVFormBuilderProps>) => {
    if (props.isNeighbour) {
      this.on(`${props.neighbourNamespace}-pvgrid-on-click-row`, this.onClickNeighbour);
    }
  };

  removeSubscriptions = (props: Readonly<PVFormBuilderProps>) => {
    if (props.isNeighbour) {
      this.off(`${props.neighbourNamespace}-pvgrid-on-click-row`, this.onClickNeighbour);
    }
  };

  componentDidMount = () => {
    this.createSubscriptions(this.props);
    // require('formBuilder/dist/form-render.min.js');

    // @ts-ignore
    this.formRender = $(this.fb.current).formRender({
      formData: this.state.components || this.props.components,
    });
    // this.ensureData(undefined, this.props.templateText.templateText);
  };

  // componentDidUpdate = (prevProps: Readonly<PVGridProps>, prevState: Readonly<PVGridState>, snapshot?: any): void => {
  //   this.removeSubscriptions(prevProps);
  //   this.createSubscriptions(this.props);
  // };

  componentWillUnmount = () => {
    this.removeSubscriptions(this.props);
  };

  componentDidUpdate = (prevProps: Readonly<PVFormBuilderProps>) => {
    // Typical usage (don't forget to compare props):
    if (this.formRender && this.formRender.actions && this.formRender.actions.setData) {
      // if (
      //   JSON.stringify(this.props?.components) !== JSON.stringify(prevProps?.components) ||
      //   JSON.stringify(this.props?.columnDefs) !== JSON.stringify(prevProps?.columnDefs)
      // ) {
      if (this.state.components.length === 0 || this.state.operation === undefined) {
        // @ts-ignore
        this.formRender.actions.setData(this.props.components);
      } else {
        // @ts-ignore
        this.formRender.actions.setData(this.state.components);
      }

      // this.ensureData(this.state.contextId, this.props.templateText.templateText);
    } else if (this.formRender) {
      try {
        if (this.state.components.length === 0 || this.state.operation === undefined) {
          // @ts-ignore
          this.formRender('setData', this.props.components);
        } else {
          // @ts-ignore
          this.formRender('setData', this.state.components);
        }
      } catch (e) {
        // @ts-ignore
        this.formRender = $(this.fb.current).formRender({
          formData:
            this.state.components.length === 0 || this.state.operation === undefined
              ? this.props.components
              : this.state.components,
        });
      }
    } else {
      // @ts-ignore
      this.formRender = $(this.fb.current).formRender({
        formData:
          this.state.components.length === 0 || this.state.operation === undefined
            ? this.props.components
            : this.state.components,
      });
    }
  };

  onClickNeighbour: PubSubCallback = (topic: string, obj: any) => {
    this.ensureData(obj.id, 'read');
  };
  // decode = (str: string):string => Buffer.from(str, 'base64').toString('binary');
  // encode = (str: string):string => Buffer.from(str, 'binary').toString('base64');

  onCreate = () => {
    this.ensureData(this.state.neighbourId, 'create');
  };
  onDelete = () => {
    this.ensureData(this.state.neighbourId, 'delete');
  };
  onUpdate = () => {
    this.ensureData(this.state.neighbourId, 'update');
  };

  ensureData = (contextId: any, operation: 'create' | 'read' | 'update' | 'delete') => {
    if (this.req) {
      this.req.cancel();
    }

    if (operation === 'read' && !contextId) {
      this.setState({ ...this.state, neighbourId: contextId, operation: undefined });
      return;
    }
    this.setState({
      ...this.state,
      components: this.formRender.userData,
      neighbourId: contextId,
      operation: operation,
    });

    let url = this.url;
    if (this.h_request !== null) {
      clearTimeout(this.h_request);
    }

    let self = this;

    this.h_request = setTimeout(() => {
      let CancelToken = axios.CancelToken;
      self.req = CancelToken.source();

      this.post(
        url,
        {
          rid: contextId,
          components: this.state.components.filter((val: PVFormData) => {
            return val.name !== undefined;
          }),
          operation: operation,
          dataType: this.props.dataType,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          cancelToken: self.req.token,
        }
      )
        .then(this.onSuccess)
        .catch((thrown) => {
          if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
          } else {
            this.onError(thrown);
          }
        });
    }, 50);
  };
  onError = (err: Error) => {
    if (this.errorCounter > 5) {
      console.error('error loading data:' + err);
    } else {
      // this.ensureData(this.state.contextId, '');
    }
    this.errorCounter++;
  };

  onSuccess = (resp: AxiosResponse<any>) => {
    this.errorCounter = 0;

    try {
      if (resp.status === 200) {
        const componentsMap: Record<string, PVFormData> = {};
        const components = [...this.state.components];

        if (resp?.data?.components) {
          (resp.data.components as PVFormData[]).forEach((value: PVFormData) => {
            if (value.name) {
              componentsMap[value.name] = value;
              componentsMap[`#${value.name}`] = value;
            }
          });
        }
        components.forEach((value: PVFormData) => {
          if (value.name) {
            value.userData = componentsMap[value.name]?.userData || componentsMap[`#${value.name}`]?.userData;
          }
        });

        if (this.state.operation !== 'delete') {
          // const items = resp.data.base64Report;
          this.setState({
            ...this.state,
            components,
            neighbourId: resp?.data?.rid || this.state.neighbourId,
            // preview: Base64.decode(items),
          });
        } else {
          this.setState({
            ...this.state,
            components: this.props.components,
            neighbourId: undefined,
          });
        }
      }
    } catch (e) {
      // e;
      this.setState({
        ...this.state,
        // preview: `Error rendering template: ${e}`,
      });
    }
  };
  handleResize = () => {
    try {
      let width = this.od.offsetParent.offsetWidth;
      let height = this.od.offsetParent.offsetHeight;
      this.setState({ height: height, width: width });

      console.log(this);
    } catch (e) {
      console.log(e);
    }
  };
  protected od: any;
  setOuterDiv = (od: any) => {
    this.od = od;
    // try {
    //   if (window.addResizeListener) window.addResizeListener(this.od.offsetParent, this.handleResize);
    // } catch (e) {}
  };
  render() {
    if (!this.state.components) {
      return <div />;
    }
    // @ts-ignore
    let formRenderDiv = <form ref={this.fb} />;

    return (
      <ReactResizeDetector onResize={this.handleResize}>
        <div
          // style={{
          //   height: 'calc(100%-5px)', width: 'calc(100%)', position: 'relative',
          // }}
          style={{ height: '100%', width: '100%' }}
          ref={this.setOuterDiv}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              flexDirection: 'row',
              flexGrow: 1,
              background: this.theme.isLight ? 'rgb(187,187,188)' : 'rgb(48,48,48)',
              width: '100%',
            }}
          >
            <Button
              className={'compact'}
              onClick={this.onCreate}
              // inverted={false}
              // color={'black'}

              style={{
                border: 0,
                background: this.theme.isLight ? 'rgb(187,187,188)' : 'rgb(69,69,69)',
                color: this.theme.isLight ? 'black' : 'white',
              }}
              size={'small'}
            >
              {PontusComponent.t('Create')}
            </Button>
            <Button
              className={'compact'}
              onClick={this.onUpdate}
              // inverted={false}
              // color={'black'}

              style={{
                border: 0,
                background: this.theme.isLight ? 'rgb(187,187,188)' : 'rgb(69,69,69)',
                color: this.theme.isLight ? 'black' : 'white',
              }}
              size={'small'}
            >
              {PontusComponent.t('Update')}
            </Button>
            <Button
              className={'compact'}
              onClick={this.onDelete}
              // inverted={false}
              // color={'black'}

              style={{
                border: 0,
                background: this.theme.isLight ? 'rgb(187,187,188)' : 'rgb(69,69,69)',
                color: this.theme.isLight ? 'black' : 'white',
              }}
              size={'small'}
            >
              {PontusComponent.t('Delete')}
            </Button>
          </div>
          <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>{formRenderDiv}</div>;
        </div>
      </ReactResizeDetector>
    );
  }
}

export default PVFormPanel;
