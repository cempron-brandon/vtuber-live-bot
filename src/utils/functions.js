const formatters = {};

exports.formatCount = (n, lang = "en") => {
    if (!formatters[lang])
        formatters[lang] = new Intl.NumberFormat(lang, { compactDisplay: "short", notation: "compact" });
    let num = n;
    if (typeof n === "string") num = +n;
    return formatters[lang].format(num);
}