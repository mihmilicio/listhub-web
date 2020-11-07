import { withAppStore } from 'store';
import { useAuthCheck } from 'hooks/useAuthCheck';

const Home = props => {
  const { router } = useAuthCheck(() => router.push('/lists'));

  return null;
};

export default withAppStore(Home);
