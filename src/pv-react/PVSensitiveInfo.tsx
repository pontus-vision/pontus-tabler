import React from 'react';
import PontusComponent from './PontusComponent';
import { PanelOptionsEditorProps } from '@grafana/data';
import { Input } from '@grafana/ui';

export interface PVSensitiveInfoProps {}

export interface PVSensitiveInfoState extends PVSensitiveInfoProps {}

class PVSensitiveInfo extends PontusComponent<PanelOptionsEditorProps<PVSensitiveInfoProps>, PVSensitiveInfoState> {
  private val: string;

  constructor(props: Readonly<PVSensitiveInfoProps>) {
    super(props);

    this.req = undefined;

    this.state = { ...props };
    // this.nodePropertyNamesReactSelect = null;
    this.val = '';
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%', flexDirection: 'column', display: 'flex' }}>
        <div style={{ display: 'block', width: '100%', padding: '10px' }}>
          <Input
            type={'password'}
            style={{ width: '100%', height: '100%' }}
            onChange={(event: any) => {
              if (this.props.onChange) {
                this.val = event.value;
                this.props.onChange(this.val);
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default PVSensitiveInfo;
