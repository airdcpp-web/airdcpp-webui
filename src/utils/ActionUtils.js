import LoginStore from 'stores/LoginStore';
import invariant from 'invariant';


export const actionFilter = (action, itemData) => {
	return !itemData || !action.filter || action.filter(itemData);
};

export const actionAccess = (action) => {
	invariant(!action.hasOwnProperty('access') || action.access, 'Invalid access supplied for an action ' + action.displayName);
	return !action.access || LoginStore.hasAccess(action.access);
};

export const showAction = (action, itemData) => {
	return actionFilter(action, itemData) && actionAccess(action, itemData);
};