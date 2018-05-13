const _ = require('lodash')
const fs = require('fs');
const Package = require('mongoose').model('Package')
const Promise = require('bluebird')
const wordcut = require('wordcut')
const rootUrl = 'https://travelerhub.xyz/package/detail/' 
const imageUrl = 'https://api.travelerhub.xyz' 

const provinces = fs.readFileSync('./text_processing/provinces.txt', 'utf-8')
                    .replace(/\r/g, '').split('\n')
const regions = fs.readFileSync('./text_processing/regions.txt', 'utf-8')
                    .replace(/\r/g, '').split('\n')
const companies = fs.readFileSync('./text_processing/companies.txt', 'utf-8')
                    .replace(/\r/g, '').split('\n')
const travel_types = fs.readFileSync('./text_processing/travel_types.txt', 'utf-8')
                    .replace(/\r/g, '').split('\n')
const keywords = fs.readFileSync('./text_processing/keywords.txt', 'utf-8')
                    .replace(/\r/g, '').split('\n')
const stopwords = fs.readFileSync('./text_processing/stopwords.txt', 'utf-8')
                    .replace(/\r/g, '').split('\n')
const dayInMonth = [
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
]
const event = ['ปีใหม่', 'เข้าพรรษา', 'สงกรานต์']
Package.esSearch = Promise.promisify(Package.esSearch);
wordcut.init('./text_processing/dictionary.txt', true)

function getItem(packages) {
    let data = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: []
            }
        }
    }
    let button = 

    _.map(packages, (package) => {
        let copyPackage = JSON.parse(JSON.stringify(package))
        let images = copyPackage.images
        item = {}
        let randomIndex = Math.floor(Math.random()*images.length)
        item['title'] = package['package_name']
        item['subtitle'] = package['human_price'] + '\n' + 
                           package['travel_date'] + '\n' + 'company: ' + 
                           package['company']
        item['image_url'] = imageUrl + images[randomIndex]
        item['buttons'] = [{
            'type': 'web_url',
            'url': rootUrl + package['_id'],
            'title': 'More Detail'
        }]
        data.attachment.payload.elements.push(item)
    })
    return data
}

function replaceText(text) {
    text = text.replace(/งบ/g, 'ราคา')
                     .replace(/ต่ำกว่า/g, 'น้อยกว่า')
                     .replace(/สูงกว่า/g, 'มากกว่า')
                     .replace(/ประมาณ/g, '')
                     .replace(/เที่ยว/g, '')
                     .replace(/ที่/g, '')
                     .replace(/่ตั้งแต่/g, '')
                     .replace(/ช่วงวัน/g, 'วัน')
                     .replace(/ช่วงเดือน/g, 'เดือน')
                     .replace(/ปีใหม่/g, 'ใหม่')
                     .replace(/ๆ/g, '')
                     .replace(/ฯ/g, '')
                     .replace(/\./g, '')
                     .replace(/มค/g, '1')
                     .replace(/กพ/g, '2')
                     .replace(/มีค/g, '3')
                     .replace(/เมย/g, '4')
                     .replace(/พค/g, '5')
                     .replace(/มิย/g, '6')
                     .replace(/กค/g, '7')
                     .replace(/สค/g, '8')
                     .replace(/กย/g, '9')
                     .replace(/ตค/g, '10')
                     .replace(/พย/g, '11')
                     .replace(/ธค/g, '12')
                     .replace(/มกราคม/g, 'มกรา')
                     .replace(/กุมภาพันธ์/g, 'กุมภา')
                     .replace(/มีนาคม/g, 'มีนา')
                     .replace(/เมษายน/g, 'เมษา')
                     .replace(/พฤษภาคม/g, 'พฤษภา')
                     .replace(/มิถุนายน/g, 'มิถุนา')
                     .replace(/กรกฎาคม/g, 'กรกฎา')
                     .replace(/สิงหาคม/g, 'สิงหา')
                     .replace(/กันยายน/g, 'กันยา')
                     .replace(/ตุลาคม/g, 'ตุลา')
                     .replace(/พฤศจิกายน/g, 'พฤศจิกา')
                     .replace(/ธันวาคม/g, 'ธันวา')
                     .replace(/มกรา/g, '1')
                     .replace(/กุมภา/g, '2')
                     .replace(/มีนา/g, '3')
                     .replace(/เมษา/g, '4')
                     .replace(/พฤษภา/g, '5')
                     .replace(/มิถุนา/g, '6')
                     .replace(/กรกฎา/g, '7')
                     .replace(/สิงหา/g, '8')
                     .replace(/กันยา/g, '9')
                     .replace(/ตุลา/g, '10')
                     .replace(/พฤศจิกา/g, 'พฤศจิ')
                     .replace(/ธันวา/g, '12')
                     .replace(/พฤศจิ/g, '11')
    return text
}

