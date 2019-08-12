exports.helloWorldAuth = (req, res) => {
    res.send('hello world order routes authorized user');
};

exports.helloWorldAdmin = (req, res) => {
    res.send('hello world order routes admin');
};