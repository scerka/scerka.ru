import { src, dest, parallel } from 'gulp';
import concat from 'gulp-concat';
import autoprefixer from 'gulp-autoprefixer';
import sass from 'sass';
import gulpsass from 'gulp-sass';
import htmlmin from 'gulp-htmlmin';
import strip from 'gulp-strip-comments';
import terser from 'gulp-terser';
import webp from 'gulp-webp';
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';

const scss = gulpsass(sass);

export const css = () => {
    return src('./src/sass/*.scss')
        .pipe(scss({ outputStyle: 'compressed'}))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(dest('./dist/css'));
};

export const html = () => {
    return src('./src/*.html',)
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
        }))
        .pipe(dest('./dist',));
};

export const javascript = () => {
    return src('./src/js/*.js')
        .pipe(strip())
        .pipe(terser())
        .pipe(concat('libs.js'))
        .pipe(dest('./dist/js'));
};

export const fonts = () => {
    return src('./src/fonts/*.*', {encoding: false})
        .pipe(dest('./dist/fonts'));
};

export const images = (done) => {
    src('./src/img/*.*', {encoding: false})
        .pipe(imagemin([mozjpeg({quality: 75, progressive: true})]))
        .pipe(dest('./dist/img'));

    src('./src/img/avatar.jpg', {encoding: false})
        .pipe(webp())
        .pipe(dest('./dist/img'));

    done();
};

export default parallel(html, css, javascript, fonts, images);
