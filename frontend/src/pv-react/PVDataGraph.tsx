import React from 'react';
// import ResizeAware from 'react-resize-aware';
import Graph, { GraphData, Options } from 'react-graph-vis';
import axios from 'axios';
import PVGridSelfDiscovery from './PVGridSelfDiscovery';
import { Button, Portal, Segment } from 'semantic-ui-react';
import PVReportButton from './PVReportButton';
import PVDetailsButton from './PVDetailsButton';
import PontusComponent from './PontusComponent';
import { ButtonProps } from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import ReactResizeDetector from 'react-resize-detector';
import { PVNamespaceProps } from './types';

export type PVDataGraphProps = PVNamespaceProps;

export interface PVDataGraphState extends PVDataGraphProps {
  summary?: boolean;
  vid?: string;
  depth?: number;
  metadataType?: string;
  edgeType?: string;
  edgeDir?: '<-' | '->';
  open?: boolean;
  height?: number;
  width?: number;
  origLabel?: string;
  reportButtons?: any[] | any;
  graph?: GraphData;
  options?: Options;
  events?: any;
  pausedAnimation: boolean;
}

/***************************
 * UserList Component
 ***************************/
class PVDataGraph extends PontusComponent<PVDataGraphProps, PVDataGraphState> {
  protected enableClose: boolean;
  protected numNeighboursNamespace: string;
  protected subscription: string;
  protected subscriptionDiscovery: string;
  protected selfDiscoveryGridLoadedSubscription: string;
  protected errorCount: number;
  // private underscoreOrDot: RegExp;
  protected origNodeId: any;
  protected eventId: any;
  protected graph: any;
  protected network: any;

  constructor(props: Readonly<PVDataGraphProps>) {
    super(props);
    this.enableClose = false;
    this.numNeighboursNamespace = (this.props.namespace ? this.props.namespace : '') + '-pvgraph-neighbours-click';
    this.subscription =
      (this.props.isNeighbour
        ? this.props.neighbourNamespace
          ? this.props.neighbourNamespace
          : ''
        : this.props.namespace
        ? this.props.namespace
        : '') + '-pvgrid-on-click-row';

    this.subscriptionDiscovery = this.props.namespace + '-pvgrid-on-click-row';

    this.selfDiscoveryGridLoadedSubscription =
      (this.props.namespace ? this.props.namespace : '') + '-pvgrid-on-data-loaded';
    this.state = {
      pausedAnimation: false,
      summary: false,
      vid: '-1',
      depth: 1,
      metadataType: '',
      edgeType: '',
      edgeDir: '<-',
      open: false,
      height: 1000,
      width: 1000,
      origLabel: '',
      reportButtons: [],
      graph: {
        nodes: [
          { id: 1, label: 'Pontus Vision', title: 'Pontus Vision', color: '#0000ff', shape: 'box' },
          // {id: 2, label: 'Megan Perry', color: '#e09c41'},
          // {id: 3, label: 'Ryan Harris', color: '#e0df41'},
          // {id: 4, label: 'Jennifer Edwards', color: '#7be041'},
          // {id: 5, label: 'Noah Jenkins', color: '#41e0c9'}
        ],
        edges: [
          // {from: 1, to: 2},
          // {from: 1, to: 3},
          // {from: 2, to: 4},
          // {from: 2, to: 5}
        ],
      },
      options: {
        nodes: {
          font: {
            align: 'left',
            color: this.theme.isLight ? '#000000' : '#FFFFFF',
          },
          shapeProperties: {
            useImageSize: true,
            interpolation: false,
          },
        },
        groups: {
          // "Object Privacy Notice": {
          //   shape: 'icon',
          //   icon: {
          //     face: 'FontAwesome',
          //     code: '\uf0c0',
          //     size: 50,
          //     color: '#57169a'
          //   }
          // },
          // "Object Lawful Basis": {
          //   shape: 'icon',
          //   icon: {
          //     face: 'FontAwesome',
          //     code: '\uf007',
          //     size: 50,
          //     color: '#aa00ff'
          //   }
          // }
        },
        // layout: {
        //   hierarchical: {
        //     direction: "UD",
        //     sortMethod: "directed",
        //     levelSeparation: 500,
        //     nodeSpacing: 500,
        //     treeSpacing: 500
        //   }
        // },
        interaction: { dragNodes: true, zoomSpeed: 0.2 },
        physics: {
          hierarchicalRepulsion: {
            centralGravity: 0.0,
            springLength: 300,
            springConstant: 0.01,
            nodeDistance: 300,
            damping: 0.09,
          },
          barnesHut: {
            gravitationalConstant: -359500,
            springLength: 720,
            springConstant: 0.055,
            damping: 0.34,
            avoidOverlap: 1,
            centralGravity: 0.01,
          },
          minVelocity: 0.75,
          maxVelocity: 200.0,
          timestep: 0.11,
        },
        edges: {
          color: this.theme.isLight ? '#FFFFFF' : '#000000',
          font: {
            color: this.theme.isLight ? '#FFFFFF' : '#000000',
            size: 20, // px
            face: 'arial',
            background: 'none',
            strokeWidth: 1, // px
            strokeColor: this.theme.isLight ? '#FFFFFF' : '#000000',
          },
        },
      },
      events: {
        // select: this.selectUser
        // doubleClick: this.doubleClick
      },
      ...props,
    };

    this.errorCount = 0;
    // this.underscoreOrDot = new RegExp('[_.]', 'g');
  }

