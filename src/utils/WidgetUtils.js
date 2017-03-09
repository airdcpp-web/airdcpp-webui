const createId = (widgetInfo) => widgetInfo.typeId + '_' + Math.floor((Math.random() * 100000000) + 1);

const idToSettingKey = (id) => 'widget_' + id;

const idToWidgetType = (id) => {
	const pos = id.indexOf('_');
	return pos !== -1 ? id.substring(0, pos) : id;
};

export default {
	createId,
	idToSettingKey,
	idToWidgetType
};