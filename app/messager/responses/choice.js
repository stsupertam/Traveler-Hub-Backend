exports.select = function(choice) {
    let message = ''
    let payload = {
        text: message,
        quick_replies:[
        	{
        	  	content_type: 'text',
        	  	title: 'ค้นหาตามใจคุณ',
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
        	}
        ]
    }

    if(choice === 'start') {
        payload['text'] = 'สวัสดีครับ ผมสามารถแนะนำแพ็กเกจที่น่าสนใจได้'
    } else if(choice === 'other') {
		payload['text'] = 'ค้นหาเกี่ยวกับอะไรดี'
	} else if(choice === 'unknown') {
		payload['text'] = 'อยากให้เลือกตามตัวเลือกครับ'
    } else if(choice == 'end'){
        payload = {
          	text: 'อยากสอบถามเพิ่มเติมอีกไหม',
          	quick_replies:[
            	{
            	  	content_type: 'text',
            	  	title: 'ค้นหาเพิ่มเติม',
            	  	payload: 'search',
            	},
            	{
            	  	content_type: 'text',
            	  	title: 'หยุดการค้นหา',
            	  	payload: 'stop',
            	},
          ]
        }
    } else if(choice == 'search'){
        payload = {
          	text: 'อยากสอบถามเพิ่มเติมอีกไหม',
          	quick_replies:[
            	{
            		content_type: 'text',
            		title: 'ค้นหาเพิ่มเติม',
            		payload: 'search',
            	},
            	{
            	  	content_type: 'text',
            	  	title: 'สอบถามอย่างอื่น',
            	  	payload: 'another',
            	},
            	{
            	  	content_type: 'text',
            	  	title: 'หยุดการค้นหา',
            	  	payload: 'stop',
            	},
          ]
        }
    }
    return payload
}