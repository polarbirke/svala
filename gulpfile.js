'use strict';

const gulp = require('gulp');
// const log = require('fancy-log');
const sass = require('gulp-sass');

gulp.task('test-scss', function() {
    return gulp.src('test/test.scss')
        .pipe(sass({
            cwd: 'test',
            pipeStdout: true,
            sassOutputStyle: 'expanded',
            includePaths: 'node_modules'
        }).on('error', sass.logError))
        .pipe(gulp.dest('css'))
});