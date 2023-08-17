// @ts-ignore
import $ from 'jquery';
import React, { createRef } from 'react';

// @ts-ignore
window.jQuery = $;
// @ts-ignore
window.$ = $;

require('jquery-ui-sortable');
require('formBuilder');

// import './PVFormBuilderEditor.scoped.scss';
// import 'formiojs/dist/formio.embed.css';
// import 'formiojs/dist/formio.builder.min.css';
// import 'formiojs/dist/formio.full.min.css';
// import './formBuilder.css';
// import 'brace/mode/groovy';
// import 'brace/theme/monokai';
// import 'brace/ext/searchbox';

import PontusComponent from './PontusComponent';
import { PanelOptionsEditorProps } from '@grafana/data';
import ReactResizeDetector from 'react-resize-detector';
// import './react-formio';
// import { FormBuilder } from '@formio/react';
// import { ComponentSchema } from 'formiojs';
// import { ReactFormBuilder } from 'react-form-builder2';
// import 'react-form-builder2/dist/app.css';

import { PVFormBuilderEditorProps, PVFormData } from './types';

const formData: PVFormData[] = [
  {
    type: 'header',
    subtype: 'h1',
    label: 'formBuilder in React',
  },
  {
    type: 'paragraph',
    label: 'This is a demonstration of formBuilder running in a React project.',
  },
];

export interface PVFormBuilderEditorState extends PVFormBuilderEditorProps {
  height?: number;
  width?: number;

  // style?: CSSProperties;
}

class PVFormBuilderEditor extends PontusComponent<
  PanelOptionsEditorProps<PVFormBuilderEditorProps | string>,
  PVFormBuilderEditorState
> {
  // private val: string;
  private od: any;

  constructor(props: Readonly<PanelOptionsEditorProps<PVFormBuilderEditorProps | string>>) {
    super(props);

    this.req = undefined;

    this.state = { ...props.context.options };
    // this.nodePropertyNamesReactSelect = null;
    // this.val = '';
  }
  fb = createRef();
  formBuilder: any;
  componentDidMount() {
    // @ts-ignore
    this.formBuilder = $(this.fb.current).formBuilder({
      formData: this.getFormData(),
      // actionButtons: [
      //   {
      //     id: 'smile',
      //     className: 'btn btn-success',
      //     label: '😁',
      //     type: 'button',
      //     events: {
      //       click: function () {
      //         alert('😁😁😁 !SMILE! 😁😁😁');
      //       },
      //     },
      //   },
      // ],
      disabledActionButtons: ['data', 'clear'],
      // @ts-ignore
      onSave: (evt: any, formData: any) => {
        if (this.props.onChange) {
          this.props.onChange(formData);
        }
      },
    });
  }

  getFormData = (): PVFormData[] => {
    let retVal: PVFormData[] =
      typeof this.props.context.options.components === 'string'
        ? JSON.parse(this.props.context.options.components)
        : this.props.context.options.components || formData;

    const cols = this.props.context.options?.dataSettings?.colSettings;
    const colsMap: Record<string, string> = {};

    for (const formDataItem of retVal) {
      if (formDataItem.name && !colsMap[formDataItem.name]) {
        colsMap[formDataItem.name] = formDataItem.name;
      }
    }

    if (cols) {
      for (const col of cols) {
        if (!colsMap[col.id]) {
          colsMap[col.id] = col.id;
          const formDataItem: PVFormData = {
            type: col.id.toLowerCase().includes('_date') ? 'date' : 'text',
            className: 'form-control',
            label: PontusComponent.t(col.name) || col.name,
            name: col.id,
          };
          retVal.push(formDataItem);
        }
      }
    }

    return retVal;
  };

  componentDidUpdate = (prevProps: Readonly<PanelOptionsEditorProps<PVFormBuilderEditorProps | string>>) => {
    if (
      this?.formBuilder?.actions?.setData &&
      (prevProps.value !== this.props.value ||
        prevProps.context.options.dataSettings.dataType !== this.props.context.options.dataSettings.dataType ||
        JSON.stringify(prevProps.context.options.dataSettings.colSettings) !==
          JSON.stringify(this.props.context.options.dataSettings.colSettings))
    ) {
      // @ts-ignore
      this.formBuilder.actions.setData(this.getFormData());
    }
  };

  handleResize = () => {
    try {
      let width = this.od.offsetParent.offsetWidth;
      let height = this.od.offsetParent.offsetHeight;
      this.setState({ ...this.state, height: height, width: width });

      console.log(this);
    } catch (e) {
      console.log(e);
    }
  };

  setOuterDiv = (od: any) => {
    this.od = od;
    // try {
    //   if (window.addResizeListener) window.addResizeListener(this.od.offsetParent, this.handleResize);
    // } catch (e) {}
  };
  //
  // componentWillUnmount() {
  //   window.removeResizeListener(this.od.offsetParent, this.handleResize);
  // }

  render() {
    // let eventHub = this.props.glEventHub;
    //
    // let val = PontusComponent.getItem(this.props.namespace + 'LGPD-savedStateTemplateEditor') || '';

    let width = this.od ? this.od.offsetParent.offsetWidth - 30 : this.state.width;
    let height = this.od ? this.od.offsetParent.offsetHeight - 50 : this.state.height;
    // @ts-ignore
    let formBuilderDiv = <div id="fb-editor" ref={this.fb} />;

    return (
      <ReactResizeDetector onResize={this.handleResize}>
        <div style={{ height: height, width: width }} ref={this.setOuterDiv}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              flexDirection: 'row',
              flexGrow: 1,
              background: !this.theme.isLight ? 'rgb(187,187,188)' : 'rgb(48,48,48)',
              width: '100%',
            }}
          >
            {formBuilderDiv}
          </div>
        </div>
      </ReactResizeDetector>
    );
  }
}

export default PVFormBuilderEditor;
