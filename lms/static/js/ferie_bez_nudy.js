export class FerieBezNudy {
    constructor() {
        $(document).ready(function() {
            let $html = $('html');
            let pathname = "/dla-dzieci-i-mlodziezy";
            if (!$html.is(':lang(pl)')) {
                let hrefSelector = $(`a[href="${pathname}"]`);
                if (hrefSelector.length > 0 ){
                    hrefSelector.closest('li').hide();
                }
            }

            if (window.location.pathname === pathname) {
                $html.css("font-size", "1rem");

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
                            let target = $(this.hash);
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
                                    let $target = $(target);
                                    $target.focus();
                                    if ($target.is(":focus")) { // Checking if the target was focused
                                        return false;
                                    } else {
                                        $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                                        $target.focus(); // Set focus again
                                    }
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

                let $webinarBlock = $('.webinar__block__content');

                $webinarBlock.each(function(){
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

                $(function(){
                    $webinarBlock.on('shown.bs.collapse', function () {
                        let $more = $(this).find(".js-toogle-more");
                        $more.text("Mniej informacji");
                        $more.next('.fas').removeClass('fa-chevron-down').addClass('fa-chevron-up');
                    });

                    $webinarBlock.on('hidden.bs.collapse', function () {
                        let $more = $(this).find(".js-toogle-more");
                        $more.text("Więcej informacji");
                        $more.next('.fas').removeClass('fa-chevron-up').addClass('fa-chevron-down');
                    });
                });
            }

        });
    }
}
