const gulp = require('gulp');

//converts sass to css
const sass = require('gulp-sass');

//converts the css to a single line
const cssnano = require('gulp-cssnano');

//library to rename the files with a hash alongside them
//this hash is attached so that whenever the css is sent to the browser it accepts it as a new file
//re-versioning
const rev = require('gulp-rev');

//gulp contains tasks which need to be created
//when we are using gulp we create tasks which are run

//used to minify the javascript
const uglify = require('gulp-uglify-es').default;

const imagemin = require('gulp-imagemin');

const del = require('del');

//minifying the css
gulp.task('css',function(done){
    console.log('minifying css...');
    gulp.src('./assets/sass/**/*.scss')//any folder or subfolder inside it which containes a scss file
    .pipe(sass())//calling the gulp sass module over all these files
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

    //changing the naming convention
    return gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',//current working directory
        merge:true//if it already exists it will merge it rather than creating new
    }))//store a manifest
    .pipe(gulp.dest('./public/assets'));
    done(); 
});

//minifying js
gulp.task('js',function(done){
    console.log('minifying js....');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

//compressing images
gulp.task('images',function(done){
    console.log('compressing images...');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

//whenever you are building the project you need to clear the previous build and build a new project
//empty the public/assets directory
gulp.task('clean:assets',function(done){
    del.sync('./public/assets');
    done();
});

gulp.task('build',gulp.series('clean:assets','css','js','images'),function(done){
    console.log('building assets');
    done();
});
