import React from 'react';
import PontusComponent from './PontusComponent';
import { PanelOptionsEditorProps } from '@grafana/data';
import ReactResizeDetector from 'react-resize-detector';
import { Button } from 'semantic-ui-react';
import AceEditor from 'react-ace';
import { PVGridColSelectorProps } from './PVGridColSelector';
// import { PVNamespaceProps } from './types';

export interface PVReportPanelTemplateEditorProps extends PVGridColSelectorProps {
  templateText?: string;
}

export interface PVReportPanelTemplateEditorState extends PVReportPanelTemplateEditorProps {
  height?: number;
  width?: number;

  // style?: CSSProperties;
}

class PVReportPanelTemplateEditor extends PontusComponent<
  PanelOptionsEditorProps<PVReportPanelTemplateEditorProps | string>,
  PVReportPanelTemplateEditorState
> {
  // private val: string;
  private od: any;

  constructor(props: Readonly<PanelOptionsEditorProps<PVReportPanelTemplateEditorProps | string>>) {
    super(props);

    this.req = undefined;

    this.state = { ...props.context.options };
    // this.nodePropertyNamesReactSelect = null;
    // this.val = '';
  }

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

  onChange = (val: any, ev: any) => {
    // PontusComponent.setItem(this.props.namespace + 'LGPD-savedStateTemplateEditor', val);
    this.setState({ templateText: val });
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

    return (
      <ReactResizeDetector onResize={this.handleResize}>
        <div style={{ height: height, width: width }} ref={this.setOuterDiv}>
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
              onClick={(event: any) => {
                if (this.props.onChange) {
                  this.props.onChange(this.state.templateText);
                }
              }}
              style={{
                border: 0,
                background: this.theme.isLight ? 'rgb(187,187,188)' : 'rgb(69,69,69)',
                color: this.theme.isLight ? 'black' : 'white',
              }}
              size={'small'}
            >
              {PontusComponent.t('Set Template')}
            </Button>
          </div>
          <AceEditor
            mode="html"
            theme="tomorrow"
            onChange={this.onChange}
            name="html-editor"
            editorProps={{ $blockScrolling: true, useIncrementalSearch: true }}
            enableBasicAutocompletion={true}
            // enableLiveAutocompletion={true}
            tabSize={2}
            value={this.state.templateText}
            height={height! - 20 + 'px'}
            width={width! - 40 + 'px'}
            // style={{ overflow: 'auto', flexGrow: 1 }}
            style={{ overflow: 'auto', height: '90%', width: '100%', flexGrow: 1 }}
          />
        </div>
      </ReactResizeDetector>
    );
  }
}

export default PVReportPanelTemplateEditor;
