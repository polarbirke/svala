const path = require('path');
const sass = require('sass');
const sassTrue = require('sass-true');

const sassFile = path.join(__dirname, 'test.scss');
sassTrue.runSass(
    { file: sassFile },
    { describe, it, sass },
);
