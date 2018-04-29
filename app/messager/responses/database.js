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

Package.esSearch = Promise.promisify(Package.esSearch);
wordcut.init('./text_processing/' + '*.txt', true)

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
    let button = [{
        'type': 'web_url',
        'url': '',
        'title': 'More Detail'
    }]
    _.map(packages, (package) => {
        let copyPackage = JSON.parse(JSON.stringify(package))
        let images = copyPackage.images
        item = {}
        let randomIndex = Math.floor(Math.random()*images.length)
        button[0]['url'] = rootUrl + package['_id']
        item['title'] = package['package_name']
        item['subtitle'] = package['human_price'] + '\n' + 
                           package['travel_date'] + '\n' + 'company: ' + 
                           package['company']
        item['image_url'] = imageUrl + images[randomIndex]
        item['buttons'] = button
        data.attachment.payload.elements.push(item)
    })
    return data
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
    let isQueryArrival = false
    let isQueryDeparture = false
    let isQueryMaxPrice = false
    let isQueryMinPrice = false
    let isQueryCompany = false

    let queryProvince = []
    let queryKeyword = []
    let queryTravelType = []
    let queryRegion = []
    let queryArrival = []
    let queryDeparture = []
    let queryMaxPrice = []
    let queryMinPrice = []
    let queryCompany = []


    let raw_query = {
        size: 10,
    }
    let elastic_query = { 
        bool : {
            must : [],
            filter : []
        },
    }
    let text_tokenization = wordcut.cutIntoArray(message)
    //text_tokenization = text_tokenization.replace(/\|/g, ' ')

    for(i = 0; i < text_tokenization.length; i++) { 
        if(provinces.indexOf(text_tokenization[i]) !== -1) {
            isQueryProvince = true
            queryProvince.push(text_tokenization[i])
            text_tokenization[i] = ''
        }
        if(regions.indexOf(text_tokenization[i]) !== -1) {
            isQueryRegion = true
            queryRegion.push(text_tokenization[i])
            text_tokenization[i] = ''
        }
        if(companies.indexOf(text_tokenization[i]) !== -1) {
            isQueryCompany = true
            queryRegion.push(text_tokenization[i])
            text_tokenization[i] = ''

        }
        if(travel_types.indexOf(text_tokenization[i]) !== -1) {
            isQueryTravelType = true
            queryTravelType.push(text_tokenization[i])
            text_tokenization[i] = ''
        }
        if(keywords.indexOf(text_tokenization[i]) !== -1) {
            isQueryKeyword = true
            queryKeyword.push(text_tokenization[i])
            text_tokenization[i] = ''
        }
        if(text_tokenization[i] !== '') {
            if(stopwords.indexOf(text_tokenization[i]) === -1) {
                text.push(text_tokenization[i])
            }
        }
    }

    text = text.join(' ')
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
    raw_query['query'] = elastic_query
    return Package.esSearch(raw_query)
            .then((packages) => {
                if(packages.hits.total === 0) {
                    return { text: 'ไม่พบแพ็กเกจที่ค้นหาครับ กรุณาลองอีกครั้ง'}
                }
                return getItem(packages.hits.hits)
            })
}