export class FerieBezNudy {
    constructor() {
        $(document).ready(function() {
            if (!$('html').is(':lang(pl)')) {
                var hrefSelector = $('a[href="/FerieBezNudy"]')
                if (hrefSelector.length > 0 ){
                    hrefSelector.closest('li').hide();
                }
            }

            $('a[href*="#"]')
                // Remove links that don't actually link to anything
                .not('[href="#"]')
                .not('[href="#0"]')
                .click(function(event) {
                    // On-page links
                    if (
                        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                        &&
                        location.hostname == this.hostname
                    ) {
                        // Figure out element to scroll to
                        var target = $(this.hash);
                        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                        // Does a scroll target exist?
                        if (target.length) {
                            // Only prevent default if animation is actually gonna happen
                            event.preventDefault();
                            $('html, body').animate({
                                scrollTop: target.offset().top - 100
                            }, 1000, function() {
                                // Callback after animation
                                // Must change focus!
                                var $target = $(target);
                                $target.focus();
                                if ($target.is(":focus")) { // Checking if the target was focused
                                    return false;
                                } else {
                                    $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                                    $target.focus(); // Set focus again
                                };
                            });
                        }
                    }
                });

            $(function(){
                $('.modal').on('hidden.bs.modal', function () {
                    let $iframe = $(this).find("iframe");
                    $iframe.attr("src", $iframe.attr("src"));
                });
            });

            $(function(){
                $('.js-toogle-more').on('click', function () {
                    if ($(this).text() === "Mniej informacji") {
                        $(this).text("Więcej informacji");
                    } else {
                        $(this).text("Mniej informacji");
                    }
                });
            });

            $('.webinar__block__content').each(function(){
                let currentDate = new Date();
                let webinarStartDate = new Date($(this).data("start"));

                let $webinarVideo = $(this).find(".webinar__block__content-video");
                let $webinarMore = $(this).find(".webinar__block__content-more");

                if (currentDate && currentDate.getTime() >= webinarStartDate && webinarStartDate.getTime()) {
                    $webinarVideo.removeClass("inactive");
                    $webinarVideo.removeAttr("disabled", "true");
                    $webinarMore.removeClass("inactive");
                } else {
                    $webinarVideo.addClass("inactive");
                    $webinarVideo.attr("disabled", "true");
                    $webinarMore.addClass("inactive");
                }
            });

        });
    }
}
