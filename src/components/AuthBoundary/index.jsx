import { useAuthCheck } from 'hooks/useAuthCheck';
import { withAppStore } from 'store';

const AuthBoundary = props => {
  useAuthCheck();

  return props.children;
};

export default withAppStore(AuthBoundary);
