import React from 'react';
// import ResizeAware from 'react-resize-aware';
import PVGauge from './PVGauge';
import axios, { AxiosResponse } from 'axios';
import { ic_multiline_chart as ScoreIcon } from 'react-icons-kit/md/ic_multiline_chart';
import { ic_child_care as ChildrenIcon } from 'react-icons-kit/md/ic_child_care';
import { check as ConsentIcon } from 'react-icons-kit/fa/check';
import { book_2 as AwarenessIcon } from 'react-icons-kit/ikons/book_2';
import { unlocked as DataBreachIcon } from 'react-icons-kit/iconic/unlocked';
import { blackTie as DataProtnOfficerIcon } from 'react-icons-kit/fa/blackTie';
import { iosPricetagsOutline as IndividualsRightsIcon } from 'react-icons-kit/ionicons/iosPricetagsOutline';
import { info as InformationYouHoldIcon } from 'react-icons-kit/icomoon/info';
import { globe as InternationalIcon } from 'react-icons-kit/ikons/globe';
import { balanceScale as LawfulBasisIcon } from 'react-icons-kit/fa/balanceScale';
import { shareAlt as PrivacyImpactAssessmentIcon } from 'react-icons-kit/fa/shareAlt';
import { eyeBlocked as PrivacyNoticesIcon } from 'react-icons-kit/icomoon/eyeBlocked';
import { download as SubjectAccessRequestIcon } from 'react-icons-kit/entypo/download';

import Icon from 'react-icons-kit';
import PontusComponent, { PVComponentProps } from './PontusComponent';
import { ScoreType } from './types';

/***************************
 * UserList Component
 ***************************/

export interface PVGDPRScoreProps extends PVComponentProps {
  url?: string;
  scoreType: ScoreType;
  showText?: boolean;
  showExplanation?: boolean;
  showIcon?: boolean;
  showGauge?: boolean;
}

export interface PVGDPRScoreState extends PVGDPRScoreProps {
  scoreValue: number;
  scoreExplanation: string;
}

class PVGDPRScores extends PontusComponent<PVGDPRScoreProps, PVGDPRScoreState> {
  weight: number;
  errCounter: number;
  latestStatus: number;
  iconMap: Record<ScoreType, JSX.Element> = {
    Awareness: <Icon icon={AwarenessIcon} />,
    Children: <Icon icon={ChildrenIcon} />,
    Consent: <Icon icon={ConsentIcon} />,
    DataBreach: <Icon icon={DataBreachIcon} />,
    DataProtnOfficer: <Icon icon={DataProtnOfficerIcon} />,
    IndividualsRights: <Icon icon={IndividualsRightsIcon} />,
    InformationYouHold: <Icon icon={InformationYouHoldIcon} />,
    International: <Icon icon={InternationalIcon} />,
    LawfulBasis: <Icon icon={LawfulBasisIcon} />,
    PrivacyImpactAssessment: <Icon icon={PrivacyImpactAssessmentIcon} />,
    PrivacyNotices: <Icon icon={PrivacyNoticesIcon} />,
    SubjectAccessRequest: <Icon icon={SubjectAccessRequestIcon} />,
  };
  scoreIcon: JSX.Element;
  weightMap: Record<ScoreType, number> = {
    Awareness: 1,
    Children: 2,
    Consent: 6,
    DataBreach: 6,
    DataProtnOfficer: 1,
    IndividualsRights: 1,
    International: 1,
    LawfulBasis: 1,
    InformationYouHold: 4,
    PrivacyImpactAssessment: 6,
    PrivacyNotices: 6,
    SubjectAccessRequest: 4,
  };
  h_request?: NodeJS.Timeout;

  constructor(props: PVGDPRScoreProps) {
    super(props);
    // this.url = "/gateway/sandbox/pvgdpr_graph";

    this.scoreIcon = <Icon icon={ScoreIcon} />;

    this.errCounter = 0;
    this.state = {
      ...props,
      scoreExplanation: '',
      scoreValue: 0,
    };

    this.weight = 0;

    this.latestStatus = 200;

    // this.title = "Children";
    // this.icon = ic_child_care;
    //
    //
    // this.state = {
    //   scoreExplanation: "This score reflects the fact that 34 children do not have consent, and " +
    //   "23 do not have a parent or guardian configured",
    //   scoreValue: 45
    // };
  }

  componentDidMount() {
    this.ensureData();
  }

  componentDidUpdate(prevProps: Readonly<PVGDPRScoreProps>, prevState: Readonly<PVGDPRScoreState>, snapshot?: any) {
    this.ensureData();
  }

