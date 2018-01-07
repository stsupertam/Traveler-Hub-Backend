const FACEBOOK_ACCESS_TOKEN = 'EAAJztzEqzBYBAMrkSZBJSQln37td2EUFkvPX3eroCGefDKKo0vRWTGX5432x9rfwDNGi1kentRFseblbBZBzAvaSAl4xdzUJhljJdkmWdYI7W5SD7bjUkKrYK6A0LXbRTRcZACZAyf41KXTBB4nVmdZBzCwZBQN17CBYo6vEDKqsD0OXbm7lTc'
const CAT_IMAGE_URL = 'https://botcube.co/public/blog/apiai-tutorial-bot/hosico_cat.jpg';

const request = require('request');
const {handleMessage} = require('./simple_response');
const Package = require('mongoose').model('Package');
var first_time = false;
var second_question = false;
var third_question = false;
var end_state = false;
var data_response = {};
var topDataDb = {};

var topData = {
    attachment: {
        type: "template",
        payload: {
            template_type: "generic",
            elements: [{
                title: "CHILL CHILL กลางสายน้ำ ที่ แพ 500",
                image_url: "https://www.noomsaotours.co.th/gallery/images/Wat_Bang_Riang__.jpg",
                buttons: [{
                    "type": "web_url",
                    "url": "localhost:3000/detail",
                    "title": "More Detail"
                }]
            }
           ]
        }
    }
}

var choice = {
    text: "สวัสดีครับ ผมสามารถแนะนำแพ็กเกจที่น่าสนใจได้",
    quick_replies:[
      {
        content_type: "text",
        title: "เลือกตามความนิยม",
        payload: "1",
      },
      {
        content_type: "text",
        title: "ลองถามอะไรดูก็ได้ซิ",
        payload: "2"
      }
    ]
}

