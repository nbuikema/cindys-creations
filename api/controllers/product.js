exports.helloWorldAuth = (req, res) => {
    res.send('hello world product routes authorized user');
};

exports.helloWorldAdmin = (req, res) => {
    res.send('hello world product routes admin');
};