  ensureData = () => {
    let url = this.url;
    if (this.h_request) {
      clearTimeout(this.h_request);
    }

    let reqHeaders =
      //window.keycloakInstance ?
      // {
      //   'Content-Type': 'application/json'
      // , 'Accept': 'application/json'
      // , 'Authorization': "JWT " + window.keycloakInstance.token
      // }
      //   :
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

    let self = this;

    this.h_request = setTimeout(() => {
      let CancelToken = axios.CancelToken;
      self.req = CancelToken.source();

      // http.post(url)
      this.post(url, self.getSearchQuery(), {
        maxRedirects: 0,
        validateStatus: (status) => {
          self.latestStatus = status;
          return status >= 200 && status < 300;
        },
        headers: reqHeaders,
        cancelToken: self.req.token,
      })
        .then(self.onSuccessProxy)
        .catch((thrown) => {
          if (thrown && axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
          } else {
            self.onError(thrown);
          }
        });
    }, 50);
  };
  onError = (err: any) => {
    this.errCounter++;
    // if (this.lastestStatus == 302)
    if (this.errCounter < 25) {
      // {
      //   axios.get('/gateway/sandbox/pvgdpr_gui/bootstrap-toast.css', {maxRedirects: 10, validateStatus: (status) => {
      //     this.lastestStatus = status;
      //     return status >= 200 && status < 400;
      //   }}).then((resp)=>{
      //     resp.status;
      //     /// TODO: finish this!!!!  GET THE HEADER, try again, but with the JWT token in the header!
      //   })
      // }

      this.ensureData();
    }
  };

  onSuccessProxy = (resp: AxiosResponse) => {
    this.errCounter = 0;

    this.onSuccess(resp);
  };

  onSuccess = (resp: AxiosResponse) => {
    let respParsed: any = {};

    try {
      if (typeof resp !== 'object') {
        respParsed = JSON.parse(resp);
      } else {
        respParsed = resp;
      }
      if (respParsed.status === 200) {
        let data = JSON.parse(respParsed.data.result.data['@value'][0]);
        this.setState({
          scoreExplanation: data.scoreExplanation,
          scoreValue: data.scoreValue,
          scoreType: this.props.scoreType,
        });
        const weight = this.weightMap[this.props.scoreType!];

        this.emit('on-score-changed', {
          scoreValue: data.scoreValue,
          title: PontusComponent.t(`NavPanel${this.props.scoreType}Popup_title`),
          weight: weight,
        });
      }
    } catch (e) {
      // e;
    }
  };

  getSearchQuery = () => {
    return {
      gremlin: PontusComponent.t(`NavPanel${this.props.scoreType}Popup_query`),

      bindings: {
        // pg_from: from
        // , pg_to: to
        // , pg_orderCol: sortcolId
        // , pg_orderDir: sortdir
      },
    };
  };

  onClickGauge = () => {
    // if (this.props.complyPanel) {
    //   this.props.complyPanel.setState({ selected: this.title });
    // }
  };

  render() {
    // var eventHub = this.props.glEventHub;
    //         <Graph graph={this.state.graph} options={this.state.options} events={this.state.events}/>
    const text = PontusComponent.t(`NavPanel${this.props.scoreType}Popup_text`)!;
    const explanation = this.state.scoreExplanation;
    const title = PontusComponent.t(`NavPanel${this.props.scoreType}Popup_title`)!;
    const icon = this.iconMap[this.props.scoreType!];

    const textComp = <p>{text}</p>;
    const explanationComp = <p>{explanation}</p>;
    const gaugeComp = (
      <PVGauge
        min={0}
        max={100}
        autoResize={true}
        backgroundColor={this.theme.isLight ? 'white' : 'black'}
        value={this.state.scoreValue}
        width={150}
        height={130}
        label={title}
        valueLabelStyle={{
          textAnchor: 'middle',
          fill: this.theme.isLight ? '#ffffff' : '#000000',
          stroke: 'none',
          fontStyle: 'normal',
          fontVariant: 'normal',
          fontWeight: 'bold',
          fontStretch: 'normal',
          lineHeight: 'normal',
          fillOpacity: 1,
        }}
      />
    );

    return (
      <div>
        {this.props.showIcon ? icon : <div />}
        {this.props.showText ? textComp : <div />}
        {this.props.showExplanation ? explanationComp : <div />}
        {this.props.showGauge ? gaugeComp : <div />}
      </div>
    );
  }
}

export default PVGDPRScores;
