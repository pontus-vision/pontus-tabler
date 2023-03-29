import React from 'react';

import { AxiosResponse } from 'axios';
import { ChartData, Doughnut } from 'react-chartjs-2';
import PontusComponent from './PontusComponent';
import { PVNamespaceProps } from './types';

// import PVDatamaps from './PVDatamaps';

export interface PVDoughnutChartProps extends PVNamespaceProps {
  width?: number;
  height?: number;
  maxHeight?: number;
}

export interface PVDoughnutChartState extends PVDoughnutChartProps {
  data: ChartData<any>;
}

export interface PVDoughnutChartData {
  labels: string[];
  datasets: [
    {
      data: any[];
      backgroundColor: string[];
      hoverBackgroundColor: string[];
    }
  ];
}

class PVDoughnutChart extends PontusComponent<PVDoughnutChartProps, PVDoughnutChartState> {
  protected index: string;
  protected obj: any;

  constructor(props: PVDoughnutChartProps) {
    super(props);
    // this.columns = [
    //   {key: 'name', name: 'Name'},
    //   {key: 'street', name: 'Street'}
    // ];
    this.state = {
      maxHeight: 500,
      width: 500,
      height: 500,
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            // ,backgroundColor: []
            // ,hoverBackgroundColor: []
          },
        ],
      },
    };

    this.errorCounter = 0;
    this.index = '-1';
    // this.datamaps = new PVDatamaps(props);

    // this.url = props.url || "/gateway/sandbox/pvgdpr_graph";
    this.url = PontusComponent.getGraphURL(this.props);
  }

  setObj = (obj: any) => {
    this.obj = obj;
    if (this.obj && this.obj.chartInstance && this.obj.chartInstance.canvas) {
      this.obj.chartInstance.canvas.ondblclick = this.ensureData;
    }
  };

  componentDidMount() {
    // super.componentDidMount();
    if (this.props.neighbourNamespace) {
      this.on(this.props.neighbourNamespace!, this.onClickedPVGridAwarenessCampaign);
    }
  }

  componentWillUnmount() {
    if (this.props.neighbourNamespace) {
      this.off(this.props.neighbourNamespace!, this.onClickedPVGridAwarenessCampaign);
    }

    // super.componentWillUnmount();
  }

  onClickedPVGridAwarenessCampaign = (topic: string, val: any) => {
    this.index = val.id;

    this.ensureData(val.id);
  };

  getQuery = (id: string) => {
    return {
      gremlin: 'g.V((pg_awarenessId))' + ".in().as('events').groupCount().by('Event.Training.Status')",
      bindings: {
        pg_awarenessId: id,
      },
    };
  };

  onError = (err: Error) => {
    if (this.errorCounter > 5) {
      console.error('error loading data:' + err);
    } else {
      this.ensureData(this.index);
    }
    this.errorCounter++;
  };

  onSuccess = (resp: AxiosResponse) => {
    this.errorCounter = 0;

    try {
      let data: PVDoughnutChartData = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: [],
          },
        ],
      };

      if (resp.status === 200) {
        let items = resp.data.result.data['@value'][0]['@value'];

        for (let i = 0, ilen = items.length; i < ilen; i += 2) {
          let label = items[i];
          let datasetData = items[i + 1]['@value'];
          data.labels.push(PontusComponent.t(label)!);
          data.datasets[0].data.push(datasetData);

          switch (label) {
            case 'Passed':
              data.datasets[0].backgroundColor.push('#00ff00');
              data.datasets[0].hoverBackgroundColor.push('#00ff00');
              break;

            case 'Link Sent':
              data.datasets[0].backgroundColor.push('#ffff00');
              data.datasets[0].hoverBackgroundColor.push('#ffff00');
              break;

            case 'Reminder Sent':
              data.datasets[0].backgroundColor.push('#ff8800');
              data.datasets[0].hoverBackgroundColor.push('#ff8800');
              break;

            case 'Failed':
              data.datasets[0].backgroundColor.push('#ff0000');
              data.datasets[0].hoverBackgroundColor.push('#ff0000');
              break;

            case 'Second  Reminder':
              data.datasets[0].backgroundColor.push('#ff4400');
              data.datasets[0].hoverBackgroundColor.push('#ff4400');
              break;

            default:
              data.datasets[0].backgroundColor.push('#0000ff');
              data.datasets[0].hoverBackgroundColor.push('#0000ff');
          }
        }

        // let colorScale =  this.datamaps.getColorScale(0, items.length - 1);
        //
        // let datasetData = data.datasets[0].data;
        // for (var i = 0, ilen = datasetData.length; i < ilen; i++){
        //   data.datasets[0].backgroundColor[i] = colorScale(i);
        //   data.datasets[0].hoverBackgroundColor[i] = colorScale(i);
        //
        // }
      }

      this.setState({ data: data });
    } catch (e) {
      // e;
    }

    /*
     
     var data = {
     labels: ['Red', 'Green', 'Yellow'],
     datasets: [{
     data: [300, 50, 100],
     backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
     hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
     }]
     };
     */

    // this.onDataLoaded.notify({from: from, to: to});
  };

  render() {
    return (
      <div style={{ flex: 1 }} onDoubleClick={this.ensureData}>
        <Doughnut
          /* , maxHeight: this.state.maxHeight, width: this.state.width, height: this.state.height}}*/
          ref={this.setObj}
          data={this.state.data}
          redraw={true}
          options={{
            responsive: true,
            legend: {
              position: 'right',
              labels: {
                fontColor: 'white',
              },
            },
          }}
        />
      </div>
    );
  }
}

export default PVDoughnutChart;
