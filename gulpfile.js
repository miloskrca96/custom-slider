import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import terser from 'gulp-terser';
import concat from 'gulp-concat';
import minify from'gulp-clean-css';
import imagemin from 'gulp-imagemin';
import prefix from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';

const sass = gulpSass(dartSass);
const jsPath = "js/**/*.js";
const scssPath = "scss/**/*.scss";

// gulp.task('babelTest', async function () {
//     return gulp.src(requiredFiles)
//            .pipe(babel({presets: ['@babel/preset-env'] })) 
//            .pipe(gulp.dest('dist/js'));
// });

// const babelTask = () => {
//     return gulp.src(jsPath)
//                .pipe(babel({presets: ['@babel/preset-env']}))
//                .pipe()
// }


const copyHtml = () => { 
    return gulp.src('*.html')
               .pipe(gulp.dest('dist'));
}

const imgTask = () => {
    return gulp.src('img/*')
		       .pipe(imagemin())
		       .pipe(gulp.dest('dist/img'));
}

const jsTask = () => {
    return gulp.src(jsPath)
               .pipe(sourcemaps.init())
               .pipe(concat('main.js'))
               .pipe(babel({presets: ['@babel/preset-env']}))
               .pipe(terser())
               .pipe(sourcemaps.write('.'))
               .pipe(gulp.dest('dist/js'));
}


const cssTask = () => {
    return gulp.src(scssPath)
                .pipe(sourcemaps.init())
                .pipe(concat('main.min.css'))
                .pipe(sass())
                .pipe(prefix('last 2 versions'))
                .pipe(minify())
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest('dist/css'))
}

const watchTasks = () => {
    gulp.watch(
        [scssPath, jsPath], 
        {interval : 1000},
        gulp.parallel(cssTask, jsTask)
    );
}

const watch = gulp.series(gulp.parallel(copyHtml, imgTask, cssTask, jsTask), watchTasks)

export { 
    watch
}





