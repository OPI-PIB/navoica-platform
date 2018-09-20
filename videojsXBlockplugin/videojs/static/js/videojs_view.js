/* Javascript for videojsXBlock. */
function videojsXBlockInitView(runtime, element) {
    /* Weird behaviour :
     * In the LMS, element is the DOM container.
     * In the CMS, element is the jQuery object associated*
     * So here I make sure element is the jQuery object */
    if (element.innerHTML) element = $(element);

    var video = element.find('video:first');
    var player = videojs(video.get(0));


    videojs.addLanguage('pl', {
        "Play": "Odtwarzaj",
        "Pause": "Pauza",
        "Current Time": "Aktualny czas",
        "Duration": "Czas trwania",
        "Remaining Time": "Pozosta&#x142;y czas",
        "Stream Type": "Typ strumienia",
        "LIVE": "NA &#x17B;YWO",
        "Loaded": "Za&#x142;adowany",
        "Progress": "Status",
        "Fullscreen": "Pe&#x142;ny ekran",
        "Non-Fullscreen": "Pe&#x142;ny ekran niedost&#x119;pny",
        "Mute": "Wy&#x142;&#x105;cz d&#x17A;wi&#x119;k",
        "Unmute": "W&#x142;&#x105;cz d&#x17A;wi&#x119;k",
        "Playback Rate": "Szybko&#x15B;&#x107; odtwarzania",
        "Subtitles": "Napisy",
        "subtitles off": "Napisy wy&#x142;&#x105;czone",
        "Captions": "Transkrypcja",
        "captions off": "Transkrypcja wy&#x142;&#x105;czona",
        "Chapters": "Rozdzia&#x142;y",
        "You aborted the media playback": "Odtwarzanie zosta&#x142;o przerwane",
        "A network error caused the media download to fail part-way.": "Problemy z sieci&#x105; spowodowa&#x142;y b&#x142;&#x105;d przy pobieraniu materia&#x142;u wideo.",
        "The media could not be loaded, either because the server or network failed or because the format is not supported.": "Materia&#x142; wideo nie mo&#x17C;e by&#x107; za&#x142;adowany, poniewa&#x17C; wyst&#x105;pi&#x142; problem z sieci&#x105; lub format nie jest obs&#x142;ugiwany",
        "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "Odtwarzanie materia&#x142;u wideo zosta&#x142;o przerwane z powodu uszkodzonego pliku wideo lub z powodu b&#x142;&#x119;du funkcji, kt&#xF3;re nie s&#x105; wspierane przez przegl&#x105;dark&#x119;.",
        "No compatible source was found for this media.": "Dla tego materia&#x142;u wideo nie znaleziono kompatybilnego &#x17A;r&#xF3;d&#x142;a.",
        "Play Video": "Odtwarzaj wideo",
        "Close": "Zamknij",
        "Modal Window": "Okno Modala",
        "This is a modal window": "To jest okno modala",
        "This modal can be closed by pressing the Escape key or activating the close button.": "Ten modal mo&#x17C;esz zamkn&#x105;&#x107; naciskaj&#x105;c przycisk Escape albo wybieraj&#x105;c przycisk Zamknij.",
        ", opens captions settings dialog": ", otwiera okno dialogowe ustawie&#x144; transkrypcji",
        ", opens subtitles settings dialog": ", otwiera okno dialogowe napis&#xF3;w",
        ", selected": ", zaznaczone"
    });

    player.qualityselector({
        sources: [
            {format: 'hd720', src: player.tagAttributes.src.replace("videos", "1280x720"), type: 'video/mp4'},
            {format: '480p', src: player.tagAttributes.src.replace("videos", "858x480"), type: 'video/mp4'},
            {format: '360p', src: player.tagAttributes.src.replace("videos", "480x360"), type: 'video/mp4'},
        ],
        formats: [
            {code: 'hd720', name: '720p'},
            {code: '480p', name: '480p'},
            {code: '360p', name: '360p'},
            {code: 'auto', name: 'Auto'}
        ],

        onFormatSelected: function (format) {
            console.log(format);
        }
    });

}
