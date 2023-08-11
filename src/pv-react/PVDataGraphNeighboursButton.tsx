import React from 'react';
import { Button, Label } from 'semantic-ui-react';
import PontusComponent from './PontusComponent';

// import PVDatamaps from './PVDatamaps';
export interface PVDataGraphNeighboursButtonProps {
  isNeighbour?: boolean;
  neighbourNamespace?: string;
  namespace?: string;
  subNamespace?: string;
}
export interface PVDataGraphNeighboursButtonState extends PVDataGraphNeighboursButtonProps {
  depth: number;
  open: boolean;
}

class PVDataGraphNeighboursButton extends PontusComponent<
  PVDataGraphNeighboursButtonProps,
  PVDataGraphNeighboursButtonState
> {
  private readonly namespace: string;

  constructor(props: Readonly<any>) {
    super(props);
    // this.columns = [
    //   {key: 'name', name: 'Name'},
    //   {key: 'street', name: 'Street'}
    // ];
    this.errorCounter = 0;

    this.namespace = this.props.namespace + '-pvgraph-neighbours-click';

    this.state = {
      ...props,
      depth: 1,
      open: false,
    };
  }

  onClickPlus = () => {
    let depth = this.state.depth;
    depth++;
    if (depth > 24) {
      depth = 24;
    }
    this.setState({ depth: depth });
    this.emit(this.namespace, depth);
    // this.props.glEventHub.emit(this.namespace, this.state.depth);
  };
  onClickPlusPlus = () => {
    let depth = 24;
    this.setState({ depth: depth });
    this.emit(this.namespace, depth);
    // this.props.glEventHub.emit(this.namespace, this.state.depth);
  };

  onClickMinus = () => {
    let depth = this.state.depth;
    depth--;
    if (depth < 1) {
      depth = 1;
    }
    this.setState({ depth: depth });
    this.emit(this.namespace, depth);
    // this.props.glEventHub.emit(this.namespace, this.state.depth);
  };

  onClickMinusMinus = () => {
    let depth = 1;

    this.setState({ depth: depth });
    this.emit(this.namespace, depth);
    // this.props.glEventHub.emit(this.namespace, this.state.depth);
  };

  handleClose = () => this.setState({ open: false });

  render() {
    return (
      <div>
        <Button
          className={'compact'}
          style={{ border: 0, background: 'rgb(187,187,188)', marginRight: '3px' }}
          size={'small'}
          onClick={this.onClickMinusMinus}
        >
          &lt;&lt;
        </Button>

        <Button
          className={'compact'}
          style={{ border: 0, background: 'rgb(187,187,188)', marginRight: '3px' }}
          size={'small'}
          onClick={this.onClickMinus}
        >
          -
        </Button>
        <Label>{this.state.depth}</Label>
        <Button
          className={'compact'}
          style={{ border: 0, background: 'rgb(187,187,188)', marginRight: '3px' }}
          size={'small'}
          onClick={this.onClickPlus}
        >
          +
        </Button>
        <Button
          className={'compact'}
          style={{ border: 0, background: 'rgb(187,187,188)', marginRight: '3px' }}
          size={'small'}
          onClick={this.onClickPlusPlus}
        >
          &gt;&gt;
        </Button>
      </div>
    );
  }
}

export default PVDataGraphNeighboursButton;
