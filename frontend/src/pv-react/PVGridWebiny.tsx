import PontusComponent from "./PontusComponent";
import PVGrid, { PVGridProps, PVGridState } from "./PVGrid";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export interface PVGridWebinyProps extends PVGridProps {
  modelId: string;
}

export interface PVGridWebinyState extends PVGridState {
  modelId: string;
}

export class PVGridWebiny<
  Props extends PVGridWebinyProps = PVGridWebinyProps,
  State extends PVGridWebinyState = PVGridWebinyState
> extends PVGrid<Props, State> {
  ensureDataCustom = (fromReq?: number, toReq?: number) => {
    if (undefined === fromReq || undefined === toReq) {
      return;
    }
    const fromReqNum = !fromReq || fromReq < 0 ? 0 : fromReq;

    const fromPage = Math.floor(fromReqNum / this.PAGESIZE);
    const toPage = Math.floor(toReq / this.PAGESIZE);

    const self = this;

    PontusComponent.cmsGetContentModel(this.props.modelId).then(
      (res) => this.onSuccessWebiny
    );
  };

  onSuccessProxy = (resp: {
    data: {
      from: any;
      records: string | any[];
      totalAvailable: number | undefined;
    };
  }) => {
    this.errCounter = 0;
    this.emit(this.props.namespace + "-pvgrid-on-data-loaded", resp);

    this.onSuccessPVRestQuery(resp);
  };
  onSuccessWebiny = () => {
    console.log("whatever");
  };
}
