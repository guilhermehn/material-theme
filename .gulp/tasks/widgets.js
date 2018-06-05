'use strict';

/*
 * > Widgets
 */

import gulp from 'gulp';
import paths from '../paths';
import colors from 'colors';
import path from 'path';
import runSequence from 'run-sequence';
import _ from 'lodash';
import common from '~/sources/settings/commons';

const $ = require('gulp-load-plugins')();

gulp.task('build:widgets', ['clean:widgets'], cb => {
	runSequence('build:widget-themes', 'build:widget-settings', error => {
		if (error) {
			console.log(
				'[build:widgets]'.bold.magenta +
					' There was an issue building widgets:\n'.bold.red +
					error.message
			);
		} else {
			console.log(
				'\n[build:widgets]'.bold.magenta +
					' Finished successfully \n'.bold.green
			);
		}

		cb(error);
	});
});

gulp.task('build:widget-themes', () =>
	gulp.src(`${paths.src}/settings/specific/*.json`).pipe(
		$.flatmap((stream, file) => {
			const basename = path.basename(file.path, path.extname(file.path));

			return gulp
				.src(`${paths.src}/widgets/widget.stTheme`)
				.pipe($.data(() => _.merge(common, require(file.path))))
				.pipe($.template())
				.pipe(
					$.rename(widget => {
						widget.basename = 'Widget - ' + basename;
					})
				)
				.pipe(gulp.dest(paths.widgets));
		})
	)
);

gulp.task('build:widget-settings', () =>
	gulp.src(`${paths.src}/settings/specific/*.json`).pipe(
		$.flatmap((stream, file) => {
			const basename = path.basename(file.path, path.extname(file.path));

			return gulp
				.src(`${paths.src}/widgets/widget.sublime-settings`)
				.pipe($.data(() => _.merge(common, require(file.path))))
				.pipe($.template())
				.pipe(
					$.rename(widget => {
						widget.basename = 'Widget - ' + basename;
					})
				)
				.pipe(gulp.dest(paths.widgets));
		})
	)
);