var choice2 = {
    text: "อยาให้แนะนำที่ไหนเพิ่มอีก",
    quick_replies:[
      {
        content_type: "text",
        title: "เลือกตามความนิยม",
        payload: "1",
      },
      {
        content_type: "text",
        title: "ลองถามอะไรดูก็ได้ซิ",
        payload: "2"
      }
    ]
}
module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    if(message == 'reset'){
        first_time = false
        second_question = false
        third_question = false
        end_state = false
    }
    if(!second_question){
        if(!first_time){
            first_time = true
            request({
                url: 'https://graph.facebook.com/v2.6/me/messages',
                qs: { access_token: FACEBOOK_ACCESS_TOKEN },
                method: 'POST',
                json: {
                    recipient: { id: senderId },
                    message: choice
                        //text:'สวัสดี ผมสามารถแนะนำแพ็กเกจที่น่าสนใจได้ 1.ตามเทศกาล 2.ตามความต้องการของผู้ใช้' 
                }
            });   
        }
        if(message == 1 || message == "เลือกตามความนิยม"){
            second_question = true;
            request({
              url: 'https://graph.facebook.com/v2.6/me/messages',
              qs: { access_token: FACEBOOK_ACCESS_TOKEN },
              method: 'POST',
              json: {
                  recipient: { id: senderId },
                  message: topData
                }
            });        
        }
        else if(message == 2 || message == "ลองถามอะไรดูก็ได้ซิ"){
            third_question = true;
            request({
              url: 'https://graph.facebook.com/v2.6/me/messages',
              qs: { access_token: FACEBOOK_ACCESS_TOKEN },
              method: 'POST',
              json: {
                  recipient: { id: senderId },
                  message: {
                      text:"ลองถามมาดูซิ ตัวอย่างเช่น เดือนพฤศจิกายนน่าไปเที่ยวไหน , อยากหาที่เที่ยวแบบ 3 วัน 2 คืน งบไม่เกิน 3500, อยากเที่ยวผจญภัยแบบล่องแก่ง"
                  }
                }
            });        
        }
    }
    else{
        end_state = true;
        if(message == 1){
            request({
              url: 'https://graph.facebook.com/v2.6/me/messages',
              qs: { access_token: FACEBOOK_ACCESS_TOKEN },
              method: 'POST',
              json: {
                  recipient: { id: senderId },
                  message: {
                      text:'ณ สนามมิ่งเมือง และสวนสมเด็จพระศรีนครินทร์ เทศบาลเมืองสกลนคร่วมติดดอกผึ้งปราสาทผึ้งโบราณ ชมการออกร้านจำหน่ายสินค้า “ของดีแซบเมืองสกล”การแข่งขันเรือยาวที่ตื้นเต้นสนุกสนานในบึงหนองหาร พร้อมชมการแสดงศิลปวัฒนธรรมมากมาย 4 ต.ค.60ร่วมชมขบวนแห่ปราสาทผึ้งที่สวยงามตระการตา ตั้งแต่เวลาประมาณ 15.00 น. เป็นต้นไป'
                  }
                }
            }); 
        }
        else if(message == 2){
            request({
              url: 'https://graph.facebook.com/v2.6/me/messages',
              qs: { access_token: FACEBOOK_ACCESS_TOKEN },
              method: 'POST',
              json: {
                  recipient: { id: senderId },
                  message: {
                      text:'การท่องเที่ยวแห่งประเทศไทย (ททท.) ขอเชิญชวนทุกท่านมาร่วมงานบุญออกพรรษาที่เป็นประเพณีเก่าแก่ และมีเอกลักษณ์เฉพาะตัวเพียงแห่งเดียวในประเทศไทย คืองานบุญประเพณี จุดไฟตูมกา ออกพรรษา ที่ยโสธร สาหรับงานบุญดังกล่าว มีที่มาจากบ้านทุ่งแต้ หมู่บ้านเล็กๆ แห่งหนึ่ง ใน ต.ทุ่งแต้ อ.เมือง จ.ยโสธร ได้ร่วมกันฟื้นฟูภูมิปัญญา ประเพณีในอดีตซึ่งเลือนหายไปพร้อมกับการมีไฟฟ้าใช้ของชุมชน นั่นคือ การจุด “ ไฟตูมกา ” การทำไฟตูมกาวันออกพรรษาเป็นวัฒนธรรม ดั้งเดิมของชุมชนบ้านทุ่งแต้ ที่สืบทอดต่อกันมาเป็นเวลายาวนาน โดยการนำผลตูมกา ผลไม้ป่าทีมีรูปทรงกลมคล้ายผลส้มขนาดเท่ากำปั้น หรือโตกว่า มีก้านยาวและมีลักษณะพิเศษคือ เปลือกบางโปร่งแสง เมื่อขูดเอาผิวสีเขียวออกและคว้านเอาเนือ้และเมล็ดข้างในออกให้หมด ใช้มีดแกะเป็นลายต่างๆ ตามความต้องการ หลังจากจุดเทียนที่สอดขึ้นไปจากรูที่เจาะไว้ส่วนล่างของผลตูมกา แสงสว่างจากเปลวเทียนก็จะ ลอดออกมา เป็นลวดลายตามรูที่เจาะไว้ ถวายเป็นพุทธบูชาในวันออกพรรษา โดยในคืนออกพรรษาชาวบ้านจะจุดเทียนจากที่บ้านหิ้วก้าน ไปรวมกันที่วัดแม้จะมีลมพัดเทียนก็จะไม่ดับ เมื่อเทียนจะหมดก็เปลี่ยนเล่มใหม่ได้ เมื่อไปถึงที่วัดก็จะนำไฟตูมกาไปแขวนไว้ตามสถานที่ที่ทางวัดจัดไว้ เช่น ซุ้มไม้ไผ่หรือราวไม้สำหรับแขวนก้านตูมกา แล้วร่วมสวดมนต์ใหว้พระ ตามวิถีของชาวพุทธ'
                  }
                }
            }); 
        }
        else if(message == 3){
            request({
              url: 'https://graph.facebook.com/v2.6/me/messages',
              qs: { access_token: FACEBOOK_ACCESS_TOKEN },
              method: 'POST',
              json: {
                  recipient: { id: senderId },
                  message: {
                      text:'ณ คลองสำโรง หน้าวัด บางพลีใหญ่ใน จังหวัดสมุทรปราการ ประเพณีโยนบัวนมัสการหลวงพ่อโต พร้อมขวนแห่สุดอลังการ ประเพณีหนึ่งเดียวในโลก'
                  }
                }
            }); 
        }

    }

    if(end_state){
        second_question = false;
        third_question = false;
        request({
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: { access_token: FACEBOOK_ACCESS_TOKEN },
          method: 'POST',
          json: {
              recipient: { id: senderId },
              message: choice2
                  //text:'อยากให้แนะนำเพิ่มอีกไหม 1.ตามเทศกาล 2.ตามความต้องการ'
              
            }
        }); 
    }
    handleMessage(message,senderId);

};