function extractDate(text, date) {
    console.log('Extract Date from text')
    console.log(text)
    let year = (new Date()).getFullYear()
    for(i = 0; i < text.length; i++) { 
        if(text[i] === 'ช่วง') {
            text[i] = ''
            if(i + 1 < text.length) {
                if(text[i+1] === 'สงกรานต์') {
                    date.isArrival = true
                    date.isDeparture = true
                    date.arrival = `${year}/04/01`
                    date.departure = `${year + 1}/04/20`
                }
                else if(text[i+1] === 'ใหม่') {
                    date.isArrival = true
                    date.isDeparture = true
                    date.arrival = `${year}/12/25`
                    date.departure = `${year + 1}/01/10`
                }
                text[i+1] = ''
            }
        }
        else if(text[i] === 'เดือน') {
            text[i] = ''
            console.log('Month')
            if(i + 1 < text.length) {
                if(text[i+1] !== '') {
                    if(!isNaN(text[i+1])) {
                        console.log(`${text[i+1]} is number`)
                        if(i + 3 < text.length) {
                            if(text[i+3] !== '') {
                                if(!isNaN(text[i+3])) {
                                    console.log(`${text[i+3]} is number`)
                                    let day = dayInMonth[parseInt(text[i+3])-1]
                                    date.isArrival = true
                                    date.isDeparture = true
                                    date.arrival = `${year}/${text[i+1]}/01`
                                    date.departure = `${year}/${text[i+3]}/${day}`
                                    text[i+3] = ''
                                } else {
                                    console.log(`${text[i+3]} isn\'t number`)
                                    let day = dayInMonth[parseInt(text[i+1])-1]
                                    date.isArrival = true
                                    date.isDeparture = true
                                    date.arrival = `${year}/${text[i+1]}/01`
                                    date.departure = `${year}/${text[i+1]}/${day}`
                                }
                            } else {
                                let day = dayInMonth[parseInt(text[i+1])-1]
                                date.isArrival = true
                                date.isDeparture = true
                                date.arrival = `${year}/${text[i+1]}/01`
                                date.departure = `${year}/${text[i+1]}/${day}`
                            }
                        } else {
                            let day = dayInMonth[parseInt(text[i+1])-1]
                            date.isArrival = true
                            date.isDeparture = true
                            date.arrival = `${year}/${text[i+1]}/01`
                            date.departure = `${year}/${text[i+1]}/${day}`
                        }
                        text[i+1] = ''
                    }
                }
            }
        }
        else if(text[i] === 'วัน') {
            text[i] = ''
            if(i + 4 < text.length) {
                if(!isNaN(text[i+1]) && !isNaN(text[i+3]) && !isNaN(text[i+4])) {
                    date.isArrival = true
                    date.isDeparture = true
                    date.arrival = `${year}/${text[i+4]}/${text[i+1]}`
                    date.departure = `${year}/${text[i+4]}/${text[i+3]}`
                    text[i+1] = ''
                    text[i+2] = ''
                    text[i+3] = ''
                    text[i+4] = ''
                }
            }
        }
    }
    console.log(date)
}

