import React from 'react';
import { Button } from 'semantic-ui-react';
import AceEditor from 'react-ace';
// import ResizeAware from 'react-resize-aware';
// import ReactResizeDetector from 'react-resize-detector';
import 'brace/mode/json';
import 'brace/theme/monokai';
import PVAceGremlinEditor, { PVAceGremlinEditorProps } from './PVAceGremlinEditor';
import ReactResizeDetector from 'react-resize-detector';

// import axios from "axios";
// import "slickgrid-es6/dist/slick-default-theme.less";

class PVAceGremlinJSONQueryResults extends PVAceGremlinEditor {
  obj: any;

  constructor(props: PVAceGremlinEditorProps) {
    super(props);
    // this.columns = [
    //   {key: 'name', name: 'Name'},
    //   {key: 'street', name: 'Street'}
    // ];

    this.state = { value: '', height: 1000, width: 1000 };
  }

  resetValue = (topic: string, data: any) => {
    this.setState({ value: '' });
  };

  setValue = (topic: string, data: any) => {
    this.setState({ value: data });
  };

  setObj = (obj: any) => {
    this.obj = obj;
  };

  componentDidMount() {
    // super.componentDidMount();
    this.on(this.props.namespace + '-PVAceGremlinEditor-on-change', this.setValue);
    this.on(this.props.namespace + '-PVAceGremlinEditor-on-before-run-query', this.resetValue);
  }

  componentWillUnmount() {
    // super.componentWillUnmount();
    // this.props.glEventHub.off(this.namespace + 'pvgrid-on-data-loaded', this.onDataLoadedCb);
    this.off(this.props.namespace + '-PVAceGremlinEditor-on-change', this.setValue);
    // window.removeResizeListener(this.od.offsetParent, this.handleResize);
  }

  render() {
    // let eventHub = this.props.glEventHub;
    //

    let data = this.state.value;
    if (data.response) {
      data = data.response;
    }
    if (data.data) {
      data = data.data;
    }
    if (data.result) {
      data = data.result;
    }
    if (typeof data === 'object') {
      data = JSON.stringify(data, null, 2);
    }
    data = data.replace(/\\n/g, '\n');
    data = data.replace(/\\t/g, '\t');
    let width = this.od ? this.od.offsetParent.offsetWidth - 30 : this.state.width;
    let height = this.od ? this.od.offsetParent.offsetHeight - 50 : this.state.height;

    return (
      <ReactResizeDetector onResize={this.handleResize}>
        <div
          // style={{
          //   height: 'calc(100%-5px)', width: 'calc(100%)', position: 'relative',
          // }}
          style={{ ...this.props.style, height: height, width: width }}
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
              onClick={() => {
                this.emit((this.props.namespace ? this.props.namespace : '') + '-pvgrid-on-click-row', {
                  id: this.obj.editor.getSelectedText(),
                });
              }}
              // inverted={false}
              // color={'black'}
              style={{
                border: 0,
                background: this.theme.isLight ? 'rgb(187,187,188)' : 'rgb(69,69,69)',
                color: this.theme.isLight ? 'black' : 'white',
              }}
              size={'small'}
            >
              Graph
            </Button>
          </div>
          <AceEditor
            mode="json"
            theme="monokai"
            name="gremlin-query-results"
            editorProps={{ $blockScrolling: true }}
            enableBasicAutocompletion={false}
            enableLiveAutocompletion={false}
            tabSize={2}
            readOnly={true}
            value={data}
            ref={this.setObj}
            // style={{height: this.state.height + 'px', width: this.state.width + 'px'}}
            height={height! - 20 + 'px'}
            width={width! - 20 + 'px'}
            style={{ overflow: 'auto' }}
          />
        </div>
      </ReactResizeDetector>
    );

    /*       return (
     <ul className="userlist">
     {this.state.users.map(function (user) {
     return <User
     key={user.name}
     userData={user}
     glEventHub={eventHub}/>
     })}
     </ul>
     )
     */
  }
}

export default PVAceGremlinJSONQueryResults;
