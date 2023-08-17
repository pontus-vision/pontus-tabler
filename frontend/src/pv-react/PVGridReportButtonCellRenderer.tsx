import React from 'react';
import { Button, Portal, Segment } from 'semantic-ui-react';
import PVReportButton, { PVReportButtonProps } from './PVReportButton';
import PontusComponent from './PontusComponent';
// import fileDownload from 'js-file-download';
// import axios from 'axios';
// import { Base64 } from 'js-base64';
import ReactToPrint from 'react-to-print';

// const html2pdf = require('html2pdf-jspdf2');
// import { jsPDF } from 'jspdf';
// import PVDatamaps from './PVDatamaps';

class PVGridReportButtonCellRenderer extends PVReportButton {
  saveUrl: string;
  // private h_request: any;
  private componentRef?: any;

  constructor(props: PVReportButtonProps) {
    super(props);

    const parsedStaticData = props.colDef.id.split('@');
    this.saveUrl = PontusComponent.getRestPdfReportRenderURL(props);
    this.state = {
      // colDef: undefined,
      // node: undefined,
      open: false,
      preview: '',
      ...props,
      buttonLabel: parsedStaticData[1].substring(1, parsedStaticData[1].length - 1),
      contextId: props.node && props.node.data ? props.node.data.id : undefined,
      templateText: parsedStaticData[2].substring(1, parsedStaticData[2].length - 1),
    };

    this.url = PontusComponent.getRestTemplateRenderURL(props);
    // this.state.context
  }

  onClick = () => {
    this.ensureData(this.state.contextId, this.state.templateText);
  };

  // onClickSaveButton = async () => {
  //   let url = this.saveUrl;
  //   if (this.h_request) {
  //     clearTimeout(this.h_request);
  //   }
  //
  //   // let self = this;
  //
  //   try {
  //     const result = await this.post(
  //       url,
  //       {
  //         refEntryId: this.state.contextId,
  //         base64Report: Base64.encode(this.state.preview),
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Accept: 'application/json',
  //         },
  //         // cancelToken: self.req.token,
  //       }
  //     );
  //
  //     if (result.status === 200 && result?.data?.base64Report) {
  //       fileDownload(
  //         new Blob([Base64.decode(result.data.base64Report)]),
  //         // result.data.base64Report,
  //         `${this.state.buttonLabel}.pdf`,
  //         'application/pdf'
  //       );
  //       const fakeurl = window.URL.createObjectURL(new Blob([Base64.decode(result.data.base64Report)]));
  //       const link = document.createElement('a');
  //       link.href = fakeurl;
  //
  //       link.setAttribute('download', `${this.state.buttonLabel}.pdf`);
  //
  //       // Append to html link element page
  //       document.body.appendChild(link);
  //
  //       // Start download
  //       link.click();
  //
  //       // Clean up and remove the link
  //       link?.parentNode?.removeChild(link);
  //     } else {
  //       console.log(`Request failed; got a status of ${result.status}`);
  //     }
  //   } catch (thrown: any) {
  //     if (axios.isCancel(thrown)) {
  //       console.log('Request canceled', thrown?.message);
  //     }
  //   }
  // };

  render() {
    return (
      <div>
        <Button
          className={'compact'}
          style={{
            border: 0,
            background: 'dodgerblue',
            marginRight: '3px',
            borderRadius: '5px',
            height: '24px',
          }}
          size={'small'}
          onClick={this.onClick}
        >
          {this.state.buttonLabel}
        </Button>

        <Portal onClose={this.handleClose} open={this.state.open}>
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
              backgroundColor: 'rgba(250,250,250,0.95)',
              padding: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'nowrap',
                flexDirection: 'row',
                flexGrow: 1,
                // todo: check the theme:
                background: this.theme.isLight ? 'rgb(48,48,48)' : 'rgb(187,187,188)',
                width: '100%',
                height: '24px',
                position: 'sticky',
                top: 0,
                paddingTop: '0px',
                marginTop: '0px',

                // overflowX: 'auto',
                // overflowY: 'auto',
              }}
            >
              <ReactToPrint
                trigger={() => {
                  // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                  // to the root node of the returned component as it will be overwritten.
                  return <button>{'🖫'}</button>;
                }}
                content={() => this.componentRef}
              />
              {/*<button onClick={this.onClickSaveButton}>{'🖫'}</button>*/}
            </div>
            <div ref={(el) => (this.componentRef = el)} dangerouslySetInnerHTML={{ __html: this.state.preview }} />
          </Segment>
        </Portal>
      </div>
    );
  }
}

export default PVGridReportButtonCellRenderer;
