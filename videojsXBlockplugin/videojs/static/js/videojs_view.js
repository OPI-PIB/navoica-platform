/* Javascript for videojsXBlock. */
function videojsXBlockInitView(runtime, element) {
    /* Weird behaviour :
     * In the LMS, element is the DOM container.
     * In the CMS, element is the jQuery object associated*
     * So here I make sure element is the jQuery object */
    if (element.innerHTML) element = $(element);

    var video = element.find('video:first');
    var player = videojs(video.get(0), {
        language: 'pl',
        textTrackSettings: false
    });

    function UrlExists(url) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status != 404;
    }

    var source = video.find("source:first");
    var url = $(source[0]).attr("src");

    var sources = [
        {format: 'hd720', src: url.replace("videos", "1280x720"), type: 'video/mp4'},
        {format: '480p', src: url.replace("videos", "858x480"), type: 'video/mp4'},
        {format: '360p', src: url.replace("videos", "640x360"), type: 'video/mp4'},
    ];

    var checked_source = [];
    var formats = [];
    sources.forEach(function (entry) {
        if (UrlExists(entry.src)) {
            checked_source.push(entry);
            formats.push({code: entry.format, name: entry.format});
        }
    });
    formats.push({code: 'auto', name: 'Auto'});

    player.qualityselector({
        sources: checked_source,
        formats: formats,
        onFormatSelected: function (format) {
            console.log(format);
        }
    });
}
