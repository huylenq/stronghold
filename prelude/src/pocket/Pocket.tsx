import * as React from 'react';
import * as json2csv from 'json2csv';
import { isTouchDevice } from 'utils/platform';
import {
  Button,
  Text,
  Switch,
  ProgressBar,
} from '@blueprintjs/core';
import {
  Table,
  Column,
  TableLoadingOption,
  Cell,
  TruncatedFormat,
} from '@blueprintjs/table';
import styled from 'styled-components';

const CONSUMER_KEY = '71182-21ca899c29444251d8a1fc2d';

enum Step {
  Init,
  Authorizing,
  Authorized,
  Fetching,
  Fetched,
}

interface IPocketProps {
  access_token?: string;
}

interface IPocketState {
  step: Step;
  visibleData: any;
  favoriteOnly?: boolean;
}

export default class Pocket extends React.Component<IPocketProps, IPocketState> {
  requestToken: string | null;
  data: any = [];

  constructor(props: any, context: {}) {
    super(props, context);
    this.requestToken = new URLSearchParams(window.location.search).get('request_token');
    if (this.requestToken) {
      history.pushState(null, '', location.href.split('?')[0]);
    }
    this.state = {
      step: this.requestToken ? Step.Authorized : Step.Init,
      visibleData: [],
    };
  }

  authorize = () => {
    window.location.href = '/connect/pocket/authorize';
    this.setState({step: Step.Authorizing});
  }

  fetch = () => {
    this.setState({step: Step.Fetching});
    fetch(`/connect/pocket/fetch?request_token=${this.requestToken}`, {method: 'GET'})
        .then(resp => resp.json())
        .then(json => json['data'])
        .then(data => {
          this.data = (Object as any).values(data);
          this.setState({
            step: Step.Fetched
          });
          this.applyFilter();
          (window as any)._data = data;
        });
  }

  componentDidMount() {
    if (this.state.step === Step.Authorized) {
      this.fetch();
    }
  }

  render() {
    const numRows = this.state.step === Step.Fetched ? this.state.visibleData.length : 40;
    const loadingOptions = this.state.step === Step.Fetched
                         ? []
                         : [TableLoadingOption.CELLS, TableLoadingOption.ROW_HEADERS];
    return (
      <Container>
        {this.state.step < Step.Authorized &&
         <Button
           loading={this.state.step === Step.Authorizing}
           disabled={this.state.step > Step.Authorizing}
           className="pt-intent-primary pt-large"
           onClick={this.authorize}
         >
           <ButtonInnerImage
             src="http://icons.iconarchive.com/icons/martz90/circle/512/pocket-icon.png"
             width="24px"
             height="24px"
           />
           <span>
             {this.state.step <= Step.Authorizing ? 'Authorize Pocket' : 'Authorized'}
           </span>
         </Button>
        }
        {this.state.step >= Step.Authorized &&
         <div style={{height: '100%'}}>
           <Controls>
             {this.state.step === Step.Fetching &&
               <FetchingProgressBar />
             }
             {this.state.step === Step.Fetched &&
             <FavoriteSwitch
               checked={this.state.favoriteOnly}
               onChange={this.onFavoriteOnlySwitchChange}
             >
               Favorites Only
             </FavoriteSwitch>
             }
             {false && this.state.step === Step.Fetched &&
             <DownloadButton onClick={this.onDownloadButtonClick} className="pt-icon-download pt-intent-success">
               Download CSV
             </DownloadButton>
             }
             {this.state.step === Step.Fetched &&
             <DownloadButton onClick={this.onDownloadHTMLButtonClick} className="pt-icon-download pt-intent-success">
               Download HTML
             </DownloadButton>
             }
           </Controls>
           <ArticleTable
             numRows={numRows}
             // isColumnReorderable
             loadingOptions={loadingOptions}
             columnWidths={[240, 360, 80, 80, 100]}
           >
             <Column name="Title" renderCell={this.renderTitle}  />
             <Column name="Excerpt" renderCell={this.renderExcerpt} />
             <Column name="Favorite" renderCell={this.renderFavorite} />
             <Column name="Type" renderCell={this.renderType} />
             <Column name="Time Added" renderCell={this.renderTimeAdded} />
           </ArticleTable>
         </div>
        }
      </Container>
    );
  }

