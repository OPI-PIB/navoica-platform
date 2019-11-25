/* globals $ */
import 'jquery.cookie';

export class Updates {  // eslint-disable-line import/prefer-default-export
  constructor(options) {
    let pastDate = new Date();
    let cookieExpiresInDays = 14;
    pastDate.setDate(pastDate.getDate()-cookieExpiresInDays);
    $(options.messageContainer).each((index,target)=>{
        let updateDateString = $(target).find($('.localized-datetime')).data('datetime');
        let updateDate = Date.parse(updateDateString);
        if (pastDate.getTime() > updateDate){
            $(target).hide();
        }});

    let cookieElements = $.cookie('update-message');
    if (cookieElements) {
        let cookieElementList = cookieElements.split(',');
        cookieElementList.forEach(function (id) {
        $(`#update-message-${id}`).hide();
      });
    }
    $(options.dismissButton).click((event) => {
      let updateMessageId = $(event.target).closest($('.update-message')).data('id');
      let cookieElementsBuilder =  $.cookie('update-message');
      if (cookieElementsBuilder){
          cookieElementsBuilder = cookieElementsBuilder + ',' + updateMessageId  ;
      } else {
          cookieElementsBuilder = updateMessageId ;
      }
      $.cookie('update-message', cookieElementsBuilder, { expires: cookieExpiresInDays });
      $(`#update-message-${updateMessageId}`).hide();
    });
  }
}
