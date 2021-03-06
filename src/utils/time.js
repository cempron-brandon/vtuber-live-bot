const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const relativeTime = require('dayjs/plugin/relativeTime')
const localizedFormat = require('dayjs/plugin/localizedFormat')
const isTomorrow = require('dayjs/plugin/isTomorrow')

dayjs.extend(localizedFormat);
dayjs.extend(isTomorrow);
// dayjs.extend(advancedFormat);
dayjs.extend(utc);
const thresholds = [
    { l: "s", r: 1 },
    { l: "m", r: 1 },
    { l: "mm", r: 59, d: "minute" },
    { l: "h", r: 1 },
    { l: "hh", r: 23, d: "hour" },
    { l: "d", r: 1 },
    { l: "dd", r: 29, d: "day" },
    { l: "M", r: 1 },
    { l: "MM", r: 11, d: "month" },
    { l: "y" },
    { l: "yy", d: "year" },
];
dayjs.extend(relativeTime, {
    thresholds,
});

const formatDuration = (secs) => {
    return secs > 60 * 60 * 1000 ? dayjs.utc(secs).format("H:mm:ss") : dayjs.utc(secs).format("m:ss");
}

const localizedDayjs = (time, lang) => {
    // eslint-disable-next-line no-param-reassign
    if (lang === "zh") lang = "zh-tw";
    return dayjs(time).locale(lang).local();
}

const formatDistance = function (time, lang = "en") {
    let diff;
    if (!time) return "?";
    if (Math.abs(dayjs().diff(time, "minutes")) < 1) return "Starting soon";
    if (Math.abs(dayjs().diff(time, "hour")) > 23) return localizedDayjs(time, lang).format("LLL");
    const timeObj = localizedDayjs(time, lang);
    if (new Date(time) > Date.now()) {
        diff = ['Starts', timeObj.fromNow(), `(${timeObj.format(`${timeObj.isTomorrow() ? "ddd " : ""}LT`)})`].join(' ');
        return diff;
    }
    diff = [timeObj.fromNow(), `(${timeObj.format("LT")})`].join(' ');
    return diff;
}

module.exports = { 
    dayjs,
    formatDuration,
    localizedDayjs,
    formatDistance,
};
