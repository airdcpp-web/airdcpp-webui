export default {
  loadProperty: (id, defaultData = null) => {
    var savedItem = sessionStorage.getItem(id);
    if (savedItem != null && savedItem != undefined) {
      return JSON.parse(savedItem);
    }

    return defaultData;
  },

  saveProperty: (id, data) => {
    if (data != null && data != undefined) {
      sessionStorage.setItem(id, JSON.stringify(data));
    }
  }
};