import React, { CSSProperties } from 'react';
// Be sure to include styles at some point, probably during your bootstrapping
import axios from 'axios';
import PontusComponent from './PontusComponent';
import PVGremlinComboBox, { PVGremlinComboBoxProps } from './PVGremlinComboBox';
import { Creatable } from 'react-select/creatable';
import { StylesConfig } from 'react-select/src/styles';
import { SelectableValue } from '@grafana/data';
import { OptionTypeBase } from 'react-select';
// import 'semantic-ui-css/semantic.min.css';
// import ResizeAware from 'react-resize-aware';

class PVGremlinComboboxToolbar extends PVGremlinComboBox {
  constructor(props: Readonly<PVGremlinComboBoxProps>) {
    super(props);

    this.req = undefined;
    if (!this.props.url) {
      throw new Error('must set the URL to forward requests');
    }

    this.state = {
      value: this.props.multi ? [] : {},
      // ,options: [{label : "one", value: "one"}, {label: "two", value: "two"}]
      options: this.props.options === null ? [] : this.props.options,
    };
  }

  getOptions = async (jsonRequest: any | undefined = undefined): Promise<Array<SelectableValue<string>>> => {
    const url = this.props.url ? this.props.url : PontusComponent.getRestNodePropertyNamesURL(this.props);

    if (this.req) {
      this.req.cancel();
    }

    const retVal: Array<SelectableValue<string>> = [];

    const CancelToken = axios.CancelToken;
    this.req = CancelToken.source();

    try {
      const response = await this.post(url, jsonRequest, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        cancelToken: this.req.token,
      });

      // this.reactSelect.options = response.data.labels || [];
      if (response.data && response.data.labels) {
        for (let i = 0; i < response.data.labels.length; i++) {
          const lbl = response.data.labels[i];
          lbl.label = PontusComponent.t(lbl.label);
          retVal.push({ label: lbl.label, value: response.data.values[i] });
        }
        this.setState({
          options: response.data.labels,
        });
      }
    } catch (thrown: any) {
      if (thrown && axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message || '');
      } else {
        this.onError(thrown);
      }
    }

    return retVal;
  };

  onChange = (value: any | undefined = undefined) => {
    this.setState({
      value: value,
    });

    if (this.props.onChange) {
      this.props.onChange(value);
      // this.reactSelect.setFocus();
    }
  };

  componentDidMount() {
    /* you can pass config as prop, or use a predefined one */

    this.getOptions();
  }

  componentWillUnmount() {
    // this.props.glEventHub.off('pvgrid-on-data-loaded', this.onDataLoadedCb);
  }

  render() {
    // multi={this.props.multi === null ? true : this.props.multi}
    // const isMulti:Boolean = this.props.multi?true:false;
    const customStyles: StylesConfig<OptionTypeBase, boolean> = {
      option: (provided: CSSProperties, state: any) => ({
        ...provided,
        color: 'black',
        padding: 2,
      }),
      singleValue: (provided: CSSProperties, state: any) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
        const top = '35%';

        return { ...provided, opacity, transition, top };
      },
      container: (provided: CSSProperties, state: any) => {
        const display = 'inline-block';
        const width = '20em';
        const height = '20px';
        const minHeight = '20px';
        const marginLeft = '2px';
        const marginRight = '2px';
        return { ...provided, display, width, height, minHeight, marginLeft, marginRight };
      },
      control: (provided: CSSProperties, state: any) => {
        // const display = 'inline-block';
        const width = '20em';
        const height = '20px';
        const minHeight = '20px';
        return { ...provided, width, height, minHeight };
      },
      placeholder: (provided: CSSProperties, state: any) => {
        // const display = 'inline-block';
        const width = '20em';
        const height = '20px';
        const minHeight = '20px';
        const fontSize = '12px';
        const top = '45%';
        return { ...provided, width, height, minHeight, fontSize, top };
      },

      input: (provided: CSSProperties, state: any) => {
        // const display = 'inline-block';
        const width = '20em';
        const height = '20px';
        const minHeight = '20px';
        const fontSize = '12px';
        const top = '25%';
        const margin = '0px'; /* margin: 2px; */
        const paddingBottom = '0px'; /* padding-bottom: 2px; */
        const paddingTop = '1px'; /* padding-top: 2px; */
        return { ...provided, width, height, minHeight, fontSize, top, margin, paddingBottom, paddingTop };
      },
      indicatorsContainer: (provided: CSSProperties, state: any) => {
        const height = '20px';
        const minHeight = '20px';
        const fontSize = '12px';
        const top = '25%';
        return { ...provided, height, minHeight, fontSize, top };
      },
    };

    /*
         <CreatableSelect
         options={this.state.options}
         placeholder='Select Label'
         styles={customStyles}
         />
         */

    return (
      <Creatable
        name={this.props.name || 'form-field-name'}
        key={this.state.value ? this.state.value.length : 0}
        value={this.state.value}
        isMulti={this.props.multi === null ? true : this.props.multi}
        isClearable
        options={this.state.options}
        joinValues={true}
        delimiter={','}
        onChange={this.onChange}
        placeholder={this.props.placeholder}
        styles={customStyles}
      />
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

export default PVGremlinComboboxToolbar;