  onClickSummary = (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
    // this.handleResize({});
    this.selectData('topic', { id: this.origNodeId });
    this.setState({ summary: !this.state.summary });
  };

  doubleClick = (param: any) => {
    try {
      param.event.preventDefault();
      this.enableClose = false;

      if (param.edges.length > 0) {
      }
      if (param.nodes.length > 0) {
        let event = { id: param.nodes[0] };
        let isEdge =
          (typeof event.id === 'string' || event.id instanceof String) &&
          (event.id.indexOf('->') >= 0 || event.id.indexOf('<-') >= 0);
        if (isEdge) {
          let edgeDir: '->' | '<-' = event.id.indexOf('<-') !== -1 ? '<-' : '->';

          let metadataType = event.id.replace(/ ->.*/g, '').replace(/ <-.*/g, '').replace(' ', '.').replace(/ /g, '_');
          let edgeType = event.id.replace(/.*-> /g, '').replace(/.*<- /g, '').replace(/ /g, '_').replace(/[()]/g, '');

          if (this.state.open) {
            this.setState({
              ...this.state,
              open: false,
            });
          }
          this.setState({
            ...this.state,
            metadataType: metadataType,
            vid: this.eventId,
            edgeType: edgeType,
            edgeDir: edgeDir,
            open: true,
          });
        } else if (event.id) {
          this.selectData('topic', event);
        }
      }
    } catch (e) {
      //e;
    }
    // this.selectData(event);
  };
  // This is called from the render() ref={} area to give us a reference to the
  // value that was created by the render() function.
  setGraph = (graph: Graph) => {
    this.graph = graph; // new Graph({graph:this.state.graph, options: this.state.options, events:this.state.events});
    if (this.graph && this.graph.addEventListener) {
      this.graph.addEventListener('resize', this.onResize);
    }
  };

  setNetwork = (network: any) => {
    this.network = network;
    this.network.setOptions(this.state.options!);
    // this.network.fit();

    try {
      this.network.off('doubleClick', this.doubleClick);
    } catch (t) {
      /*ignore*/
    }

    this.network.on('doubleClick', this.doubleClick);
    // this.network.on("doubleClick", this.doubleClick);
  };

  // selectUser = (event) =>
  // {
  //   var {nodes, edges} = event;
  //   console.log("Selected nodes:");
  //   console.log(nodes);
  //   console.log("Selected edges:");
  //   console.log(edges);
  //   this.props.glEventHub.emit('user-select', this.state.users[nodes[0] - 1])
  // };

