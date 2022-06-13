import replace from "gulp-replace"; //search and change
import plumber from "gulp-plumber" //errors help
import notify from "gulp-notify"; //notify of errors
import browsersync from "browser-sync" //local server
import newer from "gulp-newer";
import ifPlugin from "gulp-if";


export const plugins = {
    replace: replace,
    plumber: plumber,
    notify: notify,
    browsersync: browsersync,
    newer: newer,
    if: ifPlugin
}