var gulp = require('gulp'), 
    sass = require('gulp-sass') ,
    notify = require("gulp-notify") ,
    bower = require('gulp-bower'),
    browserSync = require('browser-sync').create();

var config = {
     sassPath: './resources/sass',
     bowerDir: './bower_components' 
}

browserSync.use({
  plugin: function() {},
  hooks: {
    'client:js': '(function (browserSync) {browserSync.socket.on("disconnect", function (client) { window.close(); });})(___browserSync___);'
  }
});

gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(config.bowerDir)) 
});

gulp.task('icons', function() { 
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*') 
        .pipe(gulp.dest('./public/fonts')); 
});
var sassOpts = {
    outputStyle: 'nested',
    precison: 3,
    errLogToConsole: true,
    includePaths: [
        config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
        config.bowerDir + '/fontawesome/scss',
    ]
}
gulp.task('css', function() { 
    return gulp.src(config.sassPath + '/style.scss')
         .pipe(sass(sassOpts) 
            .on("error", notify.onError(function (error) {
                 return "Error: " + error.message;
             }))) 
         .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream());
});

// Rerun the task when a file changes
 gulp.task('watch', function() {
    browserSync.init({
       server: "./public"
    });

    gulp.watch(config.sassPath + '/**/*.scss', ['css']); 
    gulp.watch("./public/*.html").on('change', browserSync.reload);
});

  gulp.task('default', ['bower', 'icons', 'css']);