function extractPrice(text, price) {
    console.log('Extract Price from text')
    console.log(text)
    for(i = 0; i < text.length; i++) { 
        if(text[i] === 'ราคา') {
            text[i] = ''
            if(i + 1 < text.length) {
                if(isNaN(text[i+1])) {
                    if(text[i+1] === 'มากกว่า') {
                        text[i+1] = ''
                        if(i + 2 < text.length) {
                            console.log('More than')
                            if(!isNaN(text[i+2])) {
                                price.isGreater = true
                                price.grater = parseInt(text[i+2])
                                text[i+1] = ''
                                text[i+2] = ''
                            }
                        }
                    }
                    else if(text[i+1] === 'น้อยกว่า') {
                        text[i+1] = ''
                        if(i + 2 < text.length) {
                            console.log('Less than')
                            if(!isNaN(text[i+2])) {
                                price.isLess = true
                                price.less = parseInt(text[i+2])
                                text[i+2] = ''
                            }
                        }
                    }
                    else if(text[i+1] === 'ถูก' || text[i+1] === 'น้อย' ||
                            text[i+1] === 'ประหยัด' || text[i+1] === 'ต่ำ') 
                    {
                        text[i+1] = ''
                        console.log('Cheap package')
                        price.isLess = true
                        price.less = 5000
                    }
                    else if(text[i+1] === 'แพง' || text[i+1] === 'สูง' || 
                            text[i+1] === 'มาก')
                    {
                        text[i+1] = ''
                        console.log('Expensive package')
                        price.isGreater = true
                        price.greater = 5000
                    }
                } else {
                    console.log(`i+1: ${text[i+1]} is number`)
                    if(i + 3 < text.length) {
                        if(isNaN(text[i+3])) {
                            console.log(`i+3: ${text[i+3]} is\'t number`)
                            price.isGreater = true
                            price.isLess = true
                            price.greater = parseInt(text[i+1]) - 1000
                            price.less = parseInt(text[i+1]) + 1000
                            text[i+1] = ''
                        } else {
                            console.log(`i+3: ${text[i+3]} is number`)
                            price.isGreater = true
                            price.isLess = true
                            price.greater = parseInt(text[i+1]) 
                            price.less = parseInt(text[i+3]) 
                            text[i+1] = ''
                            text[i+2] = ''
                            text[i+3] = ''
                        }
                    } else {
                        price.isGreater = true
                        price.isLess = true
                        price.greater = parseInt(text[i+1]) - 1000
                        price.less = parseInt(text[i+1]) + 1000
                        text[i+1] = ''
                    }
                }
            } 
        }
    }
    console.log(price)
}
exports.latest = function() {
    return Package.find({}).sort('-created').limit(10).select('-__v -created').lean()
            .then((packages) => {
                return getItem(packages)
            })
}

exports.popular = function() {
    return Package.find({}).sort('-number_of_views').limit(10).select('-__v -created').lean()
            .then((packages) => {
                return getItem(packages)
            })

}

