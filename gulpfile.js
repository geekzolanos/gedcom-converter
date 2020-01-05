const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sass = require('gulp-sass');
const inject = require('gulp-inject');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const electron = require('electron-connect').server.create();

function corejs() {
    return gulp.src('src/scripts/*.js')
        .pipe(concat('core.min.js'))
        .pipe(terser({ sourceMap: true }))
        .pipe(gulp.dest('build/scripts'));
}

function pagesjs() {
    return gulp.src('src/pages/scripts/*.js')
        .pipe(terser({ sourceMap: true }))
        .pipe(gulp.dest('build/pages/scripts'));
}

function styles() {
    return gulp.src('src/style/scss/app.scss')
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('build/style'));
}

function vendor() {
    const css = gulp.src('src/style/*.css')
        .pipe(gulp.dest('build/style'));

    const gedcom = gulp.src([
            'src/vendor/gedcom-js-viewer/js/gedcom/const.js',
            'src/vendor/gedcom-js-viewer/js/gedcom/lang.js',
            'src/vendor/gedcom-js-viewer/js/gedcom/toolbox.js',
            'src/vendor/gedcom-js-viewer/js/gedcom/parser.js',
            'src/vendor/gedcom-js-viewer/js/gedcom/plugins.js',
            'src/vendor/gedcom-js-viewer/js/gedcom/entities.js'
        ])
        .pipe(concat('gedcom.min.js'))
        .pipe(gulp.dest('build/scripts'));

    const js = gulp.src('src/vendor/*.js')
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('build/scripts'));

    return merge(css, gedcom, js);
}

function resources() {
    return gulp.src('src/res/**/*')
        .pipe(gulp.dest('build/res'));
}

function pages() {
    return gulp.src('src/pages/*.html')
        .pipe(gulp.dest('build/pages'));
}

function base() {
    const res = gulp.src([
        'build/scripts/vendor.min.js',
        'build/scripts/gedcom.min.js',
        'build/scripts/core.min.js',
        'build/style/style.min.css',
    ], { read: false });

    const root = gulp.src(['src/*', '!src/main.html'])
        .pipe(gulp.dest('build'));

    const main = gulp.src('src/main.html')
        .pipe(inject(res, { relative: true }))
        .pipe(htmlmin({
            minifyCSS: true,
            minifyJS: { compress: { drop_console: true } },
            processConditionalComments: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        }))
        .pipe(gulp.dest('build'));

    return merge(root, main);
}

function watch() {
    gulp.watch('src/scripts/*.js', corejs);
    gulp.watch('src/style/scss/*.scss', styles);
    gulp.watch('src/pages/scripts/*.js', pagesjs);
    gulp.watch('src/pages/*.html', pages);
    gulp.watch(['src/*.html', 'src/*.js'], base);

    electron.start();
}

function clean() {
    return del('build');
}

const _clean = clean;
const _default = gulp.series(clean, gulp.parallel(corejs, pagesjs, styles, vendor, resources, pages), base);
const _watch = gulp.series(_default, watch);

exports.clean = _clean;
exports.watch = _watch;
exports.default = _default;