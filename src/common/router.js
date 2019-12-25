import React, { createElement } from 'react';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';
import { getMenuData } from './menu';

let routerDataCache;

const getRouterDataCache = app => {
    if (!routerDataCache) {
      routerDataCache = getRouterData(app);
    }
    return routerDataCache;
};
  

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default);
    }
  });

  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      return createElement(component().default, {
        ...props,
        routerData: getRouterDataCache(app),
      });
    };
  }
  // () => import('module')
  return Loadable({
    loader: () => {
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: getRouterDataCache(app),
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

function findMenuKey(menuData, path) {
    const menuKey = Object.keys(menuData).find(key => pathToRegexp(path).test(key));
    if (menuKey == null) {
      if (path === '/') {
        return null;
      }
      const lastIdx = path.lastIndexOf('/');
      if (lastIdx < 0) {
        return null;
      }
      if (lastIdx === 0) {
        return findMenuKey(menuData, '/');
      }
      return findMenuKey(menuData, path.substr(0, lastIdx));
    }
    return menuKey;
}


export const getRouterData = app => {
    const routerConfig = {
      '/': {
        component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
      },
    }

// Get name from ./menujs or just set it in the router data.
const menuData = getFlatMenuData(getMenuData());

// Route configuration data
// eg. {name,authority ...routerConfig }
const routerData = {};
// The route matches the menu
Object.keys(routerConfig).forEach(path => {
  // Regular match item name
  // eg.  router /user/:id === /user/chen
  const menuKey = findMenuKey(menuData, path);
  let menuItem = {};
  // If menuKey is not empty
  if (menuKey) {
    menuItem = menuData[menuKey];
  }
  let router = routerConfig[path];
  // If you need to configure complex parameter routing,
  // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
  // eg . /list/:type/user/info/:id
  router = {
    ...router,
    name: router.name || menuItem.name,
    authority: router.authority || menuItem.authority,
    hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
  };
  routerData[path] = router;
});
return routerData;
    
}