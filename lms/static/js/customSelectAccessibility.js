export class CustomSelectAccessibility {
    constructor() {
        function customSelectAccessibility() {
            function closeSelect() {
                $('.select-styled').removeClass('active');
                $('.select-options').hide();
                $('button.select-styled').focus();
            }

            $('select').each(function () {
                let $this = $(this), numberOfOptions = $(this).children('option').length;

                $this.addClass('select-hidden');

                $this.wrap('<div class="select d-flex flex-wrap"></div>');
                $this.after('<button type="button" aria-labelledby="sort-select" class="select-styled" aria-haspopup="listbox"></button>');

                let $styledSelect = $this.next('button.select-styled');
                $styledSelect.text($this.children('option').eq(0).text());

                let $list = $('<ul />', {
                    'class': 'select-options',
                    'tabindex': '0',
                    'role': 'listbox',
                    'aria-activedescendant': 'exp_elem_0'
                }).insertAfter($styledSelect);

                if ($('#instructor-dashboard-content')) {
                    for (let i = 0; i < numberOfOptions; i++) {
                        $('<li />', {
                            text: $this.children('option').eq(i).text(),
                            rel: $this.children('option').eq(i).val(),
                            role: 'option',
                            id: 'exp_elem_' + i,
                            'tabindex': '-1',
                            'data-target': $this.children('option').eq(i).val().toLowerCase().replace(' ', '_'),
                            'data-section': $this.children('option').eq(i).val().toLowerCase().replace(' ', '_'),
                            'aria-selected': 'false'
                        }).appendTo($list);
                    }
                } else {
                    for (let i = 0; i < numberOfOptions; i++) {
                        $('<li />', {
                            text: $this.children('option').eq(i).text(),
                            rel: $this.children('option').eq(i).val(),
                            role: 'option',
                            id: 'exp_elem_' + i,
                            'tabindex': '-1',
                            'aria-selected': 'false'
                        }).appendTo($list);
                    }
                }

                let $listItems = $list.children('li');

                $styledSelect.click(function (e) {
                    e.stopPropagation();

                    $('button.select-styled.active').not(this).each(function () {
                        $(this).removeClass('active').next('ul.select-options').hide();
                    });
                    $(this).toggleClass('active').next('ul.select-options').toggle();
                    $('ul.select-options').focus();

                });

                $listItems.click(function (e) {
                    e.stopPropagation();
                    $styledSelect.text($(this).text()).removeClass('active');
                    $this.val($(this).attr('rel'));
                    $list.hide();
                });

                $(document).click(function () {
                    $styledSelect.removeClass('active');
                    $list.hide();
                });

            });

            $('.select-options li').on('click', function(){
                let value = $(this).attr("rel");
                let indexOpt = $(this).index();

                $('select option').eq(indexOpt).trigger('change');

                value++;
                $('.select-options').attr('aria-activedescendant', $(this).attr('id'));
                $('#sort-select, #enrolled-course-sort, #select-link, #organizer').find('option').eq(indexOpt).prop('selected', true).trigger('change');
                return false;
            });

            $("[role=listbox]").on("focus", function () {
                // If no selected element, select the first by default
                if (!$(this).find("[aria-selected=true]").length) {
                    $(this).find("[role=option]:first").attr("aria-selected", "true").focus();
                } else {
                    $(this).find("[aria-selected=true]").focus();
                }
            });

            $("[role=option]").on("focus", function (e) {
                $(this).parent().attr("tabindex", "-1");
            });

            $("[role=option]").on("blur", function (e) {
                $(this).parent().attr("tabindex", "0");
            });


            $("[role=listbox]").on("keydown", function (e) {
                let currentItem = $(this).find("[aria-selected=true]");

                switch (e.keyCode) {
                    case 37: // Left Arrow
                    case 38:  // Up arrow
                        if (currentItem.prev().length) {
                            currentItem.attr("aria-selected", "false");
                            currentItem.prev().attr("aria-selected", "true").focus();
                            $('.select-styled').text(currentItem.prev().text());
                        } else return;
                        e.preventDefault();
                        break;
                    case 39: // Right Arrow
                    case 40: // Down arrow
                        if (currentItem.next().length) {
                            currentItem.attr("aria-selected", "false");
                            currentItem.next().attr("aria-selected", "true").focus();
                            $('.select-styled').text(currentItem.next().text());
                        } else return;
                        e.preventDefault();
                        break;
                    case 27: // Escape
                        if (currentItem.length) {
                            currentItem.attr("aria-selected", "false");
                        }
                        closeSelect();
                        e.preventDefault();
                        break;
                    case 13: // Enter
                    case 32: // Space
                        if (currentItem.length) {
                            let indexOpt = currentItem.index();
                            $('.select-options').attr('aria-activedescendant', currentItem.attr('id'));
                            $('#sort-select, #enrolled-course-sort, #select-link, #organizer').find('option').eq(indexOpt).prop('selected', true).trigger('change');
                            currentItem.attr("aria-selected", "false");
                            closeSelect();
                            return false;
                        }
                        e.preventDefault();
                        break;
                }
            });

            $("[role=option]").on("mousedown", function (e) {
                $(this).parent().find("[aria-selected=true]").attr("aria-selected", "false");
                $(this).attr("aria-selected", "true");
                e.preventDefault();
            });
        }

        $(document).ready(function() {
            customSelectAccessibility();
        });
    }
}

