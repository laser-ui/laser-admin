import { isUndefined } from 'lodash';
import { Navigate } from 'react-router';

import { LOGIN_PATH } from '../../configs/router';
import { useMenu } from '../../core';

export default function Home(): React.ReactElement | null {
  const [{ firstCanActive }] = useMenu();

  return <Navigate to={isUndefined(firstCanActive) ? LOGIN_PATH : firstCanActive.path} replace />;
}
