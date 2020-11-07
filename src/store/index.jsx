import React from 'react';
import AppContext from './context';

export default class AppStore extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = Object.assign({
      userId: null,
      name: null,
      lists: []
    })
  }

  render() {
    return (
      <AppContext.Provider
        value={{
          state: this.state,
          actions: {
            setUser: (data, callback = () => {}) => {
              this.setState((oldState) => ({ ...oldState, ...data }), callback);
            },
            setLists: (lists, callback = () => {}) => {
              this.setState((oldState) => ({ ...oldState, lists }), callback);
            }
          }
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

export function withAppStore(Component) {
  return function connectedComponent(props) {
    return (
      <AppContext.Consumer>
        {({ state, actions }) => (
          <Component {...props} appStore={{ state, actions }} />
        )}
      </AppContext.Consumer>
    )
  }
}
