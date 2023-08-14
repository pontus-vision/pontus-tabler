// import ResizeAware from 'react-resize-aware';
// import "slickgrid-es6/dist/slick-default-theme.less";
import PVGrid, { PVGridColDef, PVGridProps, PVGridSearch } from './PVGrid';
import PontusComponent from './PontusComponent';
import Axios, { CancelTokenSource } from 'axios';

class PVGridSelfDiscovery extends PVGrid {
  protected req2: CancelTokenSource | undefined;

  constructor(props: Readonly<PVGridProps>) {
    super(props);
    // this.columns = [
    //   {key: 'name', name: 'Name'},
    //   {key: 'street', name: 'Street'}
    // ];
    if (props.vid === null) {
      throw new Error('Must have a vertex id (vid) property to use this widget');
    }

    if (props.edgeType === null) {
      throw new Error('Must have an edgeType so we can query the graph ');
    }

    if (props.edgeDir === null) {
      throw new Error('Must have an edgeDir so we can query the graph');
    }

    this.state = {
      ...this.state,
      ...props,
    };
  }

  componentDidMount = () => {
    this.mountedSuccess = true;
    this.createSubscriptions(this.props);
    this.getColSettingsRemote().then((colSettings) => {
      this.emit(this.props.namespace + '-pvgrid-on-col-settings-changed', colSettings);
    });
  };

  getColSettingsRemote = async (): Promise<PVGridColDef[]> => {
    // if (jsonRequest) {
    //   let reqToSave = jsonRequest;
    //   if (typeof jsonRequest === 'object') {
    //     reqToSave = JSON.stringify(jsonRequest);
    //   }
    //   PontusComponent.setItem(`${this.props.namespace}.optionsJsonRequest`, reqToSave);
    // }
    const url = PontusComponent.getRestNodePropertyNamesURL(this.props);

    if (this.req2) {
      this.req2.cancel();
    }

    const CancelToken = Axios.CancelToken;
    this.req2 = CancelToken.source();
    try {
      const response = await this.post(
        url,
        { labels: [{ label: this.props.dataType, value: this.props.dataType }] },
        {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          cancelToken: this.req2.token,
        }
      );
      const colSettings: PVGridColDef[] = [];

      // this.reactSelect.options = response.data.labels || [];
      if (response.data && response.data.labels) {
        for (let i = 0; i < response.data.labels.length; i++) {
          const lbl = response.data.labels[i];
          lbl.label = PontusComponent.t(lbl.label);
          colSettings.push({
            id: lbl.value as string,
            name: lbl.label as string,
            field: lbl.value as string,
            sortable: true,
          });
        }
      }

      return colSettings;
      // callback(null, {
      //   options: response.data.labels || [],
      //   complete: true
      //
      // });
    } catch (thrown: any) {
      if (Axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
      } else {
        throw thrown;
      }
    }
    return [];

    // return retVal;
  };

  getSearch = (): PVGridSearch => {
    return {
      searchStr: this.searchstr,
      searchExact: this.searchExact,
      cols: this.cols,
      extraSearch: { label: this.dataType, value: this.dataType },
      direction: this.props.edgeDir,
      relationship: this.props.edgeType,
      vid: this.props.vid,
    };
  };
}

export default PVGridSelfDiscovery;
