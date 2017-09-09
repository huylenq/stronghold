import * as React from 'react';

export interface ICardProps {
  onClick?: () => void;
  className?: string;
}

export default class Card extends React.Component<ICardProps, {}> {
  static defaultProps = {
    className: ''
  };

  private _className: string;

  constructor(props: ICardProps) {
    super(props);
    this._className = 'pt-card pt-elevation-1 pt-interactive ' + props.className;
  }

  render() {
    return (
      <div className={this._className} onClick={this.props.onClick} >
        {this.props.children}
      </div>
    );
  }

}
