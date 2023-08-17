import React from 'react';
import { MultiSelect, Select } from '@grafana/ui';
// Be sure to include styles at some point, probably during your bootstrapping
import PontusComponent from './PontusComponent';
import Axios from 'axios';
import { SelectableValue } from '@grafana/data';

// import ResizeAware from 'react-resize-aware';
export interface PVGremlinComboBoxProps {
  namespace?: string;
  subNamespace?: string;
  mountedSuccess?: boolean;
  customFilter?: string | undefined;
  settings?: any | undefined;
  url?: string | undefined;
  value?: any | undefined;
  multi?: boolean;
  options?: Array<SelectableValue<string>>;
  onError?: { (err: any): void };
  onChange?: { (val: any): void };
  name?: string;
  optionsRequest?: any;
  placeholder?: string;
}

export interface PVGremlinComboBoxState extends PVGremlinComboBoxProps {}

class PVGremlinComboBox extends PontusComponent<PVGremlinComboBoxProps, PVGremlinComboBoxState> {
  constructor(props: Readonly<PVGremlinComboBoxProps>) {
    super(props);

    this.req = undefined;
    if (!this.props.url) {
      throw new Error('must set the URL to forward requests');
    }

    // const lastValStr = PontusComponent.getItem(`${this.props.namespace}-value`);

    // let optionsStr = PontusComponent.getItem(`${this.props.namespace}-options`);

    let lastVal = null;
    // if (lastValStr) {
    //   lastVal = JSON.parse(lastValStr);
    // } else {
    //   lastVal = lastVal ? lastVal : this.props.value ? this.props.value : this.props.multi ? [] : {};

    // let options = (!this.props.options) ? this.props.multi ? lastVal : [lastVal] : this.props.options;
    // }

    lastVal = lastVal ? lastVal : this.props.value ? this.props.value : this.props.multi ? [] : {};

    const options = !this.props.options ? (this.props.multi ? lastVal : [lastVal]) : this.props.options;

    this.state = {
      ...props,
      value: lastVal,
      // ,options: [{label : "one", value: "one"}, {label: "two", value: "two"}]
      options: options,
    };
  }

  loadOptionsCb = async (query: string): Promise<Array<SelectableValue<string>>> => {
    let savedReq: any | undefined; //= PontusComponent.getItem(`${this.props.namespace}.optionsJsonRequest`);
    try {
      // if (savedReq) {
      //   savedReq = JSON.parse(savedReq);
      // } else {
      savedReq = this.props.optionsRequest;
      // }
    } catch (e) {}

    return this.getOptions(savedReq);
  };

  getOptions = async (jsonRequest: any): Promise<Array<SelectableValue<string>>> => {
    const retVal: Array<SelectableValue<string>> = [];

    // if (jsonRequest) {
    //   let reqToSave = jsonRequest;
    //   if (typeof jsonRequest === 'object') {
    //     reqToSave = JSON.stringify(jsonRequest);
    //   }
    //   PontusComponent.setItem(`${this.props.namespace}.optionsJsonRequest`, reqToSave);
    // }

    const url = this.props.url ? this.props.url : PontusComponent.getRestVertexLabelsURL(this.props);

    if (this.req) {
      this.req.cancel();
    }

    const CancelToken = Axios.CancelToken;
    this.req = CancelToken.source();
    try {
      const response = await this.post(url, jsonRequest, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        cancelToken: this.req.token,
      });

      // this.reactSelect.options = response.data.labels || [];
      console.log('Got response: ' + JSON.stringify(response));
      if (response.data && response.data.labels) {
        for (let i = 0; i < response.data.labels.length; i++) {
          const lbl = response.data.labels[i];
          lbl.label = PontusComponent.t(lbl.label);
          retVal.push({ label: lbl.label, value: lbl.value });
        }
        this.setState({
          options: retVal,
        });
      }

      // callback(null, {
      //   options: response.data.labels || [],
      //   complete: true
      //
      // });
    } catch (thrown: any) {
      if (thrown && Axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
      } else {
        this.onError(thrown);
        throw thrown;
      }
    }
    return retVal;

    // return retVal;
  };

  onError = (err: any): void => {
    if (this.props.onError) {
      this.props.onError(err);
    } else {
      console.error('error loading pages ' + err);
    }
  };

  onChange = (value: SelectableValue<string>) => {
    this.setState({
      value: value,
    });
    // PontusComponent.setItem(`${this.props.namespace}-value`, JSON.stringify(value));

    if (this.props.onChange) {
      this.props.onChange(value);
      // this.reactSelect.setFocus();
    }
  };

  componentDidMount() {
    /* you can pass config as prop, or use a predefined one */
    this.loadOptionsCb('');
  }

  componentWillUnmount() {
    // this.props.glEventHub.off('pvgrid-on-data-loaded', this.onDataLoadedCb);
  }

  render() {
    // const customStyles: StylesConfig = {
    //   option: (provided: CSSProperties, state: any) => ({
    //     ...provided,
    //     color: 'black',
    //     padding: 2,
    //   }),
    //   singleValue: (provided: CSSProperties, state: any) => {
    //     const opacity = state.isDisabled ? 0.5 : 1;
    //     const transition = 'opacity 300ms';
    //     return { ...provided, opacity, transition };
    //   },
    // };

    // multi={this.props.multi === null ? true : this.props.multi}

    const isMulti = this.props.multi === undefined || this.props.multi === null ? true : this.props.multi;
    if (isMulti) {
      return (
        <MultiSelect
          noOptionsMessage={this.props.placeholder!}
          value={this.state.value}
          options={this.state.options}
          isClearable={true}
          defaultValue={this.state.value}
          onChange={this.onChange}
          placeholder={this.props.placeholder}
          // loadOptions={this.loadOptionsCb}
        />
      );
    } else {
      return (
        <Select
          noOptionsMessage={this.props.placeholder!}
          options={this.state.options}
          isMulti={isMulti}
          isClearable={true}
          defaultValue={this.state.value}
          onChange={this.onChange}
          placeholder={this.props.placeholder}
          value={this.state.value}

          // loadOptions={this.loadOptionsCb}
        />
      );
    }
  }

  // <Select
  //   name={this.props.name || 'form-field-name'}
  //   // key={this.state.value}
  //   defaultValue={this.state.value}
  //   isMulti={this.props.multi === null ? true : this.props.multi}
  //   isClearable
  //   options={this.state.options}
  //   joinValues={true}
  //   delimiter={','}
  //   onChange={this.onChange}
  //   placeholder={this.state.placeholder}
  //   // styles={customStyles}
  // />

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

export default PVGremlinComboBox;
