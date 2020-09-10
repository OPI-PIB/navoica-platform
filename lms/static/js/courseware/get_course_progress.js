
function getCourseProgressReq(usernameArg, courseIdArg, urlOriginArg) {
    let $progressBar = $('.course-progress');
    let $learnerUsername = $('.js-learner-username');
    let urlOriginPath = urlOriginArg || window.location.origin;
    let username = usernameArg || $progressBar.data('user');
    let courseId = courseIdArg || $progressBar.data('courseid');

    const userChange = function() {
        let learnerUsernameValue = $learnerUsername.val();
        let patternValidation = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
        if (learnerUsernameValue !== '' && !patternValidation.test(learnerUsernameValue)) {
            username = $learnerUsername.val();
            sendRequest(username, courseId);
        }
    }

    const sendRequest = function(username, courseId) {
        let endpoint = `/api/navoica/v1/progress/${username}/courses/${courseId}`;

        $.ajax({
            url: urlOriginPath + endpoint,
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: function(result){
                if (result) {
                    let percentage = Math.round(result.completion_value * 100);
                    $('.progress-bar').css('width', percentage + '%').attr('aria-valuenow', percentage);
                    $('.js-percentage-progress').text(percentage + '%');
                }
            }
        });
    }

    $learnerUsername.on('change', function() {
        setTimeout(function() {
            userChange();
        }, 350);
    });

    if ($learnerUsername) {
        setTimeout(function() {
            userChange();
        }, 350);
    }

    sendRequest(username, courseId);
}


function getCourseProgressEvents() {
    $(document).ready(function() {
        getCourseProgressReq();

        $(document).on('keydown', function(event) {
            let key = event.keyCode || event.which;

            if (!$(this).is('input') && !$(this).is('textarea')) {
                switch(key) {
                    case 37:
                    case 39:
                        getCourseProgressReq();
                        break;
                    default:
                        return;
                }
            }
        });

        $('.js-sequence-btn-prev, .js-sequence-btn-next').on('click', function(event) {
            event.preventDefault();
            getCourseProgressReq();
        });

    });
}

export default getCourseProgressEvents;