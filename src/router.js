import React from 'react';
import { 
    routerRedux, 
    Switch 
} from 'dva/router';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
// import { getRouterData } from './common/router';
// import Authorized from './utils/Authorized';
// import { getQueryPath } from './utils/utils';

const { ConnectedRouter } = routerRedux;
// const { AuthorizedRoute } = Authorized;

function RouterConfig({ history, app }) {
//   const routerData = getRouterData(app);
//   const UserLayout = routerData['/user'].component;
//   const BasicLayout = routerData['/'].component;
  return (
    //   <h1>Hello Rod</h1>
    <LocaleProvider locale={enUS}>
      <ConnectedRouter history={history}>
        <Switch>
            <h1>Hello Word</h1>
          {/* <Route path="/user" component={UserLayout} />
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            authority={['admin', 'agent', 'emp']}
            redirectPath={getQueryPath('/user/login', {
              redirect: window.location.href,
            })}
          /> */}
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
