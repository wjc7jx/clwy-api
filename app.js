const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const midAuth=require('./middlewares/midAuth');

// 管理后台
const adminArticlesRouter = require('./routes/admin/articles');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminSettingsRouter = require('./routes/admin/settings');
const adminUsersRouter = require('./routes/admin/users');
const adminCoursesRouter = require('./routes/admin/courses');
const adminChaptersRouter = require('./routes/admin/chapters');
const adminChartsRouter = require('./routes/admin/charts');
const adminAuthRouter = require('./routes/admin/auth');




const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// 管理后台
app.use('/admin/articles', midAuth,adminArticlesRouter);
app.use('/admin/categories',midAuth, adminCategoriesRouter);
app.use('/admin/settings',midAuth, adminSettingsRouter);
app.use('/admin/users',midAuth, adminUsersRouter);
app.use('/admin/courses', midAuth,adminCoursesRouter);
app.use('/admin/chapters',midAuth, adminChaptersRouter);
app.use('/admin/charts', midAuth,adminChartsRouter);
app.use('/admin/auth', adminAuthRouter);


module.exports = app;
