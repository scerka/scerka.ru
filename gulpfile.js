import gulp from 'gulp';
import concat from 'gulp-concat';
import htmlmin from 'gulp-htmlmin';
import sass from 'gulp-sass';
import sassCompiler from 'node-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify-es';
import strip from 'gulp-strip-comments';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import clean from 'gulp-clean';

sass.compiler = sassCompiler;

const path = {
    src : {
        html: './src/*.html',
        sass: './src/sass/*.scss',
        js: './src/js/*.js',
        img: './src/img/*.*',
        fonts: './src/fonts/*.*',
        yohoho: './src/yohoho/*'
    },
    dist:  {
        html: './dist',
        css: './dist/css',
        js: './dist/js',
        img: './dist/img',
        fonts: './dist/fonts',
        yohoho: './dist/yohoho/*'
    }
};

export const html = () => {
    return gulp.src(path.src.html)
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
        }))
        .pipe(gulp.dest(path.dist.html))
};

export const css = () => {
    return gulp.src(path.src.sass)
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(cleanCSS({
            level: {
                1: {
                    specialComments: 0
                }
            }
        }))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(path.dist.css));
};

export const javascript = () => {
    return gulp.src(path.src.js)
        .pipe(strip())
        .pipe(uglify.default())
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(path.dist.js))
};

export const avatarToWebp = (done) => {
    gulp.src('./src/img/avatar.jpg')
        .pipe(webp())
        .pipe(gulp.dest('./dist/img'))
        done();
};

export const image = () => (
    gulp.src(path.src.img)
        .pipe(imagemin([
            imagemin.mozjpeg({
                quality: 75,
                progressive: true
            })
        ]))
        .pipe(gulp.dest(path.dist.img))
);

export const delFolder = () => {
    return gulp.src('./dist', { read: false, allowEmpty: true })
        .pipe(clean());
};

export const copy = (done) => {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dist.fonts))
        done();
};

export const copyYohoho = (done) => {
    gulp.src(path.src.yohoho)
        .pipe(gulp.dest(path.dist.yohoho))
        done();
};

export const watch = () => {
    gulp.watch(path.src.sass, gulp.series(css));
    gulp.watch(path.src.js, gulp.series(javascript));
    gulp.watch(path.src.html, gulp.series(html));
    gulp.watch(path.src.img, gulp.series(image));
};

export const build = gulp.series(
    delFolder,
    gulp.parallel(html, css, javascript, image, avatarToWebp, copy, copyYohoho)
);

export default build;
