import * as React from 'react';
import styled from 'styled-components';

class FloatingHelp extends React.Component<{
  className?: string
}, {}> {

  render() {
    return (
      <div className={this.props.className}>
        <div className="pt-callout" style={innerStyle}>
          {this.props.children}
        </div>
      </div>
    );
  }

}

const innerStyle = {
  left: '-50%',
};

export default styled(FloatingHelp)`
position: absolute;
top: 20%;
left: 50%;
pointer-events: none;
`;