  measureElement = (htmlToMeasure: string) => {
    const element = document.createElement('div');
    element.innerHTML = htmlToMeasure;
    document.body.appendChild(element);

    let retVal = { width: element.offsetWidth, height: element.offsetHeight };

    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }

    return retVal;
  };

  createSVGHTMLTableWithProps = (propsInHTMLTableRows: string, vLabel: string, summary = false) => {
    let backgroundColor = this.getColorBasedOnLabel(vLabel);

    let data = JSON.parse(atob(propsInHTMLTableRows));

    let tableData = '';
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        let val = data[key][0];
        tableData += "<tr><td class='tg-yw4l'>";
        let cleanKey = PontusComponent.replaceAll('.', ' ', key);
        cleanKey = PontusComponent.replaceAll('_', ' ', cleanKey);
        tableData += PontusComponent.t(cleanKey);
        // val = data[key];
        // val = val.replace('[', '').replace(']', '');
        if (key.endsWith('b64')) {
          val = PontusComponent.b64DecodeUnicode(val);
          tableData += ' (' + PontusComponent.t('Decoded') + ')';
        }
        tableData += "</td><td class='tg-yw4l'>";
        tableData += PontusComponent.escapeHTML(summary && val.length > 30 ? val.substring(0, 30) + '...' : val);
        tableData += '</td></tr>';
      }
    }

    let tableBodySb =
      '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:20px;color:#FFFFFF;height:100%;width:100%;">' +
      '<style>' +
      '.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:visible;word-break:normal;}' +
      '.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:visible;word-break:normal;color:#ffffff;}' +
      '.tg .tg-ygl1{font-weight:bold;background-color:#9b9b9b}' +
      '.tg .tg-x9s4{font-weight:bold;background-color:#9b9b9b;vertical-align:top}' +
      '.tg .tg-yw4l{vertical-align:top; color:#ffffff;}' +
      '</style>' +
      // + "<h3 style=\"color: white;\">"
      // + vLabel.replace(this.underscoreOrDot, " ")
      // + "</h3>"
      '<table class="tg" style=" overflow: visible; background: ' +
      backgroundColor +
      '; height: auto; width: 600px; padding: 5px;">' +
      '<colgroup> <col style="width: 30%"/><col style="width: 70%"/></colgroup>' +
      '<tr><th class="tg-ygl1">' +
      PontusComponent.t('Property') +
      '</th><th class="tg-x9s4">' +
      PontusComponent.t('Value') +
      '</th></tr>' +
      tableData +
      '</table></div>';

    let measuredSize = this.measureElement(tableBodySb);

    let svgHeadSb =
      '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" height="' +
      measuredSize.height +
      '" width="600" >' +
      '<foreignObject height="100%" width="100%"  fill="#797979" stroke-width="20" stroke="#ffffff"  >';

    let svgFootSb = '</foreignObject></svg>';

    let imageSb = 'data:image/svg+xml;charset=utf-8,';

    let svgSb = svgHeadSb + tableBodySb + svgFootSb;

    return imageSb + encodeURIComponent(svgSb);
    // imageSb.append(percentEscaper.escape(svgSb.toString()));
    //
    // this.image = imageSb.toString().replaceAll(Pattern.quote("nbsp"),
    //   "#160"); //percentEscaper.escape(tableBodySb.toString()).replaceAll("&nbsp;","&#160;");
  };

  // Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var
  // t="";var n,r,i,s,o,u,a;var
  // f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else
  // if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return
  // t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var
  // f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return
  // t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var
  // r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else
  // if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return
  // t},_utf8_decode:function(e){var t="";var n=0;var
  // r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else
  // if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return
  // t}}

  selectData = (topic: string, event: any | null) => {
    // this.origNodeId = event !== null ? (+(event.id || event.index)) : -1;// the + converts to number just in case
    // LPPM - 31Dec2019 - we no longer have numeric ids; remove the + converter
    this.origNodeId = event ? event.id || event.index : '-1'; // the + converts to number just in case
    // this.origNodeId = (+(this.origNodeId));
    let url = this.url; // "/gateway/sandbox/pvgdpr_server/home/graph";
    if (this.hRequest) {
      clearTimeout(this.hRequest);
    }

    let self = this;
    this.setState({ vid: this.origNodeId });

    this.hRequest = setTimeout(() => {
      let CancelToken = axios.CancelToken;
      self.req = CancelToken.source();

      this.post(url, this.getQuery(this.origNodeId), {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        cancelToken: self.req.token,
      })
        .then(this.onSuccess)
        .catch((thrown) => {
          if (thrown && axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
          } else {
            this.onError(event, thrown);
          }
        });
    }, 50);
  };

  onError = (event: any, thrown: Error) => {
    this.errorCount++;
    if (this.errorCount > 5) {
      console.error('Failed to get graph data:' + thrown);
    } else {
      this.selectData('topic', event);
    }
  };

  onSuccess = (resp: any) => {
    this.errorCount = 0;
    let respParsed: any = {};

    try {
      if (typeof resp !== 'object') {
        respParsed = JSON.parse(resp);
      } else {
        respParsed = resp;
      }
      if (respParsed.status === 200) {
        let items = respParsed.data.result.data['@value'][0];

        if (typeof items !== 'object') {
          items = JSON.parse(items);
        }

        let nodes = this.addMainNodeProperties(items.nodes);

        let edges = this.translateEdges(items.edges);

        let graph = { nodes: nodes, edges: edges };

        this.setState({
          graph: graph,
          reportButtons: items.reportButtons,
          vid: this.origNodeId,
          origLabel: items.origLabel,
        });
        // this.props.glEventHub.emit(this.props.namespace + '-pvgraph-double-click', {
        //   vid: this.origNodeId, metadataType: items.origLabel
        // });
        let network = this.network;
        let depth = this.state.depth;

        setTimeout(() => {
          if (network && depth && depth > 1) {
            network.fit();
          }
        }, 100);

        PontusComponent.setItem(this.subscription, graph);
      }
    } catch (e) {
      console.log(e);
    }
  };

  translateEdges = (edges: any) => {
    for (let i = 0, ilen = edges.length; i < ilen; i++) {
      let edge = edges[i];
      if (edge.label) {
        edge.label = PontusComponent.t(edge.label, [' (', ')']);
      }
    }
    return edges;
  };

  addMainNodeProperties = (nodes: any) => {
    for (let i = 0, ilen = nodes.length; i < ilen; i++) {
      let node = nodes[i];

      if (node.image) {
        // node.shape='box';
        node.image = this.createSVGHTMLTableWithProps(node.image, node.label, this.state.summary);
      }
      if (node.label) {
        node.label = PontusComponent.t(node.label, node.label.indexOf('->') > 0 ? [' -> (', ')'] : [' <- (', ')']);
      }
    }
    return nodes;
  };

  onSuccessOld = (res: any) => {
    if (this.network) {
      /*
             .data.result.data["@value"]
             */

      let graph = { nodes: res.data.nodes, edges: res.data.edges };
      this.setState({ graph: graph });
      PontusComponent.setItem(this.subscription, graph);

      // this.network.setData(graph);
    }
  };

  handleResize = () => {
    if (this.graph) {
      this.graph.updateGraph();
      this.setState({ height: this.state.height, width: this.state.width, summary: this.state.summary });
    }
  };

  componentWillMount() {
    let val: any = PontusComponent.getItem(this.subscription) || null;

    if (val) {
      if (val instanceof Object) {
        this.setState({ graph: val });
      }
    }
    this.on(this.subscription, this.selectData);
    this.on(this.subscriptionDiscovery, this.selectData);
    this.on(this.selfDiscoveryGridLoadedSubscription, this.enableCloseCb);
    this.on(this.numNeighboursNamespace, this.onClickNumNeighbours);
  }

  componentWillUnmount() {
    this.off(this.subscription, this.selectData);
    this.off(this.subscriptionDiscovery, this.selectData);
    this.off(this.numNeighboursNamespace, this.onClickNumNeighbours);
    // if (this.graph) {
    //   this.graph.removeEventListener('resize');
    // }
  }

  onResize = () => {
    if (this.network) {
      this.network.redraw();
    }
  };

  onClickNumNeighbours = (topic: string, event: any) => {
    let options: Options = {};

    if (1 === event) {
      options = {
        nodes: {
          font: {
            align: 'left',
            color: this.theme.isLight ? '#FFFFFF' : '#000000',
          },
          shapeProperties: {
            useImageSize: true,
            interpolation: false,
          },
        },
        groups: {},
        layout: {
          hierarchical: false,
        },
        interaction: { dragNodes: true },
        physics: {
          solver: 'barnesHut',
          barnesHut: {
            gravitationalConstant: -359500,
            springLength: 720,
            springConstant: 0.055,
            damping: 0.34,
            avoidOverlap: 1,
            centralGravity: 0.01,
          },
          minVelocity: 0.75,
          maxVelocity: 200.0,
          timestep: 0.11,
        },
        edges: {
          color: this.theme.isLight ? '#FFFFFF' : '#000000',
          font: {
            color: this.theme.isLight ? '#FFFFFF' : '#000000',
            size: 20, // px
            face: 'arial',
            background: 'none',
            strokeWidth: 1, // px
            strokeColor: this.theme.isLight ? '#FFFFFF' : '#000000',
          },
          smooth: false,
        },
      };
    } else {
      options = {
        edges: {
          color: this.theme.isLight ? '#FFFFFF' : '#000000',
          font: {
            color: this.theme.isLight ? '#FFFFFF' : '#000000',
            size: 20, // px
            face: 'arial',
            background: 'none',
            strokeWidth: 1, // px
            strokeColor: this.theme.isLight ? '#FFFFFF' : '#000000',
          },
          smooth: false,
        },

        layout: {
          hierarchical: {
            direction: 'UD',
            sortMethod: 'hubsize',
            levelSeparation: 1500,
            nodeSpacing: 1500,
            treeSpacing: 1500,
          },
        },
        physics: {
          // solver: 'hierarchicalRepulsion',

          barnesHut: {
            springLength: 720,
          },
          hierarchicalRepulsion: {
            centralGravity: 0.0,
            springLength: 1500,
            springConstant: 0.01,
            nodeDistance: 1500,
            damping: 0.09,
          },
        },
      };
    }
    let graph = {
      nodes: [],
      edges: [],
    };

    // this.network.setData(graph);
    if (1 === event) {
      this.network.redraw();
    }
    // if (this.graph)
    // {
    //   this.graph.updateGraph();
    // }

    this.setState({
      depth: event,
      options: options,
      graph: graph,
    });

    this.selectData(topic, { id: this.eventId });

    // this.handleResize({});
  };

  enableCloseCb = () => {
    this.enableClose = true;
  };

  handleClose = () => {
    // event;
    // data;
    if (this.enableClose) {
      this.setState({ open: false });
    }
  };

  selfDiscoveryGrid = (sdg: any) => {};

  render() {
    // var eventHub = this.props.glEventHub;
    //         <Graph graph={this.state.graph} options={this.state.options} events={this.state.events}/>

    const { open, reportButtons, summary } = this.state;

    let buttonsList = [
      // <PVDataGraphNeighboursButton key={100} namespace={this.props.namespace} />,
      <Button
        className={'compact'}
        key={210}
        style={
          summary
            ? { border: 0, background: 'rgb(108,108,108)', marginRight: '3px' }
            : { border: 0, background: 'rgb(187,187,188)', marginRight: '3px' }
        }
        onClick={this.onClickSummary}
        toggle={true}
      >
        {'◎'}
      </Button>,
      <PVDetailsButton
        key={200}
        className={'compact'}
        namespace={this.props.namespace}
        metadataType={this.state.origLabel}
        contextId={this.state.vid}
        style={{ border: 0, background: this.theme.isLight ? 'rgb(187,187,188)' : 'rgb(48,48,48)' }}
        size={'small'}
      />,
    ];

    let bttns = <div />;

    if ((buttonsList && buttonsList.length > 0) || (reportButtons != null && reportButtons.length > 0)) {
      let ilen = reportButtons ? reportButtons.length : 0;

      for (let i = 0; i < ilen; i++) {
        buttonsList.push(
          <PVReportButton
            key={i}
            className={'compact'}
            templateText={reportButtons[i].text}
            contextId={reportButtons[i].vid}
            buttonLabel={reportButtons[i].label}
            // glEventHub={this.props.glEventHub}
            // inverted={false}
            // color={'black'}
            style={{ border: 0, background: this.theme.isLight ? 'rgb(187,187,188)' : 'rgb(48,48,48)' }}
            // size={'small'}
          />
        );
      }
      bttns = (
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
          <button
            onClick={() => {
              this.state.options.physics.enabled = !this.state.pausedAnimation;

              this.setState({ ...this.state, pausedAnimation: !this.state.pausedAnimation });

              if (this.graph && this.state.pausedAnimation) {
                this.graph.Network.startSimulation();
              } else {
                this.graph.Network.stopSimulation();
              }
            }}
          >
            {this.state.pausedAnimation ? '▶' : '❚❚'}
          </button>
          {/*<div style={{ width: '100%' }}> */}
          {buttonsList}
          {/*</div>*/}
        </div>
      );
    }
    // style={{ height: '100%', width: '100%', flexDirection: 'column' }}

    return (
      <ReactResizeDetector onResize={this.handleResize}>
        {bttns}
        <Graph
          style={{ height: '90%', width: '100%', flexGrow: 1 }}
          graph={this.state.graph!}
          options={this.state.options}
          events={this.state.events}
          ref={this.setGraph}
          getNetwork={this.setNetwork}
          height={this.state.height! - 40}
          width={this.state.width! - 20}
        />
        <div id="loadingBar" style={{ opacity: 0, display: 'none' }}>
          <div className="outerBorder">
            <div id="text">0%</div>
            <div id="border">
              <div id="bar"></div>
            </div>
          </div>
        </div>

        <Portal
          onClose={this.handleClose}
          open={open}
          transition={{
            animation: 'scale',
            duration: 1400,
          }}
          closeOnEscape={true}
          closeOnTriggerClick={true}
        >
          <Segment
            style={{
              height: '50%',
              width: '50%',
              overflowX: 'auto',
              overflowY: 'auto',
              left: '30%',
              position: 'fixed',
              top: '20%',
              zIndex: 100000,
              backgroundColor: '#FFFFFF',
              color: '#000000',
            }}
          >
            <span style={{ textAlign: 'center', background: 'lightgray', display: 'block' }}>
              {PontusComponent.t(this.state.metadataType!)}
            </span>
            <PVGridSelfDiscovery
              ref={this.selfDiscoveryGrid}
              // style={{ height: '100%' }}
              namespace={this.props.namespace}
              vid={this.state.vid}
              edgeType={this.state.edgeType!}
              edgeDir={this.state.edgeDir!}
              dataType={this.state.metadataType}
            />
          </Segment>
        </Portal>
      </ReactResizeDetector>
    );
  }

  protected getQuery = (eventId: any): { bindings: Record<string, any>; gremlin: string } => {
    this.eventId = eventId;

    let query = this.state.depth === 1 ? 'getVisJsGraph(pg_vid);' : 'getVisJsGraph(pg_vid,pg_depth as int);';

    return {
      bindings: {
        pg_vid: eventId,
        pg_depth: this.state.depth,
      },
      gremlin: query,
    };
  };
}

export default PVDataGraph;
