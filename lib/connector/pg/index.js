const withoutBody = require('./withoutBody');
const withBody = require('./withBody');

exports.GET = withoutBody;
exports.DELETE = withoutBody;
exports.POST = withBody;
exports.PATCH = withBody;
