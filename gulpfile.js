/*
  gulpfile.js
  ===========
*/
var PATHS = {
    src: './src',
    dist: './dist',
    npm: './node_modules',
    bower: './bower_components',
    remote: '/misc/colonel-bruce-tribute'
};

var _ = require('lodash');
var fs = require('fs');
var url = require('url');
var proxy = require('proxy-middleware');
var browserSync = require('browser-sync');
var del = require('del');
var argv = require('yargs').argv;
var through = require('through2');
var ftppass = {};
try { ftppass = require('./.ftppass'); } catch (e) {}

var gulp = require('gulp');
var changed = require('gulp-changed');
var gutil = require('gulp-util');
var sftp = require('gulp-sftp');
var babelify = require('babelify');
var browserify = require('browserify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var less = require('gulp-less');
var notify = require('gulp-notify');
var watch = require('gulp-watch');

var proxies = {
    '/misc/tools': 'http://www.adultswim.com/misc/tools',
    '/tools': 'http://www.adultswim.com/tools',
    '/videos': 'http://www.adultswim.com/videos'
};
var middlewares = _.map(proxies, function(value, key) {
    var opts = url.parse(value);
    opts.route = key;
    return proxy(opts);
});

var CONFIG = {
    copy: {
        src: {
            [PATHS.src + '/media/**']: PATHS.dist + '/media',
            [PATHS.src + '/favicon.ico']: PATHS.dist
        }
    },
    deploy: {
        dev: ftppass.dev ? {
            host: ftppass.dev.host,
            user: ftppass.dev.username,
            pass: ftppass.dev.password,
            remotePath: PATHS.remote
        } : {},
        production: ftppass.production ? {
            host: ftppass.production.host,
            user: ftppass.production.username,
            key: ftppass.production.keyLocation,
            remotePath: PATHS.remote
        } : {},
        staging: ftppass.staging ? {
            host: ftppass.staging.host,
            user: ftppass.staging.username,
            key: ftppass.staging.keyLocation,
            remotePath: PATHS.remote
        } : {}
    },
    fonts: {
        src: [
            PATHS.src + '/fonts/**'
        ],
        output: PATHS.dist + '/fonts'
    },
    markup: {
        src: PATHS.src + '/*.html',
        output: PATHS.dist
    },
    scripts: {
        src: [PATHS.src + '/scripts.js',PATHS.src + '/mobile.js'],
        output: PATHS.dist,
        outputName: ['scripts.js','mobile.js']
    },
    serve: {
        port: 8080,
        server: {
            middleware: middlewares,
            baseDir: PATHS.dist
        }
    },
    styles: {
        src: PATHS.src + '/styles.less',
        output: PATHS.dist,
        outputName: 'styles.css',
        settings: {
            PATHS: [
                PATHS.src + '/styles',
                PATHS.npm,
                PATHS.bower
            ]
        },
        autoprefixer: {
            browsers: [
                '> 1%',
                'last 2 versions'
            ],
            remove: false
        },
        watch: PATHS.src + '/**/*.less'
    },
};


function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    // Send error to notification center with gulp-notify
    notify.onError({
        title: 'Compile Error',
        message: '<%= error %>'
    }).apply(this, args);
    // Keep gulp from hanging on this task
    this.emit('end');
}


gulp.task('clean', (callback) => {
    if (argv.clean === true || argv.c) {
        del([
            PATHS.dist + '/**' //matches everything
        ], callback);
    } else {
        gutil.log(gutil.colors.yellow('Exiting without cleaning.'), '(run gulp -c to clean before building)');
        callback();
    }
});


gulp.task('copy', ['clean'], (callback) => {
    _.forIn(CONFIG.copy.src, (dest, src) => {
        gulp.src(src)
            .pipe(changed(dest))
            .pipe(gulp.dest(dest))
            .pipe(browserSync.reload({
                stream: true
            }));
    });
    return callback();
});


_.forEach(['dev', 'staging', 'production'], name => {
    gulp.task(name, [
        'markup',
        'fonts',
        'styles',
        'uglify'
    ], () => (
        gulp.src(PATHS.dist + '/**')
        .pipe(sftp(CONFIG.deploy[name]))
    ));
});


gulp.task('fonts', ['clean'], () => (
    gulp.src(CONFIG.fonts.src)
        .pipe(changed(CONFIG.fonts.output)) // Ignore unchanged files
        .pipe(gulp.dest(CONFIG.fonts.output))
        .pipe(browserSync.reload({ stream: true }))
));


gulp.task('markup', ['clean'], () => (
    gulp.src(CONFIG.markup.src)
        .pipe(gulp.dest(CONFIG.markup.output))
        .pipe(browserSync.reload({ stream: true }))
));


gulp.task('scripts', ['clean'], () => {
    return gulp.src(CONFIG.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(through.obj((file, enc, next) => {
          browserify(file.path)
            .transform('babelify', {
                comments: false,
                plugins: ['lodash'],
                presets: ['es2015', 'react']
            })
            .bundle((err, res) => {
                file.contents = res;
                next(null, file);
            });
        }))
        .on('error', handleErrors)
        .pipe(gulp.dest(CONFIG.scripts.output))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(CONFIG.scripts.output))
        .pipe(sourcemaps.write())
        .pipe(browserSync.reload({ stream: true }))
});


gulp.task('serve', () => browserSync(CONFIG.serve));


gulp.task('styles', ['clean'], () => (
    gulp.src(CONFIG.styles.src)
        .pipe(sourcemaps.init())
        .pipe(less(CONFIG.styles.settings))
        .on('error', handleErrors)
        .pipe(autoprefixer(CONFIG.styles.autoprefixer))
        .pipe(rename(CONFIG.styles.outputName))
        .pipe(gulp.dest(CONFIG.styles.output))
        .pipe(sourcemaps.write())
        .pipe(browserSync.reload({ stream: true }))
));


gulp.task('uglify', ['scripts'], () => (
    gulp.src(CONFIG.scripts.output + '/' + CONFIG.scripts.outputName)
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(CONFIG.scripts.output))
));

gulp.task('watch', ['serve', 'clean'], () => {
    var copySrc = _.map(CONFIG.copy.src, (dest, src) => src);
    watch(CONFIG.scripts.src, () => {
        gulp.start('scripts');
    });
    watch(CONFIG.styles.watch, () => {
        gulp.start('styles');
    });
    watch(CONFIG.markup.src, () => {
        gulp.start('markup');
    });
    watch(copySrc, () => {
        gulp.start('copy');
    });
});


gulp.task('default', [
    'scripts',
    'styles',
    'fonts',
    'copy',
    'markup',
    'watch'
]);
