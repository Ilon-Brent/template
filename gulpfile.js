//подключаем модули GULP
const gulp = require('gulp');
const concat = require('gulp-concat');
// const autoprefixer = require('gulp-autoprefixer');<script src="build/js/script.js"></script>
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');

//Порядок подключения CSS файлов
// const cssFiles = [
//     './src/css/main.css',
//     './src/css/media.css'
// ]
const cssFiles = [
    './src/scss/main.scss',
    './src/scss/media.scss',
    './src/scss/animate.scss'
]
//Порядок подключения JS файлов
const jsFiles = [
    './src/js/jQuery.js',
    './src/js/wow.js',
    './src/js/main.js'
]

// Таск на стили CSS
function styles() {
    //Шаблон для поиска файлов CSS
    //Всей файлы по шаблону './src/css/**/*.css'
    return gulp.src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    //Объединение файлов в один
    .pipe(concat('style.css'))
    //Добавить префиксы
    // .pipe(autoprefixer({
    //     browsers: ['last 2 versions'],
    //     cascade: false
    // }))
    //Минификация CSS
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(sourcemaps.write('./'))
    //выходная папка для стилей
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

//Таск на скрипты JS
function scripts() {
    //Шаблон для поиска файлов JS
    //Всей файлы по шаблону './src/js/**/*.js'
    return gulp.src(jsFiles)
    //Объединение файлов в один
    .pipe(concat('script.js'))
    //Минификация JS
    .pipe(uglify({
        toplevel: true
    }))
    //Выходная папка для скриптов
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
}

//Удалять все указанное в папке
function clean() {
    return del(['build/*'])
}


gulp.task('img-compress', () => {
    return gulp.src('./src/img/**')
    .pipe(imagemin({
       progressive: true
    }))
    .pipe(gulp.dest('./build/img/'))
 });
 
//Просматривать файлы
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    //Следить за CSS файлами
    // gulp.watch('./src/css**/*.css', styles)
    gulp.watch('./src/scss/**/*.scss', styles)
    gulp.watch('./src/scss/**/*.sass', styles)
    //Следить за JS файлами
    gulp.watch('./src/js**/*.js', scripts)
    //При изменении HTML запустить синхронизацию
    gulp.watch("./*.html").on('change', browserSync.reload);
}


//Таск вызывающий функцию styles
gulp.task('styles', styles);
//Таск вызывающий функцию scripts
gulp.task('scripts', scripts);
//Таск для очистки папки build
gulp.task('del', clean);
//Таск для отслеживания изменений
gulp.task('watch', watch);
//Таск для удаления файлов впапке build и запуск styles и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts)));
//Таск запускает таск build и watch последовательно
gulp.task('dev', gulp.series('build','watch'));