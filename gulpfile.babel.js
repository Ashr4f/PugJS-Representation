/* eslint-disable no-console */
import {watch, task, src, dest, series} from "gulp";

import pug from "gulp-pug";
import prettyHtml from "gulp-pretty-html";

import autoprefixer from "gulp-autoprefixer";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import uglify from "gulp-uglify";
import babel from "gulp-babel";

import plumber from "gulp-plumber";
import gutil from "gulp-util";
import notify from "gulp-notify";

import glr from "gulp-livereload";
import StaticServer from "static-server";

const server = new StaticServer({
    rootPath: "./dist/",
    port: 1337,
});

task("copy-server-files", done => {
    src(["./src/!(pug|scss|css|js)**/*", "./src/!(pug|scss|css|js)**"], {
        base: "./src",
    })
        .pipe(plumber())
        .pipe(dest("./dist/"))
        .pipe(glr());
    done();
});

task("compile-pug", done => {
    src("./src/pug/!(_)*.pug", {base: "./src/pug"})
        .pipe(
            plumber({
                errorHandler(err) {
                    notify.onError({
                        title: `Gulp error in ${err.plugin}`,
                        message: err.message,
                    })(err);
                    gutil.beep();
                },
            }),
        )
        .pipe(
            pug({
                pretty: true,
            }),
        )
        .pipe(prettyHtml())
        .pipe(dest("./dist"))
        .pipe(glr());
    done();
});

task("compile-sass", done => {
    src(["./src/scss/**/!(_)*.sass", "./src/scss/**/!(_)*.scss"])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                outputStyle: "compressed",
                precision: 10,
                includePaths: ["."],
                onError: console.error.bind(console, "Sass error:"),
            }),
        )
        .pipe(autoprefixer())
        .pipe(sourcemaps.write("."))
        .pipe(dest("./dist/css/"))
        .pipe(glr());
    done();
});

task("minify-js", done => {
    src("./src/js/**/*.js", {base: "./src/js"})
        .pipe(babel())
        .pipe(uglify())
        .pipe(dest("./dist/js"))
        .pipe(glr());
    done();
});

exports.default = done => {
    server.start(() => {
        console.log("Server listening to port", server.port);
    });
    glr.listen();
    watch(
        [
            "./src/!(pug|scss|sass|css|js)**/*",
            "./src/pug/**/*.pug",
            "./src/scss/**/*.s(a|c)ss",
            "./src/js/**/*.js",
        ],
        series("copy-server-files", "compile-pug", "compile-sass", "minify-js"),
    );
    done();
};