exports.search = async function(message) {
    let text = []

    let isQueryProvince = false
    let isQueryKeyword = false
    let isQueryTravelType = false
    let isQueryRegion = false
    let isQueryCompany = false

    let queryProvince = []
    let queryKeyword = []
    let queryTravelType = []
    let queryRegion = []
    let queryCompany = []

    let queryPrice = {
        isGreater: false,
        isLess: false,
        greater: 0,
        less: 0
    }
    let queryDate = {
        isArrival: false,
        isDeparture: false,
        arrival: '',
        departure: ''
    }

    let raw_query = {
        size: 10,
    }
    let elastic_query = { 
        bool : {
            must : [],
            filter : []
        },
    }

    message = replaceText(message)
    let text_tokenization = wordcut.cutIntoArray(message)
    text_tokenization = text_tokenization.filter((item) => item != ' ');

    extractPrice(text_tokenization, queryPrice)
    extractDate(text_tokenization, queryDate)
    for(i = 0; i < text_tokenization.length; i++) { 
        if(provinces.indexOf(text_tokenization[i]) !== -1) {
            console.log('Provinces')
            isQueryProvince = true
            queryProvince.push(text_tokenization[i])
            text_tokenization[i] = ''
        }
        if(regions.indexOf(text_tokenization[i]) !== -1) {
            console.log('Regions')
            isQueryRegion = true
            queryRegion.push(text_tokenization[i])
            text_tokenization[i] = ''
        }
        if(companies.indexOf(text_tokenization[i]) !== -1) {
            console.log('Companies')
            isQueryCompany = true
            queryRegion.push(text_tokenization[i])
            text_tokenization[i] = ''
        }
        if(travel_types.indexOf(text_tokenization[i]) !== -1) {
            console.log('TravelTypes')
            isQueryTravelType = true
            queryTravelType.push(text_tokenization[i])
            text_tokenization[i] = ''
        }
        if(keywords.indexOf(text_tokenization[i]) !== -1) {
            console.log('Keywords')
            isQueryKeyword = true
            queryKeyword.push(text_tokenization[i])
            text_tokenization[i] = ''
        }
        if(text_tokenization[i] !== '') {
            console.log('Stopword')
            if(stopwords.indexOf(text_tokenization[i]) === -1) {
                text.push(text_tokenization[i])
            }
        }
    }

    text = text.join(' ')
    console.log('------------------Final text----------------')
    console.log(text)
    console.log('--------------------------------------------')
    if (queryDate.isArrival && queryDate.isDeparture) {
        start = new Date(queryDate.arrival + 'T00:00:00'.replace(/-/g, '\/').replace(/T.+/, ''))
        end = new Date(queryDate.departure + 'T00:00:00'.replace(/-/g, '\/').replace(/T.+/, ''))
        let date = {
            range: {
                start_travel_date: {
                    gte: start,
                    lte: end
                }            
            }
        }
        elastic_query['bool']['filter'].push(date)
    }
    if(queryPrice.isLess || queryPrice.isGreater) {
        if(queryPrice.isLess && queryPrice.isGreater) {
            let price = {
                range:{
                    price: {
                        gte: queryPrice.greater,
                        lte: queryPrice.less
                    }
                }
            }
            elastic_query['bool']['filter'].push(price) 
        } else if (queryPrice.isGreater) { 
            let price = {
                range: {
                    price: {
                        gte: queryPrice.greater
                    }
                }
            }
            elastic_query['bool']['filter'].push(price)
        } else if (queryPrice.isLess) { 
            let price = {
                range: {
                    price: {
                        lte: queryPrice.less
                    }
                }
            }
            elastic_query['bool']['filter'].push(price) 
        }
    }
    if(isQueryCompany) {
        console.log('Query Company')
        let company = {
            match: {
                company: {
                    query: queryCompany.join(' ')
                }
            }
        }
        elastic_query['bool']['must'].push(company)
    }
    if(isQueryRegion) {
        console.log('Query Region')
        let region = {
            match: {
                region: {
                    query: queryRegion.join(' ')
                }
            }
        }
        elastic_query['bool']['must'].push(region)
    }
    if(isQueryProvince) {
        console.log('Query Province')
        let province = {
            match: {
                provinces: {
                    query: queryProvince.join(' ')
                }
            }
        }
        elastic_query['bool']['must'].push(province)
    }
    if(isQueryKeyword) {
        console.log('Query Keyword')
        let keyword = {
            match: {
                tags: {
                    query: queryKeyword.join(' ')
                }
            }
        }
        elastic_query['bool']['must'].push(keyword)
    }
    if(isQueryTravelType) {
        console.log('Query TravelType')
        let travelType = {
            match: {
                travel_types: {
                    query: queryTravelType.join(' ')
                }
            }
        }
        elastic_query['bool']['must'].push(travelType)
    }
    if(text !== '') { 
        let queryText = {
            match: {
                _all: text
            },
        }
        let fuzzyText = {
            match: {
                _all: {
                    query: text,
                    fuzziness: 1,
                    prefix_length: 2
                }
            }
        }
        elastic_query['bool']['must'].push(queryText)
        elastic_query['bool']['must'].push(fuzzyText)
    }
    raw_query['query'] = elastic_query
    return Package.esSearch(raw_query)
            .then((packages) => {
                if(packages.hits.total === 0) {
                    return { text: 'ไม่พบแพ็กเกจที่ค้นหาครับ กรุณาลองอีกครั้ง'}
                }
                return getItem(packages.hits.hits)
            })
}