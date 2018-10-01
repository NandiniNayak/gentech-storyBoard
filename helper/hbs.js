// custom function for truncate, strip tags and format date
const moment = require("moment");
module.exports = {
  truncate: (str, len) => {
    // if the string passed is more than a defined length, only then truncate it
    if (str.length > 0 && str.length > len) {
      let new_str = str;
      new_str = str.substring(0, len);
      return new_str + "...";
    }
    return str;
  },
  stripTags: input => {
    // return input.replace(/<(?:.|\n)*?>/gm, "");
    return input.replace(/^(<(?:.|\n)*?>)|(<\/(?:.|\n)*?>)$/gm, "");
  },
  // helper function to fomat the date
  formatDate: (date, format) => {
    return moment(date).format(format);
  },
  select: function(value, options) {
    return options
      .fn(this)
      .split("\n")
      .map(function(v) {
        var t = 'value="' + value + '"';
        return !RegExp(t).test(v)
          ? v
          : v.replace(t, t + ' selected="selected"');
      })
      .join("\n");
  }
};