  renderTitle = (index) => {
    const record = this.state.visibleData[index];
    if (!record) { return <Cell />; }
    const title = record.given_title || record.given_url;
    return (
      <Cell>
        <a href={record.given_url}>{title}</a>
      </Cell>
    );
  }

  renderExcerpt = (index) => {
    const record = this.state.visibleData[index];
    if (!record) { return <Cell />; }
    return <Cell><TruncatedFormat>{record.excerpt}</TruncatedFormat></Cell>;
  }

  renderFavorite = (index) => {
    const record = this.state.visibleData[index];
    if (!record) { return <Cell />; }
    return <Cell>{record.favorite === '1' ? 'Yes' : 'No'}</Cell>;
  }

  renderType = (index) => {
    const record = this.state.visibleData[index];
    if (!record) { return <Cell />; }
    return <Cell>{record.type}</Cell>;
  }

  renderTimeAdded = (index) => {
    const record = this.state.visibleData[index];
    if (!record) { return <Cell />; }
    const time = new Date(record.time_added * 1000);
    return <Cell>{`${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}`}</Cell>;
  }

  onFavoriteOnlySwitchChange = () => {
    this.setState(prev => ({favoriteOnly: !prev.favoriteOnly}));
    this.applyFilter();
  }

  applyFilter() {
    this.setState(prev => {
      return {
        visibleData: prev.favoriteOnly
                   ? this.data.filter(item => item.favorite === '1')
                   : this.data
      };
    });
  }

  onDownloadButtonClick = () => {
    const content = json2csv({
      data: this.state.visibleData,
      fields: ['given_title', 'exerpt', 'given_url', 'time_added', 'time_read']
    });
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([content], {type: 'text/csv'}));
    a.download = 'pocket.csv';

    // Append anchor to body.
    document.body.appendChild(a);
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);
  }

  onDownloadHTMLButtonClick = () => {
    const content = `
      <!DOCTYPE html>
      <html>
        <!--So long and thanks for all the fish-->
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>Pocket Export</title>
        </head>
        <body>
          <h1>Unread</h1>
          <ul>
            ${this.state.visibleData.filter(item => item.type === 'unread').map(item => item2html(item)).join('')}
          </ul>
          <h1>Read Archive</h1>
          <ul>
            ${this.state.visibleData.filter(item => item.type === 'archive').map(item => item2html(item)).join('')}
          </ul>
        </body>
      </html>
    `;

    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([content], {type: 'text/html'}));
    a.download = 'pocket.html';
    // Append anchor to body.
    document.body.appendChild(a);
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);
  }

}

function item2html(item: any) {
  const title = item.given_title || item.given_url;
  return `<li><a href="${item.given_url}" time_added="${item.time_added}" tags="">${title}</a></li>`;
}

const ArticleTable = styled(Table)`
height: 90%;
margin: auto;
`;

const PendingActionLabel = styled(Text)`
margin-bottom: 1em;
`;

const Container = styled.div`
flex-direction: column;
display: flex;
height: 100vh;
justify-content: center;
align-items: center;
`;

const FavoriteSwitch = styled(Switch)`
margin-bottom: 0px;
`;

const DownloadButton = styled(Button)`
margin: auto;
margin-left: 1em;
`;

const FetchingProgressBar = styled(ProgressBar)`
minHeight: 2em;
`;

const Controls = styled.div`
display: flex;
align-items: center;
margin: 1em auto;
height: 2em;
`;

const ButtonInnerImage = styled.img`
vertical-align: middle;
margin-right: 0.5em;
`;
