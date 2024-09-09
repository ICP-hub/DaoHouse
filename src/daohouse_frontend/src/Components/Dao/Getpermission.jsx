// utils/permissionsUtils.js

export const getTruePermissions = (permissions) => {
    const filteredPermissions = {
      proposal: {},
      voting: {},
    };
  
    Object.keys(permissions.proposal).forEach((groupName) => {
      filteredPermissions.proposal[groupName] = {};
      Object.keys(permissions.proposal[groupName]).forEach((permissionName) => {
        if (permissions.proposal[groupName][permissionName]) {
          filteredPermissions.proposal[groupName][permissionName] = true;
        }
      });
    });
  
    Object.keys(permissions.voting).forEach((groupName) => {
      filteredPermissions.voting[groupName] = {};
      Object.keys(permissions.voting[groupName]).forEach((permissionName) => {
        if (permissions.voting[groupName][permissionName]) {
          filteredPermissions.voting[groupName][permissionName] = true;
        }
      });
    });
  
    return filteredPermissions;
  };
  