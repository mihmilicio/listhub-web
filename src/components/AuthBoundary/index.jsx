import { useAuthCheck } from 'hooks/useAuthCheck';
import { withAppStore } from 'store';

const AuthBoundary = props => {
  const { isAuth } = useAuthCheck();

  return isAuth ? props.children : null;
};

export default withAppStore(AuthBoundary);
