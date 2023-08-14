import React, { CSSProperties } from 'react';
import PVGremlinComboBox from './PVGremlinComboBox';
// import { Flex } from 'reflexbox';
import PontusComponent, { PVComponentProps } from './PontusComponent';
import { PVGridColDef } from './PVGrid';
import { PanelOptionsEditorProps } from '@grafana/data';

export interface PVGridColSelectorProps extends PVComponentProps {
  namespace?: string;
  subNamespace?: string;
  mountedSuccess?: boolean;
  customFilter?: string | undefined;
  settings?: any | undefined;
  url?: string | undefined;
  value?: any | undefined;
  multi?: boolean;
  options?: any;
  onError?: { (err: any): void };
  onChange?: { (val: { dataType?: string; colSettings?: PVGridColDef[] }): void };
  name?: string;
  optionsRequest?: string;
  placeholder?: React.ReactNode;
  dataType?: string;
  colSettings?: PVGridColDef[];
  style?: CSSProperties;
}

export interface PVGridColSelectorState extends PVGridColSelectorProps {
  checkedFuzzy: boolean;
}

class PVGridColSelector extends PontusComponent<
  PanelOptionsEditorProps<PVGridColSelectorProps>,
  PVGridColSelectorState
> {
  private nodePropertyNamesReactSelect: PVGremlinComboBox | undefined;
  private propsSelected: any[];
  private dataType?: string;
  private colSettings?: PVGridColDef[];

  constructor(props: Readonly<PanelOptionsEditorProps<PVGridColSelectorProps>>) {
    super(props);

    this.req = undefined;

    this.state = { checkedFuzzy: false, ...props };
    this.nodePropertyNamesReactSelect = undefined;
    // this.nodePropertyNamesReactSelect = null;
    this.propsSelected = [];
    this.dataType = props.context.options.dataSettings
      ? props.context.options.dataSettings.dataType
      : PontusComponent.t('Person.Natural');
    this.colSettings = props.context.options.dataSettings ? props.context.options.dataSettingscolSettings : [];
  }

  onError = (err: any) => {
    console.error('error loading pages ' + err);
  };
  onChangeVertexLabels = async (val: { label: string; value: string }) => {
    // alert("got data " + val);
    // this.props.glEventHub.emit('userSearch-on-boxChanged')
    if (this.nodePropertyNamesReactSelect) {
      await this.nodePropertyNamesReactSelect.getOptions({ version: 'v2.0.0', labels: val });
    }
    if (this.props.onChange) {
      this.dataType = val.value;
      this.props.onChange({ dataType: this.dataType, colSettings: this.colSettings });
    }
    this.emit(this.props.context.options.namespace + '-pvgrid-on-extra-search-changed', val);
  };

  onChangeNodePropertyNames = (val: any) => {
    // alert("got data " + val);
    // this.props.columnSettings = [
    //   {id: "name", name: "Name", field: "name", sortable: true},
    //
    //   {id: "street", name: "Street", field: "street", sortable: true}
    // ];

    const colSettings = [];

    this.propsSelected = [];

    if (val) {
      for (let i = 0, ilen = val.length; i < ilen; i++) {
        colSettings.push({
          id: val[i].value as string,
          name: val[i].label,
          field: val[i].value as string,
          sortable: true,
        });
        this.propsSelected.push(val[i].value);
      }
    }

    // for (val)
    if (this.props.onChange) {
      this.colSettings = colSettings;
      this.props.onChange({ dataType: this.dataType, colSettings: this.colSettings });
    }

    this.emit(this.props.context.options.namespace + '-pvgrid-on-col-settings-changed', colSettings);
  };

  setObjNodePropertyNames = (reactSelect: any) => {
    this.nodePropertyNamesReactSelect = reactSelect as PVGremlinComboBox;
  };

  render() {
    const nodeTypesVal = this.props.context.options.dataSettings
      ? {
          label: PontusComponent.t(
            PontusComponent.replaceAll(
              '.',
              ' ',
              PontusComponent.replaceAll('_', ' ', this.props.context.options.dataSettings.dataType)
            )
          ),
          value: this.props.context.options.dataSettings.dataType,
        }
      : {};

    const nodeTypesReq = { labels: nodeTypesVal };

    const propTypesVal = [];

    if (this.props.context.options.dataSettings && this.props.context.options.dataSettings.colSettings) {
      for (const setting of this.props.context.options.dataSettings.colSettings) {
        propTypesVal.push({ label: setting.name, value: setting.id });
      }
    }
    //
    // return (    <View style={{
    //   flex: 1,
    //   width: '100%',
    //   height: '100%',
    //   flexWrap: 'wrap',
    // }}>
    //   <View style={{
    //     flex: 1,
    //     width: '100%',
    //     height: 100,
    //     flexGrow: 1,
    //   }} >
    //     <PVGremlinComboBox
    //       namespace={`${this.namespace}-node-types`}
    //       name="node-types"
    //       multi={false}
    //       onChange={this.onChangeVertexLabels}
    //       onError={this.onError}
    //       url={PontusComponent.getRestVertexLabelsURL(this.props)}
    //       placeholder={PontusComponent.t('Data Type')}
    //       // style={{width: "100%"}}
    //       value={nodeTypesVal}
    //     />
    //   </View>
    //   <View style={{
    //     flex: 1,
    //     width: '100%',
    //     height: 100,
    //     flexGrow: 1,
    //   }}>
    //   </View>
    //   <View style={{
    //     flex: 1,
    //     width: '100%',
    //     height: 100,
    //     flexGrow: 1,
    //   }} >
    //     <PVGremlinComboBox
    //       name="node-property-types"
    //       namespace={`${this.namespace}-node-property-types`}
    //       multi={true}
    //       onChange={this.onChangeNodePropertyNames}
    //       onError={this.onError}
    //       ref={this.setObjNodePropertyNames}
    //       url={PontusComponent.getRestNodePropertyNamesURL(this.props)}
    //       placeholder={PontusComponent.t('Columns')}
    //       optionsRequest={nodeTypesReq}
    //       value={propTypesVal}
    //     />
    //   </View>
    // </View>);

    return (
      <div style={{ width: '100%', height: '100%', flexDirection: 'column', display: 'flex' }}>
        <div style={{ display: 'block', width: '100%', padding: '10px' }}>
          <PVGremlinComboBox
            namespace={`${this.props.context.options.namespace}-node-types`}
            name="node-types"
            multi={false}
            onChange={this.onChangeVertexLabels}
            onError={this.onError}
            url={PontusComponent.getRestVertexLabelsURL(this.props)}
            placeholder={PontusComponent.t('Data Type')}
            // style={{width: "100%"}}
            value={nodeTypesVal}
          />
        </div>

        <div style={{ display: 'block', width: '100%', padding: '10px' }}>
          <PVGremlinComboBox
            name="node-property-types"
            namespace={`${this.props.context.options.namespace}-node-property-types`}
            multi={true}
            onChange={this.onChangeNodePropertyNames}
            onError={this.onError}
            ref={this.setObjNodePropertyNames}
            url={PontusComponent.getRestNodePropertyNamesURL(this.props)}
            placeholder={PontusComponent.t('Columns')}
            optionsRequest={nodeTypesReq}
            value={propTypesVal}
          />
        </div>
      </div>
    );
  }
}

export default PVGridColSelector;
