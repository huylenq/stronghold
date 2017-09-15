import * as React from 'react';
import styled from 'styled-components';

class FloatingHelp extends React.Component<{
  className?: string
}, {}> {

  render() {
    return (
      <div
        className={'pt-callout ' + this.props.className}
      >
        {this.props.children}
      </div>
    );
  }

}

export default styled(FloatingHelp)`
position: absolute !important;
top: 12px;
left: 12px;
z-index: -1;
`;
