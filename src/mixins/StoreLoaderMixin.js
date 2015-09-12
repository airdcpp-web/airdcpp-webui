module.exports = function(store){
    return {
        componentDidMount: store.load,
        componentWillUnmount: store.unload
    };
};