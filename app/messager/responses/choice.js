exports.select = function(choice) {
    var message = ''
    if(choice === 'start') { 
        message = 'สวัสดีครับ ผมสามารถแนะนำแพ็กเกจที่น่าสนใจได้'
    } else {
        message = 'อยากให้แนะนำแพ็กเกจอะไรเพิ่มไหม'
    }
    return {
        text: message,
        quick_replies:[
          {
            content_type: 'text',
            title: 'ค้นหาตามชื่อแพ็กเกจ',
            payload: 'search',
          },
          {
            content_type: 'text',
            title: 'แพ็กเกจยอดนิยม',
            payload: 'popular',
          },
          {
            content_type: 'text',
            title: 'แพ็กเกจล่าสุด',
            payload: 'latest',
          },
          {
            content_type: 'text',
            title: 'แนะนำตามรายละเอียดแพ็กเกจที่ระบุ',
            payload: 'question'
          }
        ]
    }
}