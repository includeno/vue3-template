/**
 * 判断是否有路由的权限
 * @param authority 路由权限配置
 * @param permissions 用户权限集合
 * @returns {boolean|*}
 */
function hasPermission(authority, permissions) {
  //console.log("hasPermission permissions:"+JSON.stringify(permissions))
  let required = '*'
  if (typeof authority === 'string') {
    required = authority
  } else if (typeof authority === 'object') {
    //console.log("hasPermission authority:"+JSON.stringify(authority))
    required = authority.permission
  }
  return required === '*' || (permissions && permissions.findIndex(permission => permission === required || permission.name === required) !== -1)
}

/**
 * 判断是否有路由需要的角色
 * @param authority 路由权限配置
 * @param roles 用户角色集合
 */
function hasRole(authority, roles) {
  //console.log("hasRole authority:"+JSON.stringify(authority))
  //console.log("hasRole roles:"+JSON.stringify(roles))
  let required = undefined
  if (typeof authority === 'object') {
    required = authority.role
  }
  return authority === '*' || hasAnyRole(required, roles)
}

/**
 * 判断是否有需要的任意一个角色
 * @param required {String | Array[String]} 需要的角色，可以是单个角色或者一个角色数组
 * @param roles 拥有的角色
 * @returns {boolean}
 */
function hasAnyRole(required, roles) {
  if (!required) {
    return false
  } else if(Array.isArray(required)) {
    return roles.findIndex(role => {
      return required.findIndex(item => item === role || item === role.code) !== -1
    }) !== -1
  } else {
    return roles.findIndex(role => role === required || role.code === required) !== -1
  }
}

/**
 * 路由权限校验
 * @param route 路由
 * @param permissions 用户权限集合
 * @param roles 用户角色集合
 * @returns {boolean}
 */
function hasAuthority(route, permissions, roles) {
  const authorities = [...route.meta.pAuthorities, route.meta.authority]
  for (let authority of authorities) {
    if (!hasPermission(authority, permissions) && !hasRole(authority, roles)) {
      return false
    }
  }
  return true
}

/**
 * 根据权限配置过滤菜单数据
 * @param menuData
 * @param permissions
 * @param roles
 */
function filterMenu(menuData, permissions, roles) {
  return menuData.filter(menu => {
    if (menu.meta && menu.meta.invisible === undefined) {
      if (!hasAuthority(menu, permissions, roles)) {
        return false
      }
    }
    if (menu.children && menu.children.length > 0) {
      menu.children = filterMenu(menu.children, permissions, roles)
    }
    return true
  })
}

export {filterMenu, hasAuthority}
