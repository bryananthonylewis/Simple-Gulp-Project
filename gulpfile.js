// grab our gulp packages
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    htmlmin = require('gulp-htmlmin'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    strip = require('gulp-strip-comments'),
    stripDebug = require('gulp-strip-debug'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    gulpif = require('gulp-if'),

    // set global variables
    HTMLsource = 'development/',
    HTMLdest = 'production/',
    SCSSsource = 'development/scss/',
    SCSSdest = 'production/css/',
    JSsource = 'development/js/',
    JSdest = 'production/js/',
    IMGsource = 'development/images/',
    IMGdest = 'production/images/';

    // Enviorment NODE_ENV is production or development
    env = process.env.NODE_ENV || 'development';

    if (env==='development') {
        // set variables based on enviorment == development
        sassStyle = 'expanded';
        gutil.log('in development enviorment');
    } else {
        // set variables based on enviorment == production
        sassStyle = 'compressed';
        gutil.log('in production enviorment');
    }

    // configure the copyHTML task
    gulp.task('copyHTML', function() {
        // copy any html files in development/ to production/
        gulp.src(HTMLsource + '*.html')
            .pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true
            })) // HTMLminify
            .pipe( gulp.dest(HTMLdest) ) // Output HTML
            .pipe(browserSync.stream()); // Reloading the stream
    });

    // configure the sass task
    gulp.task('buildCSS', function() {
        return gulp.src(SCSSsource + 'styles.scss')
        .pipe(sourcemaps.init()) // Initialize sourcemap plugin
        .pipe(sass({outputStyle: sassStyle}).on('error', sass.logError)) // Process SASS
        .pipe(autoprefixer()) // Passes it through gulp-autoprefixer
        .pipe(sourcemaps.write()) // Writing sourcemaps
        .pipe(strip())
        .pipe(gulp.dest(SCSSdest)) // SCSS processed
        .pipe(browserSync.stream()); // Reloading the stream
    });

    // configure the jshint task
    gulp.task('jshint', function() {
        return gulp.src(JSsource + '*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
    });

    // configure the js task
    gulp.task('buildJS', function() {
        return gulp.src(JSsource + '*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(strip())
        .pipe(gulpif(
            env === 'production', stripDebug()
        ))
        .pipe(uglify())
        .pipe(gulp.dest(JSdest))
        .pipe(browserSync.stream()); // Reloading the stream
    });

    // start browserSync server
    gulp.task('browserSync', function() {
        browserSync({
            server: {
                baseDir: 'production'
            }
        });
    });

    // compress Images Task
    gulp.task('images', function(){
        return gulp.src(IMGsource + '**/*.+(png|jpg|jpeg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest(IMGdest))
    });

    // configure which files to watch and what tasks to use on file changes
    gulp.task('watch', function() {
        gulp.watch(HTMLsource + '*.html', ['copyHTML']);
        gulp.watch(SCSSsource + '*.scss', ['buildCSS']);
        gulp.watch(JSsource + '*.js', ['jshint', 'buildJS']);
    });

    // define the default task and add the watch task to it
    gulp.task('default', ['copyHTML','buildCSS','jshint','buildJS','browserSync','images','watch']);
