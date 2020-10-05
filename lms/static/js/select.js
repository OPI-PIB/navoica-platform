$(document).ready(function() {

    function closeSelect() {
      $('.select-styled').removeClass('active');
      $('#settings-language-value .select-options').hide();
      $('button.select-styled').focus();
    }
  $('#settings-language-value').each(function () {
    var $this = $('.language-selector');

    $('#settings-language-value').addClass('select-hidden');
    $('#settings-language-value .en').remove();

    var numberOfOptions = $(this).children('option').length;

    var $mobileMenu = $('.mobile-language');

    $this.wrap('<div class="select d-md-flex flex-wrap language-menu"></div>');

    $this.after('<button type="button" class="btn btn-outline-primary btn-sm select-styled language-button" aria-haspopup="listbox" aria-expanded="false"></button>');

  var $languageButton = $('.language-button');
  
var $globeIcon = $('<i class="fas fa-globe" aria-hidden="true"></i>').appendTo($languageButton);
    
    $globeIcon.after($('#settings-language-value option:selected').text());

    var $styledSelect = $this.next('button.select-styled');

 var $list = $('<ul />', {
     'class': 'select-options',
      'tabindex': '0',
      'role': 'listbox',
    }).insertAfter($styledSelect);

    for (var i = 0; i < numberOfOptions; i++) {
      $('<li />', {
        text: $this.children('option').eq(i).text(),
        rel: $this.children('option').eq(i).val(),
        role: 'option',
        id: 'mobile_elem_' + i,
        'tabindex': '0',
        'aria-selected': 'false',
        class: $this.children('option').eq(i).val()
      }).appendTo($list);
    }

    for (var i = 0; i < numberOfOptions; i++) {
      $('<div />', {
        text: $this.children('option').eq(i).text(),
        rel: $this.children('option').eq(i).val(),
        role: 'option',
        id: 'mobile_elem_' + i,
        'tabindex': '0',
        'aria-selected': 'false',
        class: 'mobile-lang' + ' '+ 'dropdown-item' + ' ' + $this.children('option').eq(i).val()
      }).insertAfter($mobileMenu);
    }

    $('li.en-us').attr("lang", 'en');
    $('li.pl').attr("lang", 'pl-PL');

    var $listItems = $list.children('li');

    $styledSelect.click(function (e) {
      e.stopPropagation();

      $('button.select-styled.active').not(this).each(function () {
        $(this).removeClass('active').next('ul.select-options').hide();
      });
      $(this).toggleClass('active').next('ul.select-options').toggle();
      $('ul.select-options').focus();
      $languageButton.attr('aria-expanded' , 'true');
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

    $('.monile-lang').on('click', function(){
      var value = $(this).attr("rel");
      $('#settings-language-value option:selected').removeAttr('selected');
      $('#settings-language-value option:contains(' + value +')').attr('selected="selected"');
      var indexOpt = $(this).index();
      value++;
      $('.monile-lang').attr('aria-activedescendant', $(this).attr('id'));
      $('#settings-language-value').find('option').eq(indexOpt).prop('selected', true).trigger('change');
      //$('.languageButton').attr('aria-expanded' , 'true');
      return false;
    });

        $('.select-options li').on('click', function(){
      var value = $(this).attr("rel");
      $('#settings-language-value option:selected').removeAttr('selected');
      $('#settings-language-value option:contains(' + value +')').attr('selected="selected"');
      var indexOpt = $(this).index();
      value++;
      $('.select-options').attr('aria-activedescendant', $(this).attr('id'));
      $('#settings-language-value').find('option').eq(indexOpt).prop('selected', true).trigger('change');
      //$('.languageButton').attr('aria-expanded' , 'true');
      return false;
    });

    $("[role=listbox]").on("focus", function () {
      // If no selected element, select the first by default
      if (!$(this).find("[aria-selected=true]").length) {
        $(this).find("[role=option]:first").attr("aria-selected", "true").focus();
      } else {
        $(this).find("[aria-selected=true]");
      }
    });

  //  $("[role=option]").on("focus", function (e) {
  //    $(this).parent().attr("tabindex", "-1");
  //  });

  //  $("[role=option]").on("blur", function (e) {
  //    $(this).parent().attr("tabindex", "0");
  //  });


    $("[role=listbox]").on("keydown", function (e) {
      var currentItem = $(this).find("[aria-selected=true]");

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
        case 9:  // Tab
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
            var indexOpt = currentItem.index();
            $('.select-options').attr('aria-activedescendant', currentItem.attr('id'));
            $('#settings-language-value').find('option').eq(indexOpt).prop('selected', true).trigger('change');
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

})