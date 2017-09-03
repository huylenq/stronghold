import * as React from 'react';

export default class Card extends React.Component<{
  onClick?: () => void},
{}> {

  render() {
    return (
      <div
        className="pt-card pt-elevation-1 pt-interactive"
        onClick={this.props.onClick}
      >
        {this.props.children}
      </div>
    );
  }

